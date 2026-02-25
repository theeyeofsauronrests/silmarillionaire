import { updateProjectAction } from "@/app/(protected)/projects/[projectId]/actions";
import type { ProjectHeaderModel } from "@/lib/projects/types";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

type ProjectEditorFormProps = {
  project: ProjectHeaderModel;
};

export function ProjectEditorForm({ project }: ProjectEditorFormProps) {
  return (
    <section id="project-editor" className="rounded-lg border border-parchment-border bg-parchment-base p-5 shadow-parchment">
      <h2 className="text-2xl font-semibold text-parchment-green">Project Editing</h2>
      <p className="mt-1 text-sm text-parchment-ink/80">Update project metadata visible across the directory.</p>

      <form action={updateProjectAction} className="mt-4 space-y-3">
        <input type="hidden" name="projectId" value={project.id} />

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-parchment-green">Name</span>
          <input
            name="name"
            defaultValue={project.name}
            required
            className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-parchment-green">Codename</span>
          <input
            name="codename"
            defaultValue={project.codename}
            required
            className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-parchment-green">Description</span>
          <textarea
            name="description"
            defaultValue={project.description}
            required
            rows={4}
            className="w-full rounded border border-parchment-border bg-parchment-base px-3 py-2"
          />
        </label>

        <FormSubmitButton
          label="Save Project"
          className="rounded border border-parchment-green bg-parchment-green px-4 py-2 text-sm font-semibold text-[#191919]"
        />
      </form>
    </section>
  );
}
