"use client";

import { useEffect, useState } from "react";
import { useWebMCP, type WebMCPToolResponse } from "use-webmcp-tool";

type Tool = { name: string; description: string; inputSchema: object };
type RpcResult = { tools?: Tool[] } & Partial<WebMCPToolResponse>;

async function rpc(method: string, params: object, signal: AbortSignal): Promise<RpcResult> {
  const response = await fetch("/api/tools", {
    method: "POST", credentials: "same-origin", cache: "no-store", signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: crypto.randomUUID(), method, params }),
  });
  if (!response.ok) throw new Error("FirmLens could not complete the tool request.");
  const payload = await response.json() as { result?: RpcResult; error?: { message?: string } };
  if (payload.error || !payload.result) throw new Error(payload.error?.message || "FirmLens returned an invalid tool response.");
  return payload.result;
}

function RegisteredTool({ tool }: { tool: Tool }) {
  const registration = useWebMCP({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    execute: async (args: Record<string, unknown>, { signal }) => {
      const result = await rpc("tools/call", { name: tool.name, arguments: args }, signal);
      if (!Array.isArray(result.content)) throw new Error("FirmLens returned an invalid tool result.");
      if (!result.isError && !tool.name.startsWith("read_")) {
        window.dispatchEvent(new Event("firmlens-updated"));
      }
      return result as WebMCPToolResponse;
    },
  });
  useEffect(() => {
    if (registration.error) console.error(JSON.stringify({ event: "firmlens_browser_tool_registration_failed", tool: tool.name }));
  }, [registration.error, tool.name]);
  return null;
}

export function BrowserTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    rpc("tools/list", {}, controller.signal).then(result => {
      if (result.isError || !Array.isArray(result.tools)) throw new Error("Tool discovery failed.");
      setTools(result.tools);
    }).catch(() => {
      // Unmount cancellation is expected; actual discovery failures remain observable.
      if (!controller.signal.aborted) console.error(JSON.stringify({ event: "firmlens_browser_tool_discovery_failed" }));
    });
    return () => controller.abort();
  }, []);
  return <>{tools.map(tool => <RegisteredTool key={tool.name} tool={tool} />)}</>;
}
