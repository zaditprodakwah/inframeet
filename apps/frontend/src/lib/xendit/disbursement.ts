export async function triggerXenditDisbursement(amount: number, userId: string, transactionId: string) {
  const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
  if (!xenditSecretKey) {
    console.warn("⚠️ XENDIT_SECRET_KEY is not configured in this environment. Mocking disbursement transaction.");
    return { success: true, disbursementId: `disb_mock_${Math.random().toString(36).substring(2, 11)}` };
  }

  try {
    const basicAuthHeader = Buffer.from(xenditSecretKey + ":").toString("base64");
    
    // Call the Xendit Disbursements Endpoint
    const res = await fetch("https://api.xendit.co/disbursements", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuthHeader}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `idemp-disb-${transactionId}`
      },
      body: JSON.stringify({
        external_id: `disb-${transactionId}`,
        amount: amount,
        bank_code: "BCA",
        account_holder_name: "Eksekutor Mitra",
        account_number: "1234567890",
        description: `INFRAMEET Automatic Executor Payout for transaction ${transactionId}`
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Xendit Disbursement API returned error ${res.status}: ${errorText}`);
      throw new Error(`Xendit API error: ${errorText}`);
    }

    const data = await res.json();
    return { success: true, disbursementId: data.id };
  } catch (error: any) {
    console.error("Xendit disbursement trigger failed:", error);
    throw new Error(error?.message || "Xendit API connection failed.");
  }
}
