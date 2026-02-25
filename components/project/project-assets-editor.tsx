import {
  createProjectImageAction,
  createProjectLinkAction,
  deleteProjectImageAction,
  deleteProjectLinkAction
} from "@/app/(protected)/projects/[projectId]/actions";
import type { ProjectImageModel, ProjectLinkModel } from "@/lib/projects/types";

type ProjectAssetsEditorProps = {
  projectId: string;
  links: ProjectLinkModel[];
  images: ProjectImageModel[];
};

export function ProjectAssetsEditor({ projectId, links, images }: ProjectAssetsEditorProps) {
  return (
    <section id="assets-editor" className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Links and Images Editing</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">
        Add/remove important links and image references for this project. Add an image via storage path or allowlisted HTTPS host.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded border border-parchment-border bg-parchment-base/70 p-4">
          <h3 className="text-lg font-semibold text-parchment-green">Important Links</h3>
          <form action={createProjectLinkAction} className="mt-3 space-y-2">
            <input type="hidden" name="projectId" value={projectId} />
            <input name="label" placeholder="Label" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
            <input name="url" placeholder="https://..." required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
            <button type="submit" className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base">
              Add Link
            </button>
          </form>

          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.id} className="flex items-center justify-between gap-2 text-sm">
                <a href={link.url} target="_blank" rel="noreferrer" className="text-parchment-green underline">
                  {link.label}
                </a>
                <form action={deleteProjectLinkAction}>
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="linkId" value={link.id} />
                  <button type="submit" className="rounded border border-red-700 bg-red-700 px-2 py-1 text-xs font-semibold text-white">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-parchment-border bg-parchment-base/70 p-4">
          <h3 className="text-lg font-semibold text-parchment-green">Images</h3>
          <form action={createProjectImageAction} className="mt-3 space-y-2">
            <input type="hidden" name="projectId" value={projectId} />
            <input
              name="storagePath"
              placeholder="Storage path or image URL"
              required
              className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm"
            />
            <input name="caption" placeholder="Caption" required className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2 text-sm" />
            <button type="submit" className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-parchment-base">
              Add Image
            </button>
          </form>

          <ul className="mt-3 space-y-2">
            {images.map((image) => (
              <li key={image.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate">{image.caption}</span>
                <form action={deleteProjectImageAction}>
                  <input type="hidden" name="projectId" value={projectId} />
                  <input type="hidden" name="imageId" value={image.id} />
                  <button type="submit" className="rounded border border-red-700 bg-red-700 px-2 py-1 text-xs font-semibold text-white">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
