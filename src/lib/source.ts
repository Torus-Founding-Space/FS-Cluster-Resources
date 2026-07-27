import type * as PageTree from 'fumadocs-core/page-tree';

export const pageTree: PageTree.Root = {
  name: 'Docs',
  children: [
    // ── UI / Design ─────────────────────────────────────────────
    {
      type: 'folder',
      name: 'UI & Design',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/ui-design',
      },
      children: [
        {
          type: 'page',
          name: 'Math Loaders',
          url: '/docs/math-loaders',
        },
      ],
    },

    // ── Dev Tools ────────────────────────────────────────────────
    {
      type: 'folder',
      name: 'Dev Tools',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/dev-tools',
      },
      children: [],
    },

    // ── APIs ─────────────────────────────────────────────────────
    {
      type: 'folder',
      name: 'APIs',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/apis',
      },
      children: [],
    },

    // ── Infrastructure ───────────────────────────────────────────
    {
      type: 'folder',
      name: 'Infrastructure',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/infrastructure',
      },
      children: [],
    },

    // ── AI Tools ─────────────────────────────────────────────────
    {
      type: 'folder',
      name: 'AI Tools',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/ai-tools',
      },
      children: [],
    },

    // ── Boilerplates ─────────────────────────────────────────────
    {
      type: 'folder',
      name: 'Boilerplates',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/boilerplates',
      },
      children: [],
    },

    // ── Startup Stack ────────────────────────────────────────────
    {
      type: 'folder',
      name: 'Startup Stack',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/startup-stack',
      },
      children: [],
    },

    // ── Learning ─────────────────────────────────────────────────
    {
      type: 'folder',
      name: 'Learning',
      root: true,
      defaultOpen: true,
      index: {
        type: 'page',
        name: 'Overview',
        url: '/docs/learning',
      },
      children: [],
    },
  ],
};
