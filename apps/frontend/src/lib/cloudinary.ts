/**
 * ==============================================================================
 * 🎥 CLOUDINARY DYNAMIC OMNICHANNEL VIDEO COMPILER UTILITY
 * Berkas: src/lib/cloudinary.ts
 * ==============================================================================
 */

/**
 * Menghasilkan URL transformasi Cloudinary dinamis yang mengonversi aset gambar statis
 * menjadi video pendek (Shorts/TikTok) dengan efek zoom/pan (Ken Burns effect)
 * serta menumpangkan layer audio soundtrack resmi INFRAMEET guna mencegah penolakan
 * hak cipta dari algoritma YouTube Shorts.
 * 
 * @param imagePublicId Public ID dari gambar dasar yang tersimpan di Cloudinary
 * @returns Tautan URL Cloudinary Video kompilasi instan
 */
export function generateCloudinaryShortVideoUrl(imagePublicId: string): string {
  const cloudinaryCloudName = "inframeet-media"; // Cloudinary Workspace account name

  // Base transformations:
  // 1. w_1080,h_1920,c_fill: Pangkas gambar ke rasio potret standar seluler (9:16)
  // 2. du_15: Setel durasi video kompilasi menjadi 15 detik (optimasi Shorts)
  // 3. e_zoompan: Terapkan efek zoom-and-pan dramatis dinamis (Ken Burns)
  // 4. l_audio:soundtrack_inframeet,fl_layer_apply: Suntikkan soundtrack audio resmi sebagai layer latar suara
  const transforms = [
    "w_1080",
    "h_1920",
    "c_fill",
    "du_15",
    "e_zoompan:z_1.4:x_15:y_-10:du_15", // Ken Burns effect (zoom 1.4x heading up-right)
    "l_audio:soundtrack_inframeet",       // Mandatory background audio soundtrack overlay
    "fl_layer_apply"                      // Apply sound sync layer
  ].join(",");

  return `https://res.cloudinary.com/${cloudinaryCloudName}/video/upload/${transforms}/${imagePublicId}.mp4`;
}
