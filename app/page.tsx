"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  completed: boolean
  commands?: string[]
  notes?: string[]
}

interface Provider {
  id: CloudProvider
  name: string
  price: string
  setup: "Easy" | "Medium" | "Advanced"
  recommended: boolean
  isFree: boolean
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

  const providers: Provider[] = [
    {
      id: "oracle",
      name: "Oracle Cloud",
      price: "FREE",
      setup: "Medium",
      recommended: true,
      isFree: true,
    },
    {
      id: "digitalocean",
      name: "DigitalOcean",
      price: "$4–6/mo",
      setup: "Easy",
      recommended: true,
      isFree: false,
    },
    {
      id: "aws",
      name: "AWS Lightsail",
      price: "$3.50–5/mo",
      setup: "Medium",
      recommended: false,
      isFree: false,
    },
    {
      id: "vultr",
      name: "Vultr",
      price: "$2.50–6/mo",
      setup: "Easy",
      recommended: false,
      isFree: false,
    },
    {
      id: "linode",
      name: "Linode / Akamai",
      price: "$5/mo",
      setup: "Easy",
      recommended: false,
      isFree: false,
    },
    {
      id: "gcp",
      name: "Google Cloud",
      price: "$4–10/mo",
      setup: "Medium",
      recommended: false,
      isFree: false,
    },
  ]

  const selectedProviderDetails = useMemo(
    () => providers.find((p) => p.id === selectedProvider),
    [providers, selectedProvider]
  )

  const selectedProtocolDetails = useMemo(
    () => protocols.find((p) => p.id === selectedProtocol),
    [protocols, selectedProtocol]
  )

  const isOracle = selectedProvider === "oracle"
  const isGcp = selectedProvider === "gcp"
  const isNonRoot = isOracle || isGcp

