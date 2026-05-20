import { test, expect } from "@playwright/test";

test.describe("Security Guard & Admin Otorisasi Test", () => {
  
  test("Guest/Anonim harus diredireksi paksa ke /login saat mengakses /admin", async ({ page }) => {
    // Navigate to protected admin route
    await page.goto("/admin");

    // The middleware should redirect guest to /login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("Guest/Anonim menerima status 401 saat menembak API admin secara langsung", async ({ request }) => {
    const response = await request.get("/api/admin/expert/verify");
    
    // API endpoint should block anonymous request with 401
    expect(response.status()).toBe(401);
  });

  test("Pengguna biasa (non-admin) ditolak saat mencoba menembak API admin", async ({ request }) => {
    // We simulate a custom user session by adding a fake auth cookie (should be invalid or non-admin)
    // Here we just test general blocked behaviour on the middleware level.
    const response = await request.post("/api/admin/affiliate/batch", {
      headers: {
        "Cookie": "sb-access-token=invalid_non_admin_token_jwt"
      }
    });

    // The middleware should reject the invalid/non-admin token with 401 or 403
    expect(response.status() === 401 || response.status() === 403).toBeTruthy();
  });
});
