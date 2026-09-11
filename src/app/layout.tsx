import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/site";
import "fumadocs-ui/style.css";
import "./globals.css";

/**
 * Inter for UI text, Geist Mono for code.
 *
 * Both are SIL Open Font License, so they can be redistributed with this
 * repository. next/font/google self-hosts them at build time, which means no
 * font files live in the repo and no request leaves the user's browser for a
 * third-party font CDN.
 *
 * Each exposes its own CSS variable; `globals.css` maps them onto Tailwind's
 * --font-sans / --font-mono theme keys.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// The share image is the logo at its real dimensions. Declaring 1200x630 for a
// portrait logo makes social cards crop badly, so the card type matches the art.
const SHARE_IMAGE = {
  url: "/logos/logo.png",
  width: 1292,
  height: 1461,
  alt: siteConfig.name,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: [
    "founder resources",
    "developer tools",
    "startup stack",
    "open source",
    "react loaders",
    "cluster-loaders",
    "fs cluster",
    "torus founding space",
  ],
  authors: [{ name: "FS Cluster & Torus Founding Space", url: siteConfig.parentUrl }],
  creator: "FS Cluster & Torus Founding Space",
  icons: {
    icon: "/logos/logo.png",
    shortcut: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [SHARE_IMAGE],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [SHARE_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-white/20" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-[#050505] text-white selection:text-white font-sans overflow-x-hidden relative flex flex-col`}>
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent -z-10" />
        <RootProvider theme={{ defaultTheme: "dark", forcedTheme: "dark" }}>
          {children}
          <Analytics />
        </RootProvider>
      </body>
    </html>
  );
}
