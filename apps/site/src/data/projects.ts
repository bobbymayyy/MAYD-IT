export interface Project {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  tags: string[];
  status: 'active' | 'stable' | 'prototype';
  repo?: string;
  problem: string;
  constraints: string[];
  architecture: string[];
  lessons: string[];
  highlights?: string[];
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
    problem:
      'Purpose-built appliances tend to accumulate hand-written installation steps, undocumented state, and base-image assumptions. APPLIER treats the desired appliance as a compilable specification instead of a pile of shell history.',
    constraints: [
      'Accept UBI Micro and larger UBI-family bases without assuming a full userland.',
      'Keep the generated appliance small, auditable, reproducible, and explicit about retained state.',
      'Separate appliance intent from implementation so an LLM or human can produce the same structured build input.',
      'Avoid hidden network access, mutable bootstrap behavior, and unnecessary runtime tooling.',
    ],
    architecture: [
      'Purpose specification describes services, packages, files, users, capabilities, ports, health checks, and retained state.',
      'A compiler resolves that specification into deterministic build stages and validates incompatible requirements before execution.',
      'Build adapters target the capabilities available in the selected UBI base instead of forcing every base into one installation path.',
      'The output includes a machine-readable manifest so the appliance can explain how it was assembled.',
    ],
    lessons: [
      'Minimal images are only useful when the build system understands what is absent; minimalism cannot be implemented as deletion after the fact.',
      'State needs to be declared as deliberately as packages. Undocumented state is configuration debt with better camouflage.',
      'LLM-assisted configuration is safer when the model produces a constrained intermediate representation rather than executable shell.',
    ],
    highlights: ['State-aware builds', 'UBI Micro → full UBI', 'LLM-friendly specification'],
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
    problem:
      'Conventional Kubernetes guidance often starts with a production-sized control plane even when the deployment starts as a single tiny node. CERBERUS explores a cluster that is useful at one node and grows control-plane complexity only when the topology earns it.',
    constraints: [
      'A single node must operate as both control plane and worker.',
      'Scale-out should remain fast while control-plane growth deliberately lags worker growth.',
      'Control-plane promotion follows topology tiers rather than every node addition.',
      'Scale-down must be a first-class operation instead of an emergency procedure.',
    ],
    architecture: [
      'Tier 1 begins with one control/worker node and can absorb additional workers without immediately multiplying control-plane services.',
      'At the next topology threshold, selected workers are promoted to create an odd-numbered resilient control plane.',
      'Profiles describe node capabilities and roles so promotion and demotion are explicit operations.',
      'Debian provides the boring substrate; Kubernetes components remain intentionally close to upstream behavior.',
    ],
    lessons: [
      'High availability has a cost curve. Paying that cost before the cluster needs it creates fragility disguised as resilience.',
      'Scaling policy should describe topology invariants rather than a deterministic one-node-in, one-role-change-out sequence.',
      'Scale-down deserves the same design attention as provisioning because role removal is where hidden coupling becomes visible.',
    ],
    highlights: ['1-node useful baseline', 'Tiered control plane', 'Fast scale-out / deliberate HA'],
  },
  {
    slug: 'al3x',
    name: 'AL3X',
    kicker: 'Linux-native DAW framework',
    description:
      'A Rust-first digital audio workstation framework built around Linux-native audio, modern graphics, headless operation, and explicit real-time diagnostics.',
    tags: ['rust', 'linux', 'audio', 'vulkan'],
    status: 'active',
    problem:
      'Linux audio software often inherits cross-platform abstractions that hide the capabilities of the platform it is running on. AL3X starts from Linux as the primary environment and treats real-time behavior, graphics, audio routing, and observability as architecture rather than compatibility chores.',
    constraints: [
      'PipeWire is the default integration while JACK and ALSA remain first-class paths.',
      'Wayland is primary, Vulkan-capable graphics are the baseline, and headless execution remains supported.',
      'CLAP and LV2 are the plugin targets; distro packaging stays outside the engine.',
      'The audio path must never depend on UI responsiveness or optional GPU/AI features.',
    ],
    architecture: [
      'Rust separates timeline state, audio transport, rendering, and platform integration into independently testable boundaries.',
      'The initial product surface is deliberately narrow: timeline, audio clips, playback, project timing, and interaction mechanics.',
      'GPU acceleration is reserved for work that benefits from it, including decode, encode, transcode, visualization, and optional ML workloads.',
      'Real-time diagnostics are surfaced as product behavior so deadline misses and routing failures are observable rather than mysterious.',
    ],
    lessons: [
      'A DAW framework benefits from proving transport and interaction semantics before accumulating mixer, mastering, and sequencing surfaces.',
      'Linux-native does not mean Linux-only abstractions everywhere; it means exposing platform strengths without forcing them through a lowest-common-denominator API.',
      'Diagnostics belong beside creative features because timing failures that cannot be explained cannot be engineered away.',
    ],
    highlights: ['Rust + Wayland + Vulkan', 'PipeWire-first audio', 'Real-time observability'],
  },
  {
    slug: 'plexxx',
    name: 'PLEXXX',
    kicker: 'Minimal media acquisition stack',
    description:
      'A deliberately small container stack that prioritizes VPN isolation, operational visibility, and manual control instead of accumulating an entire automation ecosystem.',
    tags: ['containers', 'networking', 'automation'],
    status: 'stable',
    problem:
      'Media automation stacks can turn a simple request-download-review workflow into a web of tightly coupled services. PLEXXX asks how little infrastructure is actually required when metadata management and automatic library organization are not goals.',
    constraints: [
      'All acquisition traffic must remain isolated behind the VPN boundary.',
      'The VPN provider’s forwarded port must be propagated to the download client rather than configured statically.',
      'Indexer use remains manual and understandable; optional Discord interaction cannot become a runtime dependency.',
      'Completed media stays under human control instead of being silently moved through the library.',
    ],
    architecture: [
      'Gluetun owns the network boundary and VPN lifecycle; qBittorrent shares that network context.',
      'Prowlarr provides a compact indexer/search surface without requiring the broader *arr ecosystem.',
      'A small coordination service synchronizes dynamic network state and exposes health without taking ownership of the media library.',
      'Shared storage provides a simple hand-off point from acquisition to the existing library workflow.',
    ],
    lessons: [
      'Container health and dependency graphs matter more than container count; a small stack can still fail opaquely without explicit checks.',
      'Dynamic port forwarding is state, not configuration. Treating it as static guarantees eventual drift.',
      'Optional integrations have to fail open. A missing chat token should disable chat, not restart the core service forever.',
    ],
    highlights: ['VPN-isolated acquisition', 'Dynamic port synchronization', 'Manual-control bias'],
  },
  {
    slug: 'igg',
    name: 'IGg',
    kicker: 'Local social-data analysis',
    description:
      'A privacy-conscious local analyzer for exported social data, built to derive useful relationship state without handing the dataset to another service.',
    tags: ['data', 'privacy', 'cli'],
    status: 'prototype',
    problem:
      'Platform exports contain useful relationship history, but the files are fragmented and their semantics are inconsistent. IGg turns those exports into local, inspectable state without uploading personal datasets to another analytics service.',
    constraints: [
      'Raw exports remain local by default.',
      'Parsers must tolerate missing files, partial export windows, and changing platform schemas.',
      'Derived metrics need provenance so ambiguous source semantics are not presented as certainty.',
    ],
    architecture: [
      'Format-specific parsers normalize export files into a small internal relationship model.',
      'Incremental state allows newer exports to extend prior observations without erasing historical context.',
      'A CLI/TUI keeps the analysis inspectable and portable while leaving room for optional encrypted backup workflows.',
    ],
    lessons: [
      'A filename is not a specification. Export fields need to be tested against observed behavior before assigning user-facing meaning.',
      'Absence from a limited export window is not evidence of absence from the underlying account history.',
      'Privacy tools should minimize collection even when the user already owns the source data.',
    ],
    highlights: ['Local-first', 'Incremental datasets', 'Provenance-aware metrics'],
  },
];