  const getSteps = (): Step[] => {
    const baseSteps: Step[] = [
      {
        id: 1,
        title: "Create a Server",
        description: `Sign up for ${selectedProviderDetails?.name} and create a VPS`,
        completed: false,
        notes: isOracle
          ? [
              "Go to Oracle Cloud and sign up.",
              "Complete verification. A card may be required for verification, but Always Free services remain available within Oracle’s limits.",
              "Open Compute > Instances and create a new instance.",
              "Choose an Always Free eligible shape if available.",
              "Ubuntu 22.04 LTS is the easiest path for these scripts.",
              "Download and keep your SSH private key safe.",
              "After launch, note your public IP address.",
            ]
          : isGcp
          ? [
              "Go to Google Cloud Console and create or choose a project.",
              "Open Compute Engine > VM instances.",
              "Create a VM with Ubuntu 22.04 LTS.",
              "Pick a region close to your users.",
              "Browser SSH is available directly from the console.",
            ]
          : [
              "Choose Ubuntu 22.04 LTS.",
              "Select a location close to you or your target audience.",
              "1 GB RAM and 1 vCPU is enough for a basic personal VPN.",
              "Enable IPv6 if your provider supports it.",
            ],
      },
      {
        id: 2,
        title: "Connect to Your Server",
        description: "SSH into your new server",
        completed: false,
        commands: isOracle
          ? [
              "chmod 400 ~/Downloads/ssh-key-*.key",
              "ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_INSTANCE_IP",
            ]
          : isGcp
          ? ["gcloud compute ssh YOUR_INSTANCE_NAME --zone=YOUR_ZONE"]
          : ["ssh root@YOUR_SERVER_IP"],
        notes: isOracle
          ? [
              "For Oracle Linux, the username is often opc instead of ubuntu.",
              "You are not root by default, so use sudo for admin commands.",
              "Your public IP is shown in the Oracle Cloud console.",
            ]
          : isGcp
          ? [
              "You can also use the SSH button in the Google Cloud console.",
              "SSH keys are often managed automatically by Google Cloud.",
              "You are not root by default, so use sudo for admin commands.",
            ]
          : [
              "Use the IP address from your provider dashboard.",
              "You will log in as root on most budget VPS providers.",
            ],
      },
      {
        id: 3,
        title: "Update System",
        description: "Update and secure your server",
        completed: false,
        commands: isNonRoot
          ? ["sudo apt update && sudo apt upgrade -y", "sudo apt install -y ufw curl wget qrencode"]
          : ["apt update && apt upgrade -y", "apt install -y ufw curl wget qrencode"],
        notes: isOracle
          ? [
              "If you chose Oracle Linux instead of Ubuntu, package commands differ.",
              "These instructions are written for Ubuntu because the VPN scripts are simpler there.",
            ]
          : isGcp
          ? ["Use sudo because your login user is not root."]
          : undefined,
      },
    ]

    if (selectedProtocol === "wireguard") {
      return [
        ...baseSteps,
        {
          id: 4,
          title: "Install WireGuard",
          description: "Install WireGuard using the automated script",
          completed: false,
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
            "WireGuard is the best default choice for most users.",
            "The script will ask for port, DNS, and client settings.",
            "Default port 51820/udp is fine for most setups.",
            "The first client profile is usually created during setup.",
          ],
        },
        {
          id: 5,
          title: "Configure Firewall",
          description: "Open the required VPN ports",
          completed: false,
          commands: isNonRoot
            ? ["sudo ufw allow 51820/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
            : ["ufw allow 51820/udp", "ufw allow 22/tcp", "ufw enable"],
          notes: isOracle
            ? [
                "Oracle Cloud also needs network rules in the cloud console, not just UFW.",
                "Add an ingress rule for UDP port 51820.",
                "Without the Oracle network rule, the VPN may not connect.",
              ]
            : isGcp
            ? [
                "Google Cloud also needs a firewall rule in the cloud console.",
                "Add a rule allowing UDP port 51820 to the instance.",
              ]
            : undefined,
        },
        {
          id: 6,
          title: "Download Client Config",
          description: "Get your WireGuard client configuration",
          completed: false,
          commands: isOracle
            ? [
                "sudo ls -la ~/*.conf",
                "sudo cat ~/wg0-client-*.conf",
                "sudo cat ~/wg0-client-*.conf | qrencode -t ansiutf8",
              ]
            : isGcp
            ? [
                "sudo ls -la ~/*.conf",
                "sudo cat ~/wg0-client-*.conf",
                "sudo cat ~/wg0-client-*.conf | qrencode -t ansiutf8",
              ]
            : undefined,
          notes: isOracle
            ? [
                "You can copy the config manually, scan the QR code, or use SCP with your SSH key.",
                "Keep the config private because it contains your VPN credentials.",
              ]
            : isGcp
            ? [
                "You can copy the config manually, scan the QR code, or use gcloud scp to download it.",
                "Keep the config private because it contains your VPN credentials.",
              ]
            : [
                "The script usually saves the .conf file in /root.",
                "You can also scan the QR code shown in the terminal.",
              ],
        },
        {
          id: 7,
          title: "Install WireGuard Client",
          description: "Install the app on your devices",
          completed: false,
          notes: [
            "iPhone and Android: use the WireGuard app.",
            "Windows and macOS: use the official WireGuard client.",
            "Import the .conf file or scan the QR code.",
          ],
        },
        {
          id: 8,
          title: "Test Connection",
          description: "Verify your VPN is working properly",
          completed: false,
          notes: [
            "Connect using the client app.",
            "Check that your public IP changes to your server location.",
            "Run a DNS leak test to confirm traffic is using the tunnel.",
          ],
        },
      ]
    }

    if (selectedProtocol === "openvpn") {
      return [
        ...baseSteps,
        {
          id: 4,
          title: "Install OpenVPN",
          description: "Install OpenVPN using the automated script",
          completed: false,
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
          notes: [
            "OpenVPN is useful when compatibility matters more than speed.",
            "UDP is usually faster. TCP can help on restrictive networks.",
          ],
        },
        {
          id: 5,
          title: "Configure Firewall",
          description: "Open the required VPN ports",
          completed: false,
          commands: isNonRoot
            ? ["sudo ufw allow 1194/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
            : ["ufw allow 1194/udp", "ufw allow 22/tcp", "ufw enable"],
          notes: isOracle
            ? ["Oracle Cloud also needs an ingress rule allowing UDP port 1194."]
            : isGcp
            ? ["Google Cloud also needs a firewall rule allowing UDP port 1194."]
            : undefined,
        },
        {
          id: 6,
          title: "Download Client Config",
          description: "Get your .ovpn file",
          completed: false,
          notes: isNonRoot
            ? [
                "The config file is commonly saved in the user home directory.",
                "Download it securely and keep it private.",
              ]
            : [
                "The config file is commonly saved in /root.",
                "Download it securely and keep it private.",
              ],
        },
        {
          id: 7,
          title: "Install OpenVPN Client",
          description: "Install the app on your devices",
          completed: false,
          notes: [
            "iPhone and Android: OpenVPN Connect.",
            "Windows: OpenVPN GUI or OpenVPN Connect.",
            "macOS: Tunnelblick or OpenVPN Connect.",
          ],
        },
        {
          id: 8,
          title: "Test Connection",
          description: "Verify your VPN is working properly",
          completed: false,
          notes: [
            "Connect using your imported .ovpn profile.",
            "Check that your IP address changes.",
            "Run a DNS leak test.",
          ],
        },
      ]
    }

    return [
      ...baseSteps,
      {
        id: 4,
        title: "Install StrongSwan",
        description: "Install IKEv2/IPSec VPN server",
        completed: false,
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
        notes: [
          "IKEv2 is especially nice for phones because reconnection is smooth.",
          "Follow the setup prompts carefully for certificates and user credentials.",
        ],
      },
      {
        id: 5,
        title: "Configure Firewall",
        description: "Open the required VPN ports",
        completed: false,
        commands: isNonRoot
          ? ["sudo ufw allow 500/udp", "sudo ufw allow 4500/udp", "sudo ufw allow 22/tcp", "sudo ufw enable"]
          : ["ufw allow 500/udp", "ufw allow 4500/udp", "ufw allow 22/tcp", "ufw enable"],
        notes: isOracle
          ? ["Oracle Cloud also needs ingress rules for UDP ports 500 and 4500."]
          : isGcp
          ? ["Google Cloud also needs firewall rules for UDP ports 500 and 4500."]
          : undefined,
      },
      {
        id: 6,
        title: "Create VPN User",
        description: "Generate a client certificate or profile",
        completed: false,
        notes: [
          "The script usually creates the needed certificate and config files.",
          "Download the iPhone or manual config files after setup.",
        ],
      },
      {
        id: 7,
        title: "Configure Clients",
        description: "Set up your devices",
        completed: false,
        notes: [
          "iPhone and macOS can use native IKEv2 support.",
          "Android commonly uses the strongSwan client app.",
          "Windows can use built-in VPN settings.",
        ],
      },
      {
        id: 8,
        title: "Test Connection",
        description: "Verify your VPN is working properly",
        completed: false,
        notes: [
          "Connect from a device and confirm traffic is working.",
          "Check that your IP address changes to the server location.",
        ],
      },
    ]
  }

  const steps = getSteps()

  const copyCommand = async (command: string) => {
    if (typeof window === "undefined") return
    if (!command.trim() || command.trim().startsWith("#")) return

    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (error) {
      console.error("Failed to copy command:", error)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Build Your Own VPN
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Learn how to set up your own private VPN server with WireGuard, OpenVPN, or IKEv2.
            Start with Oracle Cloud free hosting or choose another VPS provider.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Lock, label: "More Privacy", desc: "Your server, your traffic" },
            { icon: Zap, label: "Fast Speed", desc: "No crowded shared VPN pool" },
            { icon: Globe, label: "Any Region", desc: "Choose where your server lives" },
            { icon: Server, label: "Full Control", desc: "You own the setup" },
          ].map((benefit, i) => (
            <motion.div
              key={benefit.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="text-center transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <benefit.icon className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <h3 className="mb-1 font-semibold">{benefit.label}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Choose Your VPN Protocol</CardTitle>
            <CardDescription>Select the VPN technology that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {protocols.map((protocol) => (
                <motion.div key={protocol.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedProtocol === protocol.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedProtocol(protocol.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold">{protocol.name}</h3>
                        {protocol.recommended && <Badge className="bg-green-500">Recommended</Badge>}
                      </div>
                      <p className="mb-4 text-sm text-gray-600">{protocol.description}</p>
                      <ul className="space-y-2">
                        {protocol.pros.map((pro) => (
                          <li key={pro} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Choose Your Cloud Provider</CardTitle>
            <CardDescription>Select where to host your VPN server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {providers.map((provider) => (
                <motion.div key={provider.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedProvider === provider.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <CardContent className="pt-6 text-center">
                      <h3 className="mb-2 font-bold">{provider.name}</h3>
                      {provider.recommended && <Badge className="mb-2 bg-green-500">Recommended</Badge>}
                      <div className={`mb-1 text-2xl font-bold ${provider.isFree ? "text-green-600" : "text-blue-600"}`}>
                        {provider.price}
                      </div>
                      <div className="text-sm text-gray-600">Setup: {provider.setup}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Installation Guide</CardTitle>
            <CardDescription>
              Follow these steps to set up your {selectedProtocolDetails?.name} VPN on {selectedProviderDetails?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
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
                        {currentStep > index ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="font-bold">{step.id}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        {currentStep === index && <Badge className="bg-blue-500">Current</Badge>}
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
                                {step.commands.map((command, i) => {
                                  const disabled = !command.trim() || command.trim().startsWith("#")
                                  return (
                                    <div
                                      key={`${step.id}-${i}`}
                                      className="flex items-center justify-between gap-2 rounded-lg bg-gray-900 p-3 font-mono text-sm text-gray-100"
                                    >
                                      <code className="flex-1 break-all whitespace-pre-wrap">{command}</code>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="flex-shrink-0 text-gray-400 hover:text-white disabled:opacity-30"
                                        onClick={() => copyCommand(command)}
                                        disabled={disabled}
                                      >
                                        {copiedCommand === command ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                      </Button>
                                    </div>
                                  )
                                })}
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
                                <Button
                                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {currentStep === steps.length - 1 ? "Complete Setup" : "Next Step"}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              )}

                              {currentStep > index && (
                                <Button variant="outline" onClick={() => setCurrentStep(index)}>
                                  Review This Step
                                </Button>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Useful Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="https://www.wireguard.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">WireGuard Official Site</div>
                  <div className="text-sm text-gray-600">Documentation and downloads</div>
                </div>
              </a>

              <a
                href="https://github.com/angristan/wireguard-install"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">WireGuard Install Script</div>
                  <div className="text-sm text-gray-600">Automated install helper</div>
                </div>
              </a>

              <a
                href="https://dnsleaktest.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold">DNS Leak Test</div>
                  <div className="text-sm text-gray-600">Verify your VPN traffic</div>
                </div>
              </a>

              {isOracle ? (
                <a
                  href="https://www.oracle.com/cloud/free/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">Oracle Cloud Free Tier</div>
                    <div className="text-sm text-gray-600">Always Free overview and signup</div>
                  </div>
                </a>
              ) : (
                <a
                  href="https://www.digitalocean.com/community/tutorials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold">General VPS Tutorials</div>
                    <div className="text-sm text-gray-600">Helpful setup guides and references</div>
                  </div>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">How much does it cost?</h3>
              <p className="text-sm text-gray-600">
                Oracle Cloud can be free within Oracle’s Always Free limits. Other VPS providers usually cost a few dollars per month.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Is Oracle Cloud really free forever?</h3>
              <p className="text-sm text-gray-600">
                Oracle publishes an Always Free tier with ongoing free resources, but limits and eligibility rules still apply.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Is running your own VPN legal?</h3>
              <p className="text-sm text-gray-600">
                In many places it is legal to run a personal VPN, but users are still responsible for following local laws and the provider’s terms.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Can I use this on multiple devices?</h3>
              <p className="text-sm text-gray-600">
                Yes. You can create multiple client profiles for phones, laptops, and tablets.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">What is the best choice for most people?</h3>
              <p className="text-sm text-gray-600">
                WireGuard on Oracle Cloud is probably the strongest value option if you want speed and low cost.
              </p>
            </div>
          </CardContent>
        </Card>
      </div
