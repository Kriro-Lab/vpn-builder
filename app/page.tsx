"use client"

import { useState } from "react"
import { Shield, Zap, Globe, Server } from "lucide-react"

export default function VPNBuilder() {
  const [protocol, setProtocol] = useState("WireGuard")
  const [provider, setProvider] = useState("Oracle Cloud")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

const copyCommand = (text: string, index: number) => {
  navigator.clipboard.writeText(text)
  setCopiedIndex(index)

  setTimeout(() => {
    setCopiedIndex(null)
  }, 1500)
}

  const protocolInfo: Record<string, { title: string; description: string; commands: string[] }> = {
    WireGuard: {
      title: "WireGuard Setup",
      description: "Best for most people. Fast, modern, and simple.",
      commands: [
        "sudo apt update && sudo apt upgrade -y",
        "sudo apt install -y wireguard",
        "wg genkey | tee privatekey | wg pubkey > publickey",
      ],
    },
    OpenVPN: {
      title: "OpenVPN Setup",
      description: "Best for compatibility across lots of devices.",
      commands: [
        "sudo apt update && sudo apt upgrade -y",
        "wget https://git.io/vpn -O openvpn-install.sh",
        "chmod +x openvpn-install.sh && sudo ./openvpn-install.sh",
      ],
    },
    IKEv2: {
      title: "IKEv2 Setup",
      description: "Great for mobile devices and stable reconnection.",
      commands: [
        "sudo apt update && sudo apt upgrade -y",
        "wget https://git.io/strongswan -O ikev2-install.sh",
        "chmod +x ikev2-install.sh && sudo ./ikev2-install.sh",
      ],
    },
  }
  const providerInfo: Record<string, {
  price: string
  size: string
  regionTip: string
  notes: string[]
}> = {
  "Oracle Cloud": {
    price: "Free tier possible",
    size: "Always Free VM or small ARM instance",
    regionTip: "Choose the region closest to you",
    notes: [
      "Great low-cost starting option",
      "Make sure your security list allows VPN traffic",
      "Good for personal use and testing"
    ],
  },
  AWS: {
    price: "About $4–$8/month",
    size: "t3.micro or Lightsail equivalent",
    regionTip: "Use the nearest region for lower latency",
    notes: [
      "Reliable and flexible",
      "Remember to open the right inbound ports",
      "Easy to scale later"
    ],
  },
  DigitalOcean: {
    price: "About $6/month",
    size: "Basic Droplet",
    regionTip: "Pick the closest datacenter",
    notes: [
      "Simple VPS setup",
      "Very beginner friendly",
      "Fast to deploy and manage"
    ],
  },
  Vultr: {
    price: "About $5–$6/month",
    size: "Regular Cloud Compute",
    regionTip: "Choose the nearest location",
    notes: [
      "Cheap and straightforward",
      "Good balance of cost and simplicity",
      "Works well for self-hosted VPNs"
    ],
  },
}

  const selected = protocolInfo[protocol]
  const selectedProvider = providerInfo[provider]
  

const [copied, setCopied] = useState(false)

  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "14px",
    background: "white",
  }

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: "20px",
    border: active ? "2px solid #2563eb" : "1px solid #ddd",
    borderRadius: "12px",
    background: active ? "#eff6ff" : "white",
    cursor: "pointer",
    minWidth: "160px",
    textAlign: "center",
  })

  return (
    <main
      style={{
        fontFamily: "system-ui, Arial, sans-serif",
        padding: "40px 20px",
        maxWidth: "960px",
        margin: "0 auto",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "64px", lineHeight: 1, marginBottom: "20px", fontWeight: 800 }}>
        Build Your Own VPN
      </h1>

      <p style={{ fontSize: "20px", marginBottom: "40px", color: "#555", maxWidth: "700px" }}>
        Build your own private VPN in 5 minutes — no subscriptions, no experience needed.
      </p>
      <div
  style={{
    background: "#f8fafc",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "30px",
  }}
>
  <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
    Start Here (Quick Setup)
  </h2>

  <p style={{ marginBottom: "10px", color: "#555" }}>
    If you’re new, just follow this:
  </p>

  <ol style={{ paddingLeft: "20px", marginBottom: "10px" }}>
    <li>Choose <strong>WireGuard</strong></li>
    <li>Select <strong>Oracle Cloud (Free)</strong></li>
    <li>Click <strong>Launch Server</strong></li>
    <li>Copy the setup script</li>
  </ol>

  <p style={{ fontWeight: "bold" }}>Takes ~5 minutes</p>
</div>
      <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
    fontSize: "16px",
    color: "#1f2937",
    background: "#fff7ed",
    border: "1px solid #fdba74",
    padding: "12px 16px",
    borderRadius: "10px",
    fontWeight: 500,
  }}
