import os
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, HTTPServer

class ProxyCachingHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # 1. Rewrite root path to serve the bluestone homepage index.html under root /
        if self.path == '/' or self.path == '/index.html':
            print("[Server] Rewriting root request to serve Bluestone home page.")
            self.path = '/www.bluestone.com/index.html'

        # Clean path (strip query params for check)
        clean_path = self.path.split('?')[0]
        parts = [p for p in clean_path.split('/') if p]
        
        # Check if the path belongs to our domain folders
        is_domain_folder = False
        if parts:
            first_part = parts[0]
            if ('.' in first_part or first_part.endswith('.com') or first_part.endswith('.net')):
                is_domain_folder = True
                
        if is_domain_folder:
            # 1. Handle downloaded domain folders (e.g. /npimg2.bluestone.com/...)
            # If it's a dynamic API call or contains query parameters, proxy it live
            if 'page.bluestone.com/page/' in self.path or '?' in self.path:
                remote_url = "https:/" + self.path
                print(f"[Proxy] Dynamic API request. Proxying live: {remote_url}")
                try:
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
                    }
                    req = urllib.request.Request(remote_url, headers=headers)
                    with urllib.request.urlopen(req) as response:
                        self.send_response(response.status)
                        for k, v in response.headers.items():
                            self.send_header(k, v)
                        self.end_headers()
                        self.wfile.write(response.read())
                        return
                except Exception as e:
                    print(f"[Proxy] Error proxying live API {remote_url}: {e}")
                    self.send_error(502, f"Bad Gateway: {e}")
                    return

            # For static assets, check if they exist locally
            local_path = self.translate_path(self.path)
            if not os.path.exists(local_path) and not os.path.isdir(local_path):
                remote_url = "https:/" + clean_path
                print(f"[Proxy] File missing locally. Fetching and caching: {remote_url}")
                try:
                    os.makedirs(os.path.dirname(local_path), exist_ok=True)
                    req = urllib.request.Request(
                        remote_url,
                        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'}
                    )
                    with urllib.request.urlopen(req) as response:
                        data = response.read()
                        with open(local_path, 'wb') as f:
                            f.write(data)
                    print(f"[Proxy] Successfully cached: {local_path}")
                except Exception as e:
                    print(f"[Proxy] Error fetching {remote_url}: {e}")
            
            # Serve the file from local disk
            super().do_GET()
        else:
            # 2. Handle root-relative paths (e.g. /api/..., /user-context, /icons/...)
            local_path = self.translate_path(self.path)
            if os.path.exists(local_path) and not os.path.isdir(local_path):
                super().do_GET()
                return
                
            # Proxy root-relative requests to the live site: https://www.bluestone.com
            remote_url = "https://www.bluestone.com" + self.path
            print(f"[Proxy] Routing root-relative request to live site: {remote_url}")
            try:
                # Forward request headers (excluding Host)
                headers = {}
                for k, v in self.headers.items():
                    if k.lower() != 'host':
                        headers[k] = v
                
                # Force Firefox user agent to avoid bot block
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
                
                req = urllib.request.Request(remote_url, headers=headers)
                with urllib.request.urlopen(req) as response:
                    self.send_response(response.status)
                    # Forward headers back to client
                    for k, v in response.headers.items():
                        self.send_header(k, v)
                    self.end_headers()
                    self.wfile.write(response.read())
            except urllib.error.HTTPError as e:
                # Forward the error status and response from remote server
                self.send_response(e.code)
                for k, v in e.headers.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                print(f"[Proxy] General error proxying {remote_url}: {e}")
                self.send_error(502, f"Bad Gateway: {e}")


if __name__ == '__main__':
    # Start server on port 8080
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, ProxyCachingHTTPRequestHandler)
    print("Proxy Caching Server running on http://localhost:8080/ ...")
    httpd.serve_forever()

