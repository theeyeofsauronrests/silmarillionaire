import { approveWaitlistAction, denyWaitlistAction } from "@/app/(protected)/admin/waitlist/actions";
import type { WaitlistRequest } from "@/lib/admin/types";

type WaitlistTableProps = {
  requests: WaitlistRequest[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function WaitlistTable({ requests }: WaitlistTableProps) {
  const pending = requests.filter((request) => request.status === "pending");

  if (pending.length === 0) {
    return (
      <p className="rounded border border-parchment-border bg-parchment-base p-4 text-sm text-parchment-ink/80">
        No pending waitlist requests.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-parchment-border bg-parchment-base shadow-parchment">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-parchment-border text-left text-parchment-green">
            <th className="px-3 py-2 font-semibold">Name</th>
            <th className="px-3 py-2 font-semibold">Email</th>
            <th className="px-3 py-2 font-semibold">Requested</th>
            <th className="px-3 py-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((request) => (
            <tr key={request.id} className="border-b border-parchment-border/70">
              <td className="px-3 py-2">{request.name}</td>
              <td className="px-3 py-2">{request.email}</td>
              <td className="px-3 py-2">{formatDate(request.requestedAt)}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <form action={approveWaitlistAction}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <button
                      type="submit"
                      className="rounded border border-parchment-green bg-parchment-green px-3 py-1.5 text-xs font-semibold text-[#191919]"
                    >
                      Approve
                    </button>
                  </form>

                  <form action={denyWaitlistAction}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <button
                      type="submit"
                      className="rounded border border-red-700 bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Deny
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
