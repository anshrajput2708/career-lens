import { NextRequest } from "next/server";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** GET: whether live Resend sends are possible (never exposes the key). */
export async function GET() {
  return Response.json({
    resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    fromDefault: process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev",
  });
}

type Stats = {
  headline?: string;
  fitScore?: number | null;
  streak?: number;
  resourcesDone?: number;
};

/**
 * POST: send a test email via Resend HTTP API (no SDK).
 * Without RESEND_API_KEY returns demo success so the UI can be exercised.
 */
export async function POST(req: NextRequest) {
  let body: { to?: string; subject?: string; stats?: Stats } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const to = (body.to || "").trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const subject =
    (body.subject || "").trim() ||
    "CareerLens — test email";

  const st = body.stats || {};
  const lines = [
    st.headline ? `<p><strong>Focus:</strong> ${esc(String(st.headline))}</p>` : "",
    st.fitScore != null && st.fitScore !== undefined
      ? `<p><strong>Readiness:</strong> ${esc(String(st.fitScore))}%</p>`
      : "",
    st.streak != null ? `<p><strong>Streak:</strong> ${esc(String(st.streak))} days</p>` : "",
    st.resourcesDone != null
      ? `<p><strong>Resources done:</strong> ${esc(String(st.resourcesDone))}</p>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const html = `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#292524">
  <h1 style="font-size:18px;margin:0 0 12px">CareerLens test</h1>
  <p style="margin:0 0 16px">This message confirms your outbound email setup.</p>
  ${lines || "<p><em>No stats were attached.</em></p>"}
  <p style="margin-top:20px;font-size:12px;color:#78716c">Sent from CareerLens dashboard · test route</p>
</body></html>`.trim();

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  if (!apiKey) {
    return Response.json({
      ok: true,
      demo: true,
      message:
        "Dry run only — add RESEND_API_KEY to .env.local to send real mail. Resend test domain allows onboarding@resend.dev as From.",
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string; id?: string; name?: string };

  if (!res.ok) {
    const msg = data.message || data.name || `Resend error (${res.status})`;
    return Response.json({ ok: false, error: msg }, { status: res.status >= 400 ? res.status : 502 });
  }

  return Response.json({ ok: true, id: data.id });
}