>
  💡 Tip: Some providers may require a payment method or offer better performance on paid plans.
</div>
      

      

      

<div style={{ display: "grid", gap: "20px" }}>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "50px",
        }}
         >
      
        
    
        <div style={cardStyle}>
          <Shield size={28} />
          <h3>More Privacy</h3>
          <p>Your server, your traffic</p>
        </div>

        <div style={cardStyle}>
          <Zap size={28} />
          <h3>Fast Speed</h3>
          <p>No shared VPN pool</p>
        </div>

        <div style={cardStyle}>
          <Globe size={28} />
          <h3>Any Region</h3>
          <p>Choose your server location</p>
        </div>

        <div style={cardStyle}>
          <Server size={28} />
          <h3>Full Control</h3>
          <p>You control the setup</p>
        </div>
      </div>

      <h2 style={{ fontSize: "42px", marginBottom: "10px", fontWeight: 800 }}>
        Step 1: Choose Your VPN Protocol
      </h2>

      <p style={{ marginBottom: "25px", fontSize: "18px" }}>
        Pick the protocol that fits your needs.
      </p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <button onClick={() => setProtocol("WireGuard")} style={buttonStyle(protocol === "WireGuard")}>
          <strong>WireGuard</strong>
          <div style={{ marginTop: "10px", color: "#2563eb" }}>Fastest modern VPN</div>
        </button>

        <button onClick={() => setProtocol("OpenVPN")} style={buttonStyle(protocol === "OpenVPN")}>
          <strong>OpenVPN</strong>
          <div style={{ marginTop: "10px", color: "#2563eb" }}>Most compatible</div>
        </button>

        <button onClick={() => setProtocol("IKEv2")} style={buttonStyle(protocol === "IKEv2")}>
          <strong>IKEv2</strong>
          <div style={{ marginTop: "10px", color: "#2563eb" }}>Great for mobile</div>
        </button>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>
  {selected.title}
</h3>

<p style={{ color: "#555", marginBottom: "20px" }}>
  {selected.description}
</p>

<h4 style={{ fontSize: "20px", marginBottom: "12px" }}>
  Starter Commands
