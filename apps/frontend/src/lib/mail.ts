import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.emailforums.biz";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpUser = process.env.SMTP_USER || "inframeet@emailforums.biz";
const smtpPassword = process.env.SMTP_PASSWORD || "@Zasper123.";
const smtpSecure = process.env.SMTP_SECURE === "false" ? false : true;

// Create SMTP Transporter
export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: any;
    contentType?: string;
  }>;
}

export async function sendEmail({ to, subject, text, html, attachments }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "INFRAMEET"}" <${smtpUser}>`,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
      attachments,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Nodemailer SMTP Error:", error);
    return { success: false, error: error.message };
  }
}
