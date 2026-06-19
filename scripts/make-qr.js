// Regenerate the QR on slide 38.
// Usage:  node scripts/make-qr.js "https://your-real-snapshot-link"
const qrcode = require("qrcode");
const url = process.argv[2] || "https://vidiosa.com";
qrcode
  .toFile("assets/qr.svg", url, {
    type: "svg",
    margin: 1,
    width: 600,
    color: { dark: "#101828", light: "#ffffff" },
  })
  .then(() => console.log("Wrote assets/qr.svg ->", url))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
