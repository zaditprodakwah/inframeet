/**
 * 🪐 INFRAMEET - LOCAL WORKER STEALTH IP ROTATOR
 * ==============================================================================
 * Skrip otomatisasi lokal untuk mendeteksi pemblokiran (IP Banned) dan melakukan
 * rotasi alamat IP seluler secara gratis melalui USB debugging (ADB).
 * 
 * Cara Menjalankan:
 * $ node scripts/guerrilla-ip-rotator.js
 */

const { exec } = require('child_process');

async function checkIpAndRotate() {  
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    console.log(`[+] Alamat IP Publik Saat Ini: ${ip}`);

    // Uji apakah terkena blokir oleh situs target
    const testFetch = await fetch('https://sinta.kemdikbud.go.id/', { signal: AbortSignal.timeout(4000) });
    if (testFetch.status === 429 || testFetch.status === 403) {
      console.warn("[⚠️] Terdeteksi Rate Limit/IP Banned! Memulai rotasi seluler...");
      await rotateMobileTethering();
    } else {
      console.log("[✅] Koneksi aman. Melanjutkan proses pengikisan data...");
    }
  } catch (err) {
    console.error("[⚠️] Koneksi terputus/Timeout. Memulai rotasi seluler...");
    await rotateMobileTethering();
  }
}

function rotateMobileTethering() {  
  return new Promise((resolve) => {
    // Jalankan perintah ADB via USB tethering ponsel Android untuk menyalakan/mematikan Airplane Mode  
    exec('adb shell settings put global airplane_mode_on 1 && adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state true', () => {  
      console.log("    [->] Mode Pesawat AKTIF (IP sedang dilepas...)");  
      setTimeout(() => {  
        exec('adb shell settings put global airplane_mode_on 0 && adb shell am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false', () => {  
          console.log("    [->] Mode Pesawat NONAKTIF (Mengikat IP baru...)");  
          setTimeout(() => {  
            resolve();  
          }, 4000); // Tunggu sinyal seluler kembali stabil  
        });  
      }, 2000);  
    });  
  });
}

// Jalankan pemeriksaan awal
console.log("🚀 Memulai monitoring siluman rotasi IP seluler...");
checkIpAndRotate();

// Jalankan pengecekan berkala setiap 2.5 menit
setInterval(checkIpAndRotate, 150000);
