"use client"

import { useEffect, useState } from "react"
import {
  Server,
  Shield,
  Globe,
  Zap, 
  Lock,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type VPNProtocol = "wireguard" | "openvpn" | "ikev2"
type CloudProvider = "digitalocean" | "aws" | "vultr" | "linode" | "gcp" | "oracle"

interface Step {
  id: number
  title: string
  description: string
  commands?: string[]
  notes?: string[]
}

export default function VPNBuilder() {
  const [selectedProtocol, setSelectedProtocol] = useState<VPNProtocol>("wireguard")
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>("oracle")
  const [currentStep, setCurrentStep] = useState(0)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  useEffect(() => {
    setCurrentStep(0)
  }, [selectedProtocol, selectedProvider])

  const protocols = [
    {
      id: "wireguard" as VPNProtocol,
      name: "WireGuard",
      description: "Modern, fast, and secure",
      pros: ["Fastest performance", "Easy to configure", "Modern cryptography"],
      recommended: true,
    },
    {
      id: "openvpn" as VPNProtocol,
      name: "OpenVPN",
      description: "Battle-tested and widely supported",
      pros: ["Most compatible", "Highly configurable", "Proven security"],
      recommended: false,
    },
    {
      id: "ikev2" as VPNProtocol,
      name: "IKEv2/IPSec",
      description: "Great for mobile devices",
      pros: ["Excellent for mobile", "Auto-reconnect", "Native iOS support"],
      recommended: false,
    },
  ]

  const providers = [
    { id: "oracle" as CloudProvider, name: "Oracle Cloud", price: "FREE", setup: "Medium", recommended: true, isFree: true },
    { id: "digitalocean" as CloudProvider, name: "DigitalOcean", price: "$4–6/mo", setup: "Easy", recommended: true, isFree: false },
    { id: "aws" as CloudProvider, name: "AWS Lightsail", price: "$3.50–5/mo", setup: "Medium", recommended: false, isFree: false },
    { id: "vultr" as CloudProvider, name: "Vultr", price: "$2.50–6/mo", setup: "Easy", recommended: false, isFree: false },
    { id: "linode" as CloudProvider, name: "Linode / Akamai", price: "$5/mo", setup: "Easy", recommended: false, isFree: false },
    { id: "gcp" as CloudProvider, name: "Google Cloud", price: "$4–10/mo", setup: "Medium", recommended: false, isFree: false },
  ]

  const selectedProtocolDetails = protocols.find((p) => p.id === selectedProtocol)
  const selectedProviderDetails = providers.find((p) => p.id === selectedProvider)

  const isOracle = selectedProvider === "oracle"
  const isGcp = selectedProvider === "gcp"
  const isNonRoot = isOracle || isGcp

  const steps: Step[] =
    selectedProtocol === "wireguard"
      ? [
          {
            id: 1,
            title: "Create a Server",
            description: `Create a VPS on ${selectedProviderDetails?.name}`,
            notes: isOracle
              ? [
                  "Sign up for Oracle Cloud.",
                  "Create an Always Free eligible Ubuntu VM if available.",
                  "Save your SSH private key and public IP.",
                ]
              : isGcp
              ? [
                  "Create a Google Cloud VM with Ubuntu 22.04.",
                  "Choose a region close to your audience.",
                  "Browser SSH is available from the console.",
                ]
              : [
                  "Choose Ubuntu 22.04.",
                  "1 GB RAM and 1 vCPU is enough to start.",
                  "Pick a nearby region.",
                ],
          },
          {
            id: 2,
            title: "Connect to Your Server",
            description: "SSH into your server",
            commands: isOracle
              ? [
                  "chmod 400 ~/Downloads/ssh-key-*.key",
                  "ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_INSTANCE_IP",
                ]
              : isGcp
              ? ["gcloud compute ssh YOUR_INSTANCE_NAME --zone=YOUR_ZONE"]
              : ["ssh root@YOUR_SERVER_IP"],
            notes: isOracle
              ? ["Use opc instead of ubuntu on Oracle Linux.", "Use sudo for admin commands."]
              : isGcp
              ? ["You can also use the SSH button in the Google Cloud console.", "Use sudo for admin commands."]
              : ["Use the IP from your VPS dashboard."],
          },
          {
            id: 3,
            title: "Update System",
            description: "Update and prepare the server",
            commands: isNonRoot
              ? ["sudo apt update && sudo apt upgrade -y", "sudo apt install -y ufw curl wget qrencode"]
              : ["apt update && apt upgrade -y", "apt install -y ufw curl wget qrencode"],
          },
          {
            id: 4,
            title: "Install WireGuard",
            description: "Run the automated WireGuard installer",
            commands: isNonRoot
              ? [
                  "wget https://git.io/wireguard -O wireguard-install.sh",
                  "chmod +x wireguard-install.sh",
                  "sudo ./wireguard-install.sh",
                ]
              : [
                  "wget https://git.io/wireguard -O wireguard-install.sh",
                  "chmod +x wireguard-install.sh",
                  "./wireguard-install.sh",
                ],
            notes: [
              "Default UDP port 51820 is usually fine.",
              "The installer usually creates your first client config.",
            ],
          },
          {
            id: 5,
            title: "Configure Firewall",
            description: "Open required ports",
            commands: isNonRoot
              ? ["sudo ufw allow 51820/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
              : ["ufw allow 51820/udp", "ufw allow 22/tcp", "ufw enable"],
            notes: isOracle
              ? ["Oracle Cloud also needs an ingress/security rule for UDP 51820."]
              : isGcp
              ? ["Google Cloud also needs a firewall rule for UDP 51820."]
              : undefined,
          },
          {
            id: 6,
            title: "Get Client Config",
            description: "Download or scan your WireGuard profile",
            commands: isNonRoot
              ? ["sudo ls -la ~/*.conf", "sudo cat ~/wg0-client-*.conf", "sudo cat ~/wg0-client-*.conf | qrencode -t ansiutf8"]
              : undefined,
            notes: [
              "Import the config into the WireGuard app.",
              "Keep the config private.",
            ],
          },
          {
            id: 7,
            title: "Install Client App",
            description: "Install WireGuard on your devices",
            notes: [
              "iPhone and Android: WireGuard app.",
              "Windows and macOS: official WireGuard client.",
            ],
          },
          {
            id: 8,
            title: "Test Connection",
            description: "Verify the VPN works",
            notes: [
              "Connect and check that your public IP changes.",
              "Run a DNS leak test.",
            ],
          },
        ]
      : selectedProtocol === "openvpn"
      ? [
          {
            id: 1,
            title: "Create a Server",
            description: `Create a VPS on ${selectedProviderDetails?.name}`,
            notes: ["Use Ubuntu 22.04 and note your public IP."],
          },
          {
            id: 2,
            title: "Connect to Your Server",
            description: "SSH into your server",
            commands: isOracle
              ? [
                  "chmod 400 ~/Downloads/ssh-key-*.key",
                  "ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_INSTANCE_IP",
                ]
              : isGcp
              ? ["gcloud compute ssh YOUR_INSTANCE_NAME --zone=YOUR_ZONE"]
              : ["ssh root@YOUR_SERVER_IP"],
          },
          {
            id: 3,
            title: "Update System",
            description: "Update the server",
            commands: isNonRoot ? ["sudo apt update && sudo apt upgrade -y"] : ["apt update && apt upgrade -y"],
          },
          {
            id: 4,
            title: "Install OpenVPN",
            description: "Run the installer",
            commands: isNonRoot
              ? [
                  "wget https://git.io/vpn -O openvpn-install.sh",
                  "chmod +x openvpn-install.sh",
                  "sudo ./openvpn-install.sh",
                ]
              : [
                  "wget https://git.io/vpn -O openvpn-install.sh",
                  "chmod +x openvpn-install.sh",
                  "./openvpn-install.sh",
                ],
          },
          {
            id: 5,
            title: "Configure Firewall",
            description: "Open required ports",
            commands: isNonRoot
              ? ["sudo ufw allow 1194/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
              : ["ufw allow 1194/udp", "ufw allow 22/tcp", "ufw enable"],
          },
          {
            id: 6,
            title: "Download Client Config",
            description: "Get your .ovpn file",
            notes: ["Keep it secure and import it into your OpenVPN client."],
          },
          {
            id: 7,
            title: "Install OpenVPN Client",
            description: "Install client software",
            notes: ["Use OpenVPN Connect or a compatible client."],
          },
          {
            id: 8,
            title: "Test Connection",
            description: "Verify everything works",
            notes: ["Check your IP and run a DNS leak test."],
          },
        ]
      : [
          {
            id: 1,
            title: "Create a Server",
            description: `Create a VPS on ${selectedProviderDetails?.name}`,
            notes: ["Use Ubuntu 22.04 and note your public IP."],
          },
          {
            id: 2,
            title: "Connect to Your Server",
            description: "SSH into your server",
            commands: isOracle
              ? [
                  "chmod 400 ~/Downloads/ssh-key-*.key",
                  "ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_INSTANCE_IP",
                ]
              : isGcp
              ? ["gcloud compute ssh YOUR_INSTANCE_NAME --zone=YOUR_ZONE"]
              : ["ssh root@YOUR_SERVER_IP"],
          },
          {
            id: 3,
            title: "Update System",
            description: "Update the server",
            commands: isNonRoot ? ["sudo apt update && sudo apt upgrade -y"] : ["apt update && apt upgrade -y"],
          },
          {
            id: 4,
            title: "Install StrongSwan",
            description: "Run the installer",
            commands: isNonRoot
              ? [
                  "wget https://git.io/strongswan -O strongswan-install.sh",
                  "chmod +x strongswan-install.sh",
                  "sudo ./strongswan-install.sh",
                ]
              : [
                  "wget https://git.io/strongswan -O strongswan-install.sh",
                  "chmod +x strongswan-install.sh",
                  "./strongswan-install.sh",
                ],
          },
          {
            id: 5,
            title: "Configure Firewall",
            description: "Open required ports",
            commands: isNonRoot
              ? ["sudo ufw allow 500/udp", "sudo ufw allow 4500/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
              : ["ufw allow 500/udp", "ufw allow 4500/udp", "ufw allow 22/tcp", "ufw enable"],
          },
          {
            id: 6,
            title: "Create VPN User",
            description: "Generate user and profile",
            notes: ["Follow the prompts and save the client profile."],
          },
          {
            id: 7,
            title: "Configure Clients",
            description: "Set up your devices",
            notes: ["iPhone and macOS can use native IKEv2 support."],
          },
          {
            id: 8,
            title: "Test Connection",
            description: "Verify everything works",
            notes: ["Check your IP and connection status."],
          },
        ]

  const copyCommand = async (command: string) => {
    if (!command.trim()) return
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 1500)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Build Your Own VPN
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Learn how to build your own VPN with WireGuard, OpenVPN, or IKEv2 using Oracle Cloud or other providers.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Lock, label: "More Privacy", desc: "Your server, your traffic" },
            { icon: Zap, label: "Fast Speed", desc: "No shared VPN pool" },
            { icon: Globe, label: "Any Region", desc: "Choose your server location" },
            { icon: Server, label: "Full Control", desc: "You control the setup" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="rounded-2xl border bg-white p-5 text-center shadow-sm">
                <item.icon className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Step 1: Choose Your VPN Protocol</h2>
          <p className="mt-1 text-gray-600">Pick the protocol that fits your needs.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {protocols.map((protocol) => (
              <button
                key={protocol.id}
                onClick={() => setSelectedProtocol(protocol.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedProtocol === protocol.id ? "border-blue-500 ring-2 ring-blue-500" : "hover:shadow-md"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold">{protocol.name}</h3>
                  {protocol.recommended && (
                    <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">Recommended</span>
                  )}
                </div>
                <p className="mb-4 text-sm text-gray-600">{protocol.description}</p>
                <ul className="space-y-2">
                  {protocol.pros.map((pro) => (
                    <li key={pro} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Step 2: Choose Your Cloud Provider</h2>
          <p className="mt-1 text-gray-600">Choose where to host your VPN server.</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={`rounded-2xl border p-4 text-center transition ${
                  selectedProvider === provider.id ? "border-blue-500 ring-2 ring-blue-500" : "hover:shadow-md"
                }`}
              >
                <h3 className="mb-2 font-bold">{provider.name}</h3>
                {provider.recommended && (
                  <span className="mb-2 inline-block rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                    Recommended
                  </span>
                )}
                <div className={`text-2xl font-bold ${provider.isFree ? "text-green-600" : "text-blue-600"}`}>{provider.price}</div>
                <div className="text-sm text-gray-600">Setup: {provider.setup}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Step 3: Installation Guide</h2>
          <p className="mt-1 text-gray-600">
            Follow these steps to set up your {selectedProtocolDetails?.name} VPN on {selectedProviderDetails?.name}.
          </p>

          <div className="mt-6 space-y-6">
            {steps.map((step, index) => (
              <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        currentStep > index
                          ? "bg-green-500 text-white"
                          : currentStep === index
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > index ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold">{step.id}</span>}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      {currentStep === index && (
                        <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">Current</span>
                      )}
                    </div>

                    <AnimatePresence initial={false}>
                      {currentStep >= index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-3"
                        >
                          {step.commands && (
                            <div className="space-y-2">
                              {step.commands.map((command, i) => (
                                <div
                                  key={`${step.id}-${i}`}
                                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-900 p-3 font-mono text-sm text-gray-100"
                                >
                                  <code className="flex-1 break-all whitespace-pre-wrap">{command}</code>
                                  <button
                                    onClick={() => copyCommand(command)}
                                    className="rounded p-2 text-gray-400 hover:text-white"
                                  >
                                    {copiedCommand === command ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {step.notes && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                              <ul className="space-y-2">
                                {step.notes.map((note, i) => (
                                  <li key={`${step.id}-note-${i}`} className="flex items-start gap-2 text-sm">
                                    <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {currentStep === index && (
                              <button
                                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                              >
                                {currentStep === steps.length - 1 ? "Complete Setup" : "Next Step"}
                              </button>
                            )}

                            {currentStep > index && (
                              <button
                                onClick={() => setCurrentStep(index)}
                                className="rounded-lg border px-4 py-2 font-semibold"
                              >
                                Review This Step
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {index < steps.length - 1 && <div className="ml-5 h-8 w-0.5 bg-gray-200" />}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Useful Resources</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["WireGuard Official Site", "Documentation and downloads", "https://www.wireguard.com/"],
              ["DigitalOcean Tutorials", "Detailed VPN setup guides", "https://www.digitalocean.com/community/tutorials"],
              ["WireGuard Install Script", "Automated installation script", "https://github.com/angristan/wireguard-install"],
              ["DNS Leak Test", "Test your VPN connection", "https://dnsleaktest.com/"],
            ].map(([title, desc, href]) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">How much does it cost?</h3>
              <p className="text-sm text-gray-600">
                Oracle Cloud can be free within its Always Free limits. Other providers usually cost a few dollars per month.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Is it legal?</h3>
              <p className="text-sm text-gray-600">
                Running your own VPN is legal in many places, but you must still follow local laws and platform rules.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How many devices can connect?</h3>
              <p className="text-sm text-gray-600">
                Multiple devices can connect. Capacity depends on your server size and setup.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can I use it for streaming?</h3>
              <p className="text-sm text-gray-600">
                Sometimes yes, but streaming platforms may block some server IPs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
