"use client"

import { useState } from "react"
import { Shield, Lock, Zap, Globe, Server } from "lucide-react"

export default function VPNBuilder() {
  const [protocol, setProtocol] = useState("WireGuard")

  return (
    <main style={{fontFamily:"system-ui, Arial", padding:"40px", maxWidth:"900px", margin:"auto"}}>

      <h1 style={{fontSize:"48px", marginBottom:"10px"}}>
        Build Your Own VPN
      </h1>

      <p style={{fontSize:"18px", marginBottom:"40px", color:"#555"}}>
        Learn how to build your own VPN with WireGuard, OpenVPN, or IKEv2 using Oracle Cloud or other providers.
      </p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"40px"}}>

        <div style={{border:"1px solid #ddd", padding:"20px", borderRadius:"10px"}}>
          <Shield size={24}/>
          <h3>More Privacy</h3>
          <p>Your server, your traffic</p>
        </div>

        <div style={{border:"1px solid #ddd", padding:"20px", borderRadius:"10px"}}>
          <Zap size={24}/>
          <h3>Fast Speed</h3>
          <p>No shared VPN pool</p>
        </div>

        <div style={{border:"1px solid #ddd", padding:"20px", borderRadius:"10px"}}>
          <Globe size={24}/>
          <h3>Any Region</h3>
          <p>Choose your server location</p>
        </div>

        <div style={{border:"1px solid #ddd", padding:"20px", borderRadius:"10px"}}>
          <Server size={24}/>
          <h3>Full Control</h3>
          <p>You control the setup</p>
        </div>

      </div>

      <h2 style={{fontSize:"32px", marginBottom:"10px"}}>
        Step 1: Choose Your VPN Protocol
      </h2>

      <p style={{marginBottom:"20px"}}>
        Pick the protocol that fits your needs.
      </p>

      <div style={{display:"flex", gap:"20px"}}>

        <button
          onClick={()=>setProtocol("WireGuard")}
          style={{
            padding:"20px",
            border:"1px solid #ddd",
            borderRadius:"10px",
            background: protocol==="WireGuard" ? "#f0f0f0" : "white",
            cursor:"pointer"
          }}
        >
          <strong>WireGuard</strong>
          <p>Fastest modern VPN</p>
        </button>

        <button
          onClick={()=>setProtocol("OpenVPN")}
          style={{
            padding:"20px",
            border:"1px solid #ddd",
            borderRadius:"10px",
            background: protocol==="OpenVPN" ? "#f0f0f0" : "white",
            cursor:"pointer"
          }}
        >
          <strong>OpenVPN</strong>
          <p>Most compatible</p>
        </button>

        <button
          onClick={()=>setProtocol("IKEv2")}
          style={{
            padding:"20px",
            border:"1px solid #ddd",
            borderRadius:"10px",
            background: protocol==="IKEv2" ? "#f0f0f0" : "white",
            cursor:"pointer"
          }}
        >
          <strong>IKEv2</strong>
          <p>Great for mobile</p>
        </button>

      </div>

      <div style={{marginTop:"40px", padding:"20px", background:"#f7f7f7", borderRadius:"10px"}}>
        <h3>Selected Protocol</h3>
        <p style={{fontSize:"20px"}}>{protocol}</p>
      </div>

    </main>
  )
}
