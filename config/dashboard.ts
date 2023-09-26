import { DashboardConfig } from '@/components/nav/types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { name: 'Contacts', href: '/contacts' },
    { name: 'Email', href: '/email' },
    { name: 'SEO', href: '/seo' },
    { name: 'Settings', href: '/dashboard/settings' },
  ],
  settingsNav: [
    { name: 'General', href: '/dashboard/settings', icon: 'home' },
    { name: 'Members', href: '/dashboard/settings/members', icon: 'user' },
  ],
};
