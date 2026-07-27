import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { pageTree } from '@/lib/source';
import Image from 'next/image';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      // "auto" puts the section tabs as a dropdown inside the sidebar —
      // this is the standard fumadocs pattern (how fumadocs.dev works).
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
        title: <span className="font-semibold text-sm">Founder Resources</span>,
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
