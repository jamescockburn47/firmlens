export type Entry = {
  id: string; firm: string; title: string; url: string; publishedDate: string | null;
  region: string; category: string; summary: string; evidenceQuote: string; verifiedAt: string;
  aiSummary: string | null; aiQuote?: string | null; aiGeneratedAt: string | null; lastCheckedAt: string | null;
  changeStatus: "new" | "unchanged" | "changed" | "error" | null; changeSummary: string | null;
};
export type History = { id: string; checkedAt: string; status: string; changeSummary: string | null; aiSummary: string | null };
export type Data = { entries: Entry[]; stats: { total: number; firms: number; checkedAt: string | null }; viewer: { isOwner: boolean }; schedule: { label: string } };
export const categories: Record<string, string> = { adoption: "AI adoption", partnership: "Partnerships", product: "Products & services", policy: "AI policies", training: "Training" };
export function changedSources(entries: Entry[]) { return entries.filter(entry => entry.changeStatus === "changed"); }
export function dateLabel(value: string | null | undefined) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not recorded" : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }).format(date);
}
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, { cache: "no-store", ...(body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) });
  const result = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) throw new Error(result?.error || "The request could not be completed. Please try again.");
  if (!result) throw new Error("The server returned an unreadable response. Please try again.");
  return result as T;
}
