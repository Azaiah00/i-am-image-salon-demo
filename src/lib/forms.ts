/** Post a form to Netlify Forms (detected from /public/__forms.html at deploy time). */
export async function postNetlifyForm(data: FormData): Promise<"ok" | "preview" | "err"> {
  try {
    const res = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
    });
    if (res.ok) return "ok";
    return location.hostname === "localhost" || location.hostname === "127.0.0.1" ? "preview" : "err";
  } catch {
    return "err";
  }
}
