/**
 * Per-tool processing stub. No real document-generation / image-editing /
 * text-assistant business logic exists anywhere in this project yet — this
 * is the seam where each tool's actual implementation plugs in later. For
 * now every native tool resolves successfully after a short simulated delay,
 * which is enough to exercise the auth/credit/timeout/logging pipeline
 * around it end-to-end.
 */
export async function runTool(toolId: string): Promise<{ ok: true }> {
  const simulatedLatencyMs = 400 + Math.round(Math.random() * 400);
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs));
  return { ok: true };
}

export class ToolTimeoutError extends Error {
  constructor() {
    super("Tool execution timed out");
    this.name = "ToolTimeoutError";
  }
}

export async function runToolWithTimeout(toolId: string, timeoutMs: number) {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ToolTimeoutError()), timeoutMs);
  });

  try {
    return await Promise.race([runTool(toolId), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
