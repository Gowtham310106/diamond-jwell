import os
import urllib.request
import urllib.error
import http.client
from http.server import SimpleHTTPRequestHandler, HTTPServer

class TanishqProxyCachingHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # 1. Map root requests to the Tanishq homepage index
        if self.path == '/' or self.path == '/index.html':
            print("[Server] Serving Tanishq home page index.html.")
            self.path = '/index.html'

        # Clean query parameters for files checking
        clean_path = self.path.split('?')[0]
        
        # If it is a relative demandware static or image path (e.g., /on/demandware.static/..., /dw/image/...)
        is_tanishq_asset = (
            self.path.startswith('/on/demandware') or 
            self.path.startswith('/dw/image') or 
            self.path.startswith('/on/demandware.store')
        )

        if is_tanishq_asset:
            # Handle dynamic endpoint/API requests via direct live proxy
            if '/on/demandware.store' in self.path or '?' in self.path:
                remote_url = "https://www.tanishq.co.in" + self.path
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
                    print(f"[Proxy] Error proxying API request {remote_url}: {e}")
                    self.send_error(502, f"Bad Gateway: {e}")
                    return

            # For static demands/assets, check local storage
            local_path = self.translate_path(self.path)
            # Remove query string from local file path checking
            local_clean_path = self.translate_path(clean_path)

            if not os.path.exists(local_clean_path) and not os.path.isdir(local_clean_path):
                remote_url = "https://www.tanishq.co.in" + clean_path
                print(f"[Proxy] Asset missing locally. Fetching: {remote_url}")
                try:
                    os.makedirs(os.path.dirname(local_clean_path), exist_ok=True)
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'
                    }
                    req = urllib.request.Request(remote_url, headers=headers)
                    with urllib.request.urlopen(req) as response:
                        data = response.read()
                        with open(local_clean_path, 'wb') as f:
                            f.write(data)
                    print(f"[Proxy] Cached: {local_clean_path}")
                except Exception as e:
                    print(f"[Proxy] Error downloading {remote_url}: {e}")

            # Update paths to point to clean local paths
            self.path = clean_path

        # Standard file serving
        super().do_GET()

if __name__ == '__main__':
    # Serve Tanishq on port 8080
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, TanishqProxyCachingHandler)
    print("Tanishq Local Server running on http://localhost:8080/ ...")
    httpd.serve_forever()
