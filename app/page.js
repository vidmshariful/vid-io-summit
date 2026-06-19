// "/" redirects to /deck/index.html (see next.config.js).
// This is only a fallback link if the redirect is ever bypassed.
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#070B14",
        color: "#EDF2FB",
      }}
    >
      <a
        href="/deck/index.html"
        style={{ color: "#5B9DFF", fontSize: 20, textDecoration: "none" }}
      >
        Open the keynote &rarr;
      </a>
    </main>
  );
}
