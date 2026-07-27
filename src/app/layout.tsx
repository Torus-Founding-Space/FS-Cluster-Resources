import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import { RootProvider } from "fumadocs-ui/provider/next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import "fumadocs-ui/style.css";
import "./globals.css";

const helvetica = localFont({
  src: [
    {
      path: "../fonts/HelveticaNowDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNowDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNowDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/HelveticaNowDisplay-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fs-Cluster Founder Resources",
  description: "A premium collection of developer and founder resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark selection:bg-white/20" suppressHydrationWarning>
      <body className={`${helvetica.variable} antialiased min-h-screen bg-[#050505] text-white selection:text-white font-sans overflow-x-hidden relative flex flex-col`}>
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent -z-10" />
        <RootProvider theme={{ defaultTheme: 'dark', forcedTheme: 'dark' }}>
          <HomeLayout
            nav={{
              title: (
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/donut.png"
                    alt="Torus FS Donut Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg object-contain"
                  />
                  <span className="font-bold text-sm tracking-tight text-white">FS Cluster</span>
                </div>
              ),
              transparentMode: "top",
            }}
            links={[
              { text: "UI & Design", url: "/docs/ui-design", active: "nested-url" },
              { text: "Dev Tools", url: "/docs/dev-tools", active: "nested-url" },
              { text: "APIs", url: "/docs/apis", active: "nested-url" },
              { text: "Infrastructure", url: "/docs/infrastructure", active: "nested-url" },
              { text: "AI Tools", url: "/docs/ai-tools", active: "nested-url" },
              { text: "Boilerplates", url: "/docs/boilerplates", active: "nested-url" },
              { text: "Startup Stack", url: "/docs/startup-stack", active: "nested-url" },
              { text: "Learning", url: "/docs/learning", active: "nested-url" },
              {
                type: 'icon',
                url: 'https://twitter.com',
                text: 'Twitter',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                  </svg>
                ),
              },
              {
                type: 'icon',
                url: 'https://discord.gg',
                text: 'Discord',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                  </svg>
                ),
              },
            ]}
            githubUrl="https://github.com/Torus-Founding-Space/FS-Cluster-Resources"
          >
            {children}
          </HomeLayout>
        </RootProvider>
      </body>
    </html>
  );
}