</h4>
<div style={{ display: "grid", gap: "12px" }}>
  {selected.commands.map((command, index) => (
    <div
      key={command}
      style={{
        background: "#111827",
        color: "white",
        padding: "14px",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span>{command}</span>

      <button
        onClick={() => copyCommand(command, index)}
        style={{
          background: "#2563eb",
          border: "none",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        {copiedIndex === index ? "Copied ✓" : "Copy"}
      </button>
    </div>
  ))}
  </div>
</div>
  <h2 style={{ fontSize: "32px", marginBottom: "10px", fontWeight: 800 }}>
    Step 2: Choose Cloud Provider
  </h2>

  <p style={{ marginBottom: "25px", fontSize: "18px" }}>
    Pick where you want to host your VPN server.
  </p>

  <div
    style={{
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "30px",
    }}
  >
    <button onClick={() => setProvider("Oracle Cloud")} style={buttonStyle(provider === "Oracle Cloud")}>
      <strong>Oracle Cloud</strong>
      <div style={{ marginTop: "10px", color: "#2563eb" }}>Free tier option</div>
    </button>

    <button onClick={() => setProvider("AWS")} style={buttonStyle(provider === "AWS")}>
      <strong>AWS</strong>
      <div style={{ marginTop: "10px", color: "#2563eb" }}>Popular and flexible</div>
    </button>

    <button onClick={() => setProvider("DigitalOcean")} style={buttonStyle(provider === "DigitalOcean")}>
      <strong>DigitalOcean</strong>
      <div style={{ marginTop: "10px", color: "#2563eb" }}>Simple VPS setup</div>
    </button>

    <button onClick={() => setProvider("Vultr")} style={buttonStyle(provider === "Vultr")}>
      <strong>Vultr</strong>
      <div style={{ marginTop: "10px", color: "#2563eb" }}>Cheap server option</div>
    </button>
  </div>

  <div
    style={{
      background: "#f8fafc",
      border: "1px solid #ddd",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
<h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Selected Provider</h3>
<p style={{ fontSize: "20px", margin: 0 }}>
  {provider}
</p>
  </div>
<div
  style={{
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "30px",
  }}
>
  <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
    Step 3: Generate Setup Plan
  </h2>

  <p style={{ marginBottom: "25px", fontSize: "18px", color: "#555" }}>
    Based on your selections, here is your recommended setup.
  </p>

  <div style={{ display: "grid", gap: "18px" }}>
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #ddd",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>
  Summary
</h3>

<p><strong>Protocol:</strong> {protocol}</p>
<p><strong>Provider:</strong> {provider}</p>
<p><strong>Estimated cost:</strong> {selectedProvider.price}</p>
<p><strong>Server size:</strong> {selectedProvider.size}</p>

</div>

<div style={{ marginTop: "20px" }}>
  <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
    Recommended for most people
  </p>

  <a
    href={
      provider === "Oracle Cloud"
        ? "https://www.oracle.com/cloud/free/"
        : provider === "AWS"
        ? "https://aws.amazon.com/free/"
        : "https://www.vultr.com/"
    }
    target="_blank"
    style={{
      display: "inline-block",
      background: "#2563eb",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "bold",
    }}
  >
    🚀 Launch Server
  </a>
</div>
    <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
  Step 4: Deploy Your Server
</h2>

<div style={{
  background: "#f8fafc",
  border: "1px solid #ddd",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "30px",
}}>
  <ol style={{ paddingLeft: "20px", marginBottom: "10px" }}>
    <li>Log into your cloud provider</li>
    <li>Create a new virtual machine</li>
    <li>Choose Ubuntu (recommended)</li>
    <li>Select a small or free-tier instance</li>
    <li>Copy your server’s public IP</li>
  </ol>

  <p style={{ color: "#555" }}>
    Once your server is running, you’re ready to install your VPN.
  </p>
</div>
  <section style={{ marginTop: "60px", marginBottom: "60px" }}>
  <h2
    style={{
      fontSize: "2rem",
      marginBottom: "12px",
      color: "white",
      textAlign: "center",
    }}
  >
    Choose the Right Protocol
  </h2>

  <p
    style={{
      color: "#aaa",
      textAlign: "center",
      maxWidth: "760px",
      margin: "0 auto 30px",
      lineHeight: "1.6",
    }}
  >
    Your provider is where the server runs. Your protocol is how your VPN connects.
    Most people should start with WireGuard, but each option has its strengths.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
    }}
  >
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h3 style={{ color: "white", marginBottom: "10px" }}>WireGuard</h3>
      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        Fast, modern, and the best choice for most users. Great for speed,
        simplicity, and mobile devices.
      </p>
      <p style={{ color: "#888", fontSize: "0.95rem" }}>
        Best for: beginners, speed, everyday use
      </p>
    </div>

    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h3 style={{ color: "white", marginBottom: "10px" }}>OpenVPN</h3>
      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        Well known and widely supported. A strong option if you want broad
        compatibility and do not mind a little extra setup.
      </p>
      <p style={{ color: "#888", fontSize: "0.95rem" }}>
        Best for: compatibility, older devices, flexibility
      </p>
    </div>

    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h3 style={{ color: "white", marginBottom: "10px" }}>IKEv2</h3>
      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        A solid option for phones and tablets because it reconnects well when
        switching between Wi-Fi and mobile data.
      </p>
      <p style={{ color: "#888", fontSize: "0.95rem" }}>
        Best for: mobile users, stable reconnection
      </p>
    </div>
  </div>
</section>

<section style={{ marginTop: "60px", marginBottom: "60px" }}>
  <h2
    style={{
      fontSize: "2rem",
      marginBottom: "12px",
      color: "white",
      textAlign: "center",
    }}
  >
    Recommended Hosting Providers
  </h2>

  <p
    style={{
      color: "#aaa",
      textAlign: "center",
      maxWidth: "760px",
      margin: "0 auto 18px",
      lineHeight: "1.6",
    }}
  >
    Pick a provider based on your budget and experience level. Start free, keep
    it simple, or choose the easiest beginner-friendly option.
  </p>

  <p
    style={{
      color: "#666",
      textAlign: "center",
      maxWidth: "760px",
      margin: "0 auto 30px",
      lineHeight: "1.6",
      fontSize: "14px",
    }}
  >
    Some links on this page may be affiliate links, which means we may earn a
    commission if you sign up through them, at no extra cost to you.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
    }}
  >
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: "13px",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Best Free Option
      </div>

      <h3 style={{ color: "white", marginBottom: "10px" }}>Oracle Cloud</h3>

      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        Great for users who want the lowest possible cost and do not mind a bit
        more setup. A strong option for DIY users chasing value.
      </p>

      <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "18px" }}>
        Best for: free tier, cost savings, hands-on setup
      </p>

      <a
        href="https://www.oracle.com/cloud/free/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#fff",
          color: "#000",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        View Oracle Cloud
      </a>
    </div>

    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: "13px",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Best Simple Paid Option
      </div>

      <h3 style={{ color: "white", marginBottom: "10px" }}>DigitalOcean</h3>

      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        Clean, fast, and straightforward. A strong choice for people who want a
        paid server without a messy setup process.
      </p>

      <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "18px" }}>
        Best for: simplicity, speed, first paid VPN server
      </p>

      <a
        href="#"
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#fff",
          color: "#000",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        View DigitalOcean
      </a>
    </div>

    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: "13px",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Best Beginner Option
      </div>

      <h3 style={{ color: "white", marginBottom: "10px" }}>Hostinger VPS</h3>

      <p style={{ color: "#bbb", lineHeight: "1.6", marginBottom: "12px" }}>
        Easier to understand than a full cloud dashboard. A good option for
        beginners who want a more guided hosting path.
      </p>

      <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "18px" }}>
        Best for: beginners, guided setup, simpler hosting
      </p>

      <a
        href="#"
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#fff",
          color: "#000",
          padding: "10px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        View Hostinger VPS
      </a>
    </div>
  </div>
