export default function DisclaimerPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: "1.8",
        }}
      >
        <h1 style={{ fontSize: "2.2rem", marginBottom: "24px" }}>Disclaimer</h1>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          The information, guides, scripts, tools, and recommendations on this
          website are provided for general educational and informational purposes
          only.
        </p>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          This website is intended for lawful privacy, security, networking, and
          self-hosting use only. We do not provide legal advice, and we do not
          represent that any technology, provider, script, protocol, or service
          mentioned on this site is lawful or available in every country or
          jurisdiction.
        </p>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          Users are solely responsible for ensuring that their access to and use
          of this website, and their use of any VPN, VPS, hosting provider,
          protocol, script, or related service, complies with all laws,
          regulations, platform rules, and service terms that apply in their
          location.
        </p>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          We do not encourage unlawful access, unlawful circumvention,
          infringement, fraud, or any attempt to bypass legal restrictions or
          platform controls. Any examples, tutorials, or recommendations on this
          site are provided for lawful personal or business use only.
        </p>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          While we aim to keep information accurate and up to date, we make no
          guarantee that all content is complete, current, accurate, available,
          or suitable for your specific circumstances. Your use of this site is
          at your own risk.
        </p>

        <p style={{ color: "#cfcfcf", marginBottom: "18px" }}>
          To the maximum extent permitted by law, we disclaim liability for
          loss, damage, claims, penalties, or consequences arising from the use
          of this website or reliance on its content. Nothing in this disclaimer
          excludes any rights that cannot legally be excluded under applicable
          law.
        </p>

        <div style={{ marginTop: "32px" }}>
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
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
