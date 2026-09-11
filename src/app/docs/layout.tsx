import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { pageTree } from '@/lib/source';
import { siteConfig } from '@/lib/site';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      // "auto" puts the section tabs as a dropdown inside the sidebar.
      // This is the standard fumadocs pattern (how fumadocs.dev works).
      tabMode="auto"
      tabs={{
        transform(option, node) {
          return {
            ...option,
            title: node.name,
            url: node.index?.url ?? option.url,
          };
        },
      }}
      nav={{
        // Links back to the marketing site; keeps the docs navbar to a single
        // row on mobile.
        url: '/',
        title: (
          <span className="flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt={siteConfig.name}
              width={20}
              height={20}
              className="rounded-none"
            />
            <span className="font-semibold text-sm">Founder Resources</span>
          </span>
        ),
      }}
      sidebar={{
        defaultOpenLevel: 1,
      }}
      githubUrl="https://github.com/Torus-Founding-Space/FS-Cluster-Resources"
    >
      {children}
    </DocsLayout>
  );
}
