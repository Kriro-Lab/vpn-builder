export const metadata = {
  title: "VPN Builder",
  description: "Build your own VPN using Oracle Cloud or other providers"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
