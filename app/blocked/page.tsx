export default function BlockedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "760px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
          Service unavailable in your region
        </h1>

        <p style={{ color: "#bbb", lineHeight: "1.7", marginBottom: "20px" }}>
          This website is not intended for access in all jurisdictions.
          Availability may be limited based on location, local law, or
          compliance requirements.
        </p>

        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            border: "1px solid #333",
            padding: "10px 16px",
            borderRadius: "10px",
            display: "inline-block",
          }}
        >
          Back to Home
        </a>
      </div>
    </main>
  )
}
