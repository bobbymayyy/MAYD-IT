export interface Project {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  tags: string[];
  status: 'active' | 'stable' | 'prototype';
  repo?: string;
}

export const projects: Project[] = [
  {
    slug: 'applier',
    name: 'APPLIER',
    kicker: 'Appliance compiler',
    description:
      'A stateful configuration compiler that turns minimal UBI-family bases into purpose-built appliances with security, efficiency, and modularity as first-order constraints.',
    tags: ['containers', 'automation', 'systems', 'security'],
    status: 'active',
  },
  {
    slug: 'cerberus',
    name: 'CERBERUS',
    kicker: 'Minimal Kubernetes architecture',
    description:
      'A Debian-oriented Kubernetes design focused on standing up small, scaling quickly, and promoting workers into control-plane roles only when topology requires it.',
    tags: ['kubernetes', 'debian', 'distributed-systems'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/cerberus',
  },
  {
    slug: 'al3x',
    name: 'AL3X',
    kicker: 'Linux-native DAW framework',
    description:
      'A Rust-first digital audio workstation framework built around Linux-native audio, modern graphics, headless operation, and explicit real-time diagnostics.',
    tags: ['rust', 'linux', 'audio', 'vulkan'],
    status: 'active',
  },
  {
    slug: 'plexxx',
    name: 'PLEXXX',
    kicker: 'Minimal media acquisition stack',
    description:
      'A deliberately small container stack that prioritizes VPN isolation, operational visibility, and manual control instead of accumulating an entire automation ecosystem.',
    tags: ['containers', 'networking', 'automation'],
    status: 'stable',
  },
  {
    slug: 'igg',
    name: 'IGg',
    kicker: 'Local social-data analysis',
    description:
      'A privacy-conscious local analyzer for exported social data, built to derive useful relationship state without handing the dataset to another service.',
    tags: ['data', 'privacy', 'cli'],
    status: 'prototype',
  },
];
