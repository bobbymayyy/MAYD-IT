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
    slug: 'cerberus-2',
    name: 'CERBERUS 2.0',
    kicker: 'Elastic Kubernetes control plane',
    description:
      'Lean upstream Kubernetes on Debian that begins as one useful hybrid node, adds workers quickly, and expands the control plane only when the cluster crosses explicit topology tiers.',
    tags: ['kubernetes', 'debian', 'ansible', 'distributed-systems'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/CERBERUS-2.0',
    problem:
      'Small Kubernetes deployments are often forced to choose between an overbuilt high-availability control plane and a disposable single-node lab. CERBERUS 2.0 keeps the first node useful by itself while preserving a clean path into a resilient multi-control-plane cluster.',
    constraints: [
      'The bootstrap node must remain both control plane and schedulable worker.',
      'Worker capacity should arrive before control-plane expansion finishes.',
      'Stacked-etcd membership should remain odd and topology changes should happen only at profile thresholds.',
      'Scale-down, demotion, and failed retirement must remain observable and retryable.',
    ],
    architecture: [
      'kubeadm, containerd, Cilium, CoreDNS, and kube-vip provide a deliberately upstream-leaning Debian substrate.',
      'A stable API VIP exists from the first boot so later control-plane growth does not require rebuilding cluster identity.',
      'Data-driven profiles map enabled-node counts to desired hybrid control-plane counts, with sticky membership between tier transitions.',
      'Scale-out joins workers first, then serially promotes eligible nodes; scale-down drains and resets retiring nodes before recalculating the tier.',
    ],
    lessons: [
      'High availability is a topology decision, not a box to check before the workload exists.',
      'Odd etcd membership avoids paying replication cost for no additional failure tolerance.',
      'Scale-down deserves explicit state because demotion exposes coupling that scale-out can hide.',
    ],
    highlights: ['1 → 3 → 5 → 7 control planes', 'Stable API VIP from node one', 'Profile-driven scale-out / down'],
  },
  {
    slug: 'stoker',
    name: 'STOKER',
    kicker: 'Offline infrastructure appliance compiler',
    description:
      'A declarative Debian ISO builder that compiles unattended installation, offline packages, networking, Ansible projects, manifests, and recovery-friendly controller tooling into a portable infrastructure appliance.',
    tags: ['debian', 'iso', 'ansible', 'offline', 'networking'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/STOKER',
    problem:
      'Disconnected deployments need more than a bootable ISO. They need reproducible package resolution, predictable networking, controller tooling, project delivery, integrity metadata, and a way to rebuild the appliance without preserving an undocumented golden image.',
    constraints: [
      'Build from Debian 13 amd64 netinst while preserving recognized BIOS and UEFI boot behavior.',
      'Resolve packages online at build time but leave the installed appliance capable of operating from its embedded repository.',
      'Keep secrets and mutable controller state out of reusable project bundles wherever possible.',
      'Allow runtime networking and Ansible project changes without requiring a full ISO rebuild for every operational adjustment.',
    ],
    architecture: [
      'Declarative YAML drives installer policy, packages, modules, repositories, networking, and embedded Ansible projects.',
      'A staged build pipeline validates, renders, resolves dependencies, constructs the offline APT repository, injects content, regenerates checksums, and replays source ISO boot equipment.',
      'Installed controller projects use immutable version directories with atomic activation links, validation, sync, rollback, and verified USB import.',
      'A shared network-role renderer keeps ifupdown, Kea, BIND, and nftables from independently guessing interface and subnet state.',
    ],
    lessons: [
      'An offline appliance is a supply chain snapshot, so package trust, manifests, and reproducibility belong in the build design rather than in post-build documentation.',
      'Configuration ownership matters: one renderer should establish network truth before several services consume it.',
      'Portable automation becomes safer when project import is allowlisted, integrity-checked, and atomically activated.',
    ],
    highlights: ['Declarative hybrid ISO', 'Embedded signed package workflow', 'Versioned Ansible controller'],
  },
  {
    slug: 'sentinel',
    name: 'SENTINEL',
    kicker: 'Lightweight incident-response sensor',
    description:
      'A small C-based Linux telemetry daemon for rapid incident response and threat hunting, emitting portable JSON events without requiring a heavyweight endpoint platform.',
    tags: ['c', 'linux', 'incident-response', 'telemetry'],
    status: 'prototype',
    repo: 'https://github.com/bobbymayyy/SENTINEL',
    problem:
      'Response teams often need immediate host visibility before a full EDR or SIEM integration can be deployed. SENTINEL aims to provide useful process, file, network, and authentication context with minimal dependencies and very little operational ceremony.',
    constraints: [
      'Remain lightweight enough for rapid deployment on Linux hosts, containers, and lab systems.',
      'Emit structured events that can flow into existing logging stacks instead of inventing a proprietary backend.',
      'Collect useful host context while keeping the implementation understandable and auditable.',
      'Preserve a path toward richer detection and evidence collection without turning the sensor into a remote-control agent.',
    ],
    architecture: [
      'A /proc scanner discovers process activity while inotify watches sensitive files and network inspection tracks listener changes.',
      'Collectors normalize observations into line-oriented JSON events on standard output.',
      'Deployment can remain native or containerized, with downstream transport delegated to tools such as Fluent Bit, syslog, Loki, Splunk, or Wazuh.',
      'Future phases add event-driven kernel interfaces, filtering, rule evaluation, enrichment, and evidence-preservation actions.',
    ],
    lessons: [
      'Small sensors are easier to deploy during an incident when they do not demand a new management plane first.',
      'A neutral event stream lets collection stay decoupled from whatever SIEM happens to be available.',
      'Detection logic and collection mechanics should evolve independently so richer rules do not make the sensor harder to trust.',
    ],
    highlights: ['C + minimal dependencies', 'JSON-first telemetry', 'Detect → preserve roadmap'],
  },
  {
    slug: 'dip',
    name: 'DIP',
    kicker: 'Deployable infrastructure platform',
    description:
      'A rebuildable cyber-response infrastructure platform that uses Proxmox or VMware-oriented deployment tracks to stand up networking, collaboration, case management, storage, and security tooling under time pressure.',
    tags: ['proxmox', 'ansible', 'incident-response', 'infrastructure'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/DIP',
    problem:
      'Incident response infrastructure is frequently assembled service by service while the clock is already running. DIP treats the response enclave itself as deployable infrastructure so teams can recreate a known environment instead of improvising one during every event.',
    constraints: [
      'Support limited-connectivity and offline operation with local package and configuration assets where needed.',
      'Coordinate hypervisor, routing, switching, collaboration, storage, issue tracking, and monitoring as one operational workflow.',
      'Keep destructive teardown operations explicit and separate from deployment actions.',
      'Allow the platform concept to span both Proxmox VE and VMware ESXi deployment tracks.',
    ],
    architecture: [
      'An interactive shell controller discovers or prepares infrastructure, establishes access, produces inventory, and invokes Ansible workflows.',
      'The Proxmox track deploys infrastructure services such as OPNsense, Nextcloud, Mattermost, Redmine, and Security Onion through ordered playbooks.',
      'Supporting configuration covers PXE/iPXE, DNS/DHCP, nginx, package repositories, terminal tooling, and other enclave plumbing.',
      'Matching teardown playbooks make environment destruction a designed workflow rather than an undocumented cleanup exercise.',
    ],
    lessons: [
      'Response speed improves when infrastructure is rehearsed as code rather than remembered as a sequence of GUI operations.',
      'Teardown deserves first-class automation because temporary environments accumulate risk when nobody owns their end state.',
      'Offline capability changes architecture early: packages, inventories, credentials, and bootstrap assumptions must all be explicit.',
    ],
    highlights: ['Response enclave as code', 'Proxmox + DIPx tracks', 'Deploy and teardown workflows'],
  },
  {
    slug: 'gargoyle',
    name: 'GARGOYLE',
    kicker: 'Hardened cross-platform telemetry agent',
    description:
      'A Rust-based Linux and Windows security observer that correlates host activity into a normalized event contract while deliberately refusing to become a remote command framework.',
    tags: ['rust', 'linux', 'windows', 'security', 'telemetry'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/GARGOYLE',
    problem:
      'Useful host telemetry gets complicated quickly once process identity, network ownership, authentication, local accounts, executable fingerprints, and multiple operating systems enter the picture. GARGOYLE builds that context while keeping collection bounded, auditable, and read-only.',
    constraints: [
      'Support Linux and Windows without weakening the event contract or interpolating observed host text into command programs.',
      'Keep privileged collection bounded in memory, runtime, file reads, snapshots, and queue behavior.',
      'Disable sensitive command-line capture by default and avoid remote execution capability entirely.',
      'Make release artifacts reproducible and reviewable through pinned dependencies, CI, checksums, SBOMs, and attestations.',
    ],
    architecture: [
      'Platform adapters collect process, socket, file, identity, authentication, kernel, and health state, then attach executable identity where relevant.',
      'Collectors submit normalized gargoyle.event/v2 objects through a bounded nonblocking channel instead of writing directly to outputs.',
      'One pipeline thread applies policy and serializes events to stdout, JSONL, or Unix datagram outputs.',
      'Linux and Windows deployment assets harden service execution while platform-specific adapters remain behind a shared event model.',
    ],
    lessons: [
      'Observability software needs its own resource ceilings; a security sensor that can exhaust the host becomes part of the incident.',
      'Cross-platform support works better when the contract is shared but the host adapters are allowed to be native.',
      'Read-only telemetry is a meaningful security boundary, not merely a missing feature.',
    ],
    highlights: ['gargoyle.event/v2 contract', 'Bounded privileged collection', 'No remote command surface'],
  },
  {
    slug: 'offlinerepo',
    name: 'OFFLINEREPO',
    kicker: 'Portable multi-distro repository mirror',
    description:
      'A config-driven repository mirroring system for carrying APT, RPM, and APK ecosystems across disconnected boundaries and serving them locally with preserved package-management workflows.',
    tags: ['linux', 'air-gap', 'repositories', 'supply-chain'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/OFFLINEREPO',
    problem:
      'Air-gapped and disconnected Linux environments still need ordinary package management, but copying arbitrary package files does not preserve dependency resolution, repository metadata, signing, or repeatable synchronization across distributions.',
    constraints: [
      'Support Debian, Ubuntu, Kali, Proxmox, Fedora, Rocky, RHEL-family repositories, Alpine, and optional NVIDIA CUDA content.',
      'Keep repository state portable enough for removable media and incremental resynchronization.',
      'Preserve native APT, RPM, and APK consumption patterns instead of replacing them with ad hoc installation scripts.',
      'Make signing keys, snapshots, architectures, and enabled repositories explicit configuration rather than hidden operator state.',
    ],
    architecture: [
      'Config-driven sync paths separate APT, RPM, and APK repository families while sharing a portable repository root and retained state.',
      'Containerized tooling provides repeatable mirror environments without forcing every distribution-specific package utility onto the host.',
      'Published repository trees can be copied or synchronized into the disconnected environment and served by a simple local web server.',
      'Repository signing and snapshot retention preserve trust and rollback semantics after transport across the air gap.',
    ],
    lessons: [
      'Offline package delivery should preserve the package manager as the control plane instead of bypassing it.',
      'Repository signing proves publication identity and metadata integrity; it is not redundant with upstream package signatures.',
      'Multi-distribution support is cleaner when ecosystem-specific tooling shares one transport and state model rather than one giant abstraction.',
    ],
    highlights: ['APT + RPM + APK', 'Air-gap portable state', 'Signed local publishing'],
  },
  {
    slug: 'mayd-it',
    name: "MAY'D IT",
    kicker: 'Static-first engineering portfolio',
    description:
      'The portfolio itself: a two-origin static architecture with reproducible builds, supply-chain controls, a command interface, and an intentionally isolated browser arcade.',
    tags: ['astro', 'cloudflare', 'supply-chain', 'static-site'],
    status: 'active',
    repo: 'https://github.com/bobbymayyy/MAYD-IT',
    problem:
      'A technical portfolio should demonstrate engineering judgment without requiring a CMS, public admin panel, database, long-lived application host, or a dependency-heavy runtime merely to present static information.',
    constraints: [
      'Keep the public portfolio static and independent from homelab availability.',
      'Isolate experimental arcade code on a separate origin with no trusted backend relationship to the main site.',
      'Build from a locked dependency graph with lifecycle scripts disabled and deployment credentials isolated from application dependencies.',
      'Keep project content data-driven so new case studies can be added without creating a new page implementation each time.',
    ],
    architecture: [
      'Astro builds the portfolio and arcade into independent static artifacts deployed to separate Cloudflare Workers Static Assets origins.',
      'A latest → stable promotion model gates production while GitHub Actions runs build, signature, vulnerability, SBOM, and artifact-integrity checks.',
      'The project registry feeds reusable cards and one dynamic static route for every case study.',
      'The command interface and arcade add interaction entirely in the browser without creating accounts, APIs, databases, or server-side state.',
    ],
    lessons: [
      'A portfolio can demonstrate architecture through its own constraints instead of only describing other systems.',
      'Separating build and deployment credentials reduces what compromised dependencies can reach.',
      'Static-first does not mean interaction-free; it means adding runtime machinery only where it earns its existence.',
    ],
    highlights: ['No public application server', 'Locked CI/CD supply chain', 'Data-driven case studies'],
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
];
