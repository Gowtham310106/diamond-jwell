import { listMedia } from "@/lib/cms/repo";
import { storageMode } from "@/lib/storage";
import { Flash, Notice, PageHeader } from "@/components/admin/ui";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default async function MediaAdmin(props: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await props.searchParams;
  const media = await listMedia();
  const mode = storageMode();

  return (
    <>
      <PageHeader title="Media" description={`${media.length} files. Photos and videos used anywhere on the site. Upload here or straight from any product or page form.`} />
      <Flash saved={saved} />
      {mode === "local" && (
        <div className="mb-6">
          <Notice tone="warn">
            Uploads are being written to the server's disk because Cloudflare R2 is not configured. On Vercel that disk is wiped on every deploy — set the R2_* variables before uploading real photography.
          </Notice>
        </div>
      )}
      <MediaLibrary initial={media} />
    </>
  );
}
