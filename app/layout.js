export const metadata = {
  title: "Building a Scalable Sales Process · VID I/O",
  description: "VID I/O Summit keynote — Shariful Islam, Vidiosa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