</section>

  
      

    

<p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
  Takes ~5 minutes. No advanced knowledge needed.
</p>
  <button
    onClick={() => {
      const fullScript = selected.commands.join("\n")
      navigator.clipboard.writeText(fullScript)
    }}
    style={{
      background: "#111",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      marginRight: "10px"
    }}
    >
  🚀 Launch Server
</button>
    <div style={{ marginTop: "20px" }}>
  <button
    
    onClick={async () => {
      try {
        const fullScript = selected.commands.join("\n")
        await navigator.clipboard.writeText(fullScript)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        alert("Copy failed on this device. Please use Download Setup Script instead.")
      }
    }}
    style={{
      background: "#000",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      width: "100%",
      marginBottom: "10px",
    }}
  >
    📋 Copy Setup Script
  </button>
</div>

  
  
</div>
    <div style={{ marginTop: "12px" }}>
  <button
    onClick={async () => {
      const fullScript = selected.commands.join("\n")
      const blob = new Blob([fullScript], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${protocol.toLowerCase()}-${provider.toLowerCase().replace(/\s+/g, "-")}-setup.sh`
      a.click()
      URL.revokeObjectURL(url)
    }}
    style={{
      background: "#0f172a",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}
  >
    ⬇️ Download Setup Script
  </button>
</div>
  <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
  Step 5: Connect Your Device
</h2>

<div style={{
  background: "#f8fafc",
  border: "1px solid #ddd",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "50px",
}}>
  <ol style={{ paddingLeft: "20px", marginBottom: "10px" }}>
    <li>Install the WireGuard app on your phone or computer</li>
    <li>Import your configuration file</li>
    <li>Tap “Activate”</li>
  </ol>

  <p style={{ fontWeight: "bold" }}>
    Your VPN is now live 🎉
  </p>
</div>

    <div
  style={{
    background: "#f8fafc",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
  }}
>
  <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>
    Region Tip
  </h3>
  <p>{selectedProvider.regionTip}</p>
</div>

<div
  style={{
    background: "#f8fafc",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "20px",
  }}
>
  <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>
    Quick Notes
  </h3>
  <ul style={{ paddingLeft: "20px", margin: 0 }}>
    {selectedProvider.notes.map((note) => (
      <li key={note} style={{ marginBottom: "8px" }}>
        {note}
      </li>
    ))}
  </ul>
</div>

</div>
</div>
  <h2 style={{ textAlign: "center", marginTop: "40px" }}>
  You now have your own private VPN
</h2>

<p style={{ color: "#555", fontSize: "14px", marginBottom: "12px" }}>
  No subscriptions. No tracking. Full control.
</p>
<div
  style={{
    marginTop: "60px",
    paddingTop: "24px",
    borderTop: "1px solid #222",
    textAlign: "center",
  }}
>
  <p style={{ color: "#555", fontSize: "14px", marginBottom: "12px" }}>
    For lawful use only. Users are responsible for complying with local laws
    and service terms in their own jurisdiction.
  </p>

  <div
    style={{
      display: "flex",
      gap: "16px",
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    <a href="/disclaimer" style={{ color: "#555", textDecoration: "none" }}>
      Disclaimer
    </a>
    <a href="/terms" style={{ color: "#555", textDecoration: "none" }}>
      Terms
    </a>
  </div>
</div>

</main>


)
} 
