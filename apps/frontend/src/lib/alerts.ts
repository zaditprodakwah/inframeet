/**
 * lib/alerts.ts
 * Centralized alerting dispatcher for critical system events.
 * Sends to Telegram and/or Discord via webhook.
 * Usage: import { dispatchAlert } from "@/lib/alerts"
 */
import { AlertPayload } from "@/lib/schemas/tools";

const LEVEL_EMOJI: Record<string, string> = {
  INFO: "ℹ️",
  WARNING: "⚠️",
  CRITICAL: "🚨",
};

function buildMessage(payload: AlertPayload): string {
  const emoji = LEVEL_EMOJI[payload.level] ?? "🔔";
  const lines = [
    `${emoji} *[INFRAMEET ${payload.level}]* — ${payload.title}`,
    ``,
    `📋 ${payload.body}`,
    ``,
    payload.auditId ? `🆔 Audit ID: \`${payload.auditId}\`` : null,
    `🕐 ${payload.timestamp}`,
  ].filter(Boolean);

  return lines.join("\n");
}

async function dispatchToTelegram(payload: AlertPayload): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = buildMessage(payload);
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

async function dispatchToDiscord(payload: AlertPayload): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const emoji = LEVEL_EMOJI[payload.level] ?? "🔔";
  const colorMap: Record<string, number> = {
    INFO: 0x6366f1,
    WARNING: 0xf59e0b,
    CRITICAL: 0xef4444,
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `${emoji} ${payload.title}`,
          description: payload.body,
          color: colorMap[payload.level] ?? 0x6366f1,
          fields: [
            payload.auditId
              ? { name: "Audit ID", value: `\`${payload.auditId}\``, inline: true }
              : null,
            { name: "Timestamp", value: payload.timestamp, inline: true },
          ].filter(Boolean),
          footer: { text: "INFRAMEET Alert System" },
        },
      ],
    }),
  });
}

/**
 * Dispatch an alert to all configured channels (Telegram, Discord).
 * Silently fails if env vars are not set (non-blocking in production).
 */
export async function dispatchAlert(payload: AlertPayload): Promise<void> {
  try {
    await Promise.allSettled([
      dispatchToTelegram(payload),
      dispatchToDiscord(payload),
    ]);
  } catch (err: unknown) {
    console.error("[Alert Dispatch Error]", err);
  }
}

/**
 * Convenience helpers for common alert scenarios
 */
export const Alerts = {
  escrowHeld: (escrowId: string, amount: number) =>
    dispatchAlert({
      level: "WARNING",
      title: "Escrow Funds Held",
      body: `Escrow ${escrowId} telah dipindahkan ke status HELD. Nominal: Rp${amount.toLocaleString("id-ID")}`,
      auditId: `INF-ESC-${escrowId.slice(0, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    }),

  invoiceSettled: (invoiceId: string, amount: number) =>
    dispatchAlert({
      level: "INFO",
      title: "Invoice Settled via Xendit",
      body: `Invoice ${invoiceId} berhasil dibayarkan. Nominal: Rp${amount.toLocaleString("id-ID")}`,
      auditId: `INF-INV-${invoiceId.slice(0, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    }),

  criticalError: (context: string, message: string) =>
    dispatchAlert({
      level: "CRITICAL",
      title: `System Error: ${context}`,
      body: message,
      auditId: `INF-ERR-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    }),

  newSubmission: (auditId: string, pathway: string) =>
    dispatchAlert({
      level: "INFO",
      title: "New Project Brief Submitted",
      body: `Intake baru via jalur ${pathway.toUpperCase()} telah dimasukkan ke antrean audit.`,
      auditId,
      timestamp: new Date().toISOString(),
    }),
};
