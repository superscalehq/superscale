export type PageConfig = {
  title: string;
  description: string;
  href: string;
  icon: string;
  disabled?: boolean;
  segment: string;
};

export const marketingPagesConfig: PageConfig[] = [
  {
    title: 'Blog',
    description: 'Read our latest articles',
    href: '/blog',
    icon: 'document-text',
    segment: 'blog',
  },
  {
    title: 'How it works',
    description: 'Learn how our product works',
    href: '#how-it-works',
    icon: 'cog',
    segment: 'how-it-works',
  },
  {
    title: 'Features',
    description: 'Learn more about our features',
    href: '#features',
    icon: 'lightning-bolt-circle',
    segment: 'features',
  },
  {
    title: 'Pricing',
    description: 'See our pricing',
    href: '/pricing',
    icon: 'cash',
    segment: 'pricing',
  },
];
