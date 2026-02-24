import Image from "next/image";

import type { ProjectImageModel } from "@/lib/projects/types";

type ImageGalleryProps = {
  images: ProjectImageModel[];
};

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <section className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Images</h2>
      {images.length === 0 ? (
        <p className="mt-3 text-sm text-parchment-ink/80">No images available.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded border border-parchment-border bg-white/40">
              <Image src={image.imageUrl} alt={image.caption || "Project image"} width={800} height={480} className="h-44 w-full object-cover" />
              <figcaption className="p-3 text-sm text-parchment-ink/85">{image.caption || image.storagePath}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
