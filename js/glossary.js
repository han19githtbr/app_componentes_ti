// ============================================================
//  SISTEMAS COMPUTACIONAIS — glossary.js
//  Glossário de Siglas / Acronym Glossary / Glossaire des Sigles
// ============================================================

const GLOSSARY_DATA = {
  pt: {
    title: "// glossário de siglas e termos técnicos",
    searchPlaceholder: "Buscar sigla ou termo... ex: NVMe, TCP, BIOS",
    noResults: "Nenhuma sigla encontrada para",
    categories: {
      hardware: "Hardware & Processamento",
      storage: "Armazenamento & Filesystems",
      memory: "Memória",
      network: "Redes & Protocolos",
      security: "Segurança",
      os: "Sistema Operacional",
      bios: "BIOS / Firmware",
      bus: "Barramentos & Interfaces",
      general: "Geral"
    }
  },
  en: {
    title: "// acronym and technical terms glossary",
    searchPlaceholder: "Search acronym or term... e.g. NVMe, TCP, BIOS",
    noResults: "No acronym found for",
    categories: {
      hardware: "Hardware & Processing",
      storage: "Storage & Filesystems",
      memory: "Memory",
      network: "Networks & Protocols",
      security: "Security",
      os: "Operating System",
      bios: "BIOS / Firmware",
      bus: "Buses & Interfaces",
      general: "General"
    }
  },
  fr: {
    title: "// glossaire des sigles et termes techniques",
    searchPlaceholder: "Rechercher un sigle... ex: NVMe, TCP, BIOS",
    noResults: "Aucun sigle trouvé pour",
    categories: {
      hardware: "Matériel & Traitement",
      storage: "Stockage & Systèmes de fichiers",
      memory: "Mémoire",
      network: "Réseaux & Protocoles",
      security: "Sécurité",
      os: "Système d'exploitation",
      bios: "BIOS / Firmware",
      bus: "Bus & Interfaces",
      general: "Général"
    }
  }
};

// Each entry: { acronym, full, desc: {pt, en, fr}, category, color }
const GLOSSARY_ENTRIES = [

  // ── HARDWARE & PROCESSAMENTO ─────────────────────────────
  {
    acronym: "CPU",
    full: { pt: "Unidade Central de Processamento", en: "Central Processing Unit", fr: "Unité Centrale de Traitement" },
    desc: {
      pt: "O \"cérebro\" do computador. Executa instruções de programas, realiza cálculos lógicos e aritméticos e coordena todos os outros componentes do sistema.",
      en: "The computer's \"brain\". Executes program instructions, performs logical and arithmetic calculations and coordinates all other system components.",
      fr: "Le \"cerveau\" de l'ordinateur. Exécute les instructions des programmes, effectue des calculs logiques et arithmétiques et coordonne tous les autres composants."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "GPU",
    full: { pt: "Unidade de Processamento Gráfico", en: "Graphics Processing Unit", fr: "Unité de Traitement Graphique" },
    desc: {
      pt: "Processador especializado em renderização de imagens e vídeo. Possui milhares de núcleos menores ideais para tarefas paralelas como gráficos 3D, IA e mineração de criptomoedas.",
      en: "Processor specialized in image and video rendering. Has thousands of smaller cores ideal for parallel tasks like 3D graphics, AI and crypto mining.",
      fr: "Processeur spécialisé dans le rendu d'images et de vidéos. Possède des milliers de petits cœurs idéaux pour les tâches parallèles comme les graphiques 3D, l'IA."
    },
    category: "hardware", color: "#a855f7"
  },
  {
    acronym: "ALU",
    full: { pt: "Unidade Lógica e Aritmética", en: "Arithmetic Logic Unit", fr: "Unité Arithmétique et Logique" },
    desc: {
      pt: "Parte interna da CPU responsável por executar operações matemáticas (soma, subtração, multiplicação) e operações lógicas (AND, OR, NOT, comparações).",
      en: "Internal part of the CPU responsible for executing mathematical operations (addition, subtraction, multiplication) and logical operations (AND, OR, NOT, comparisons).",
      fr: "Partie interne du CPU responsable d'exécuter des opérations mathématiques (addition, soustraction, multiplication) et logiques (ET, OU, NON, comparaisons)."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "FPU",
    full: { pt: "Unidade de Ponto Flutuante", en: "Floating Point Unit", fr: "Unité de Virgule Flottante" },
    desc: {
      pt: "Componente da CPU especializado em cálculos com números decimais (ponto flutuante). Essencial para jogos, simulações científicas e computação gráfica.",
      en: "CPU component specialized in decimal number calculations (floating point). Essential for games, scientific simulations and computer graphics.",
      fr: "Composant du CPU spécialisé dans les calculs avec des nombres décimaux (virgule flottante). Essentiel pour les jeux, les simulations scientifiques."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "TDP",
    full: { pt: "Dissipação Térmica de Projeto", en: "Thermal Design Power", fr: "Puissance de Conception Thermique" },
    desc: {
      pt: "Quantidade máxima de calor (em Watts) que o sistema de refrigeração precisa dissipar para manter o processador operando em temperatura segura. Indica o consumo energético típico do chip.",
      en: "Maximum amount of heat (in Watts) that the cooling system needs to dissipate to keep the processor operating at safe temperature. Indicates typical chip energy consumption.",
      fr: "Quantité maximale de chaleur (en Watts) que le système de refroidissement doit dissiper pour maintenir le processeur à une température sûre."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "IPC",
    full: { pt: "Instruções por Ciclo", en: "Instructions Per Cycle", fr: "Instructions Par Cycle" },
    desc: {
      pt: "Número médio de instruções que um processador executa a cada ciclo de clock. Um IPC maior significa processador mais eficiente, mesmo em frequências menores.",
      en: "Average number of instructions a processor executes per clock cycle. Higher IPC means more efficient processor, even at lower frequencies.",
      fr: "Nombre moyen d'instructions qu'un processeur exécute par cycle d'horloge. Un IPC plus élevé signifie un processeur plus efficace, même à des fréquences plus basses."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "SMT",
    full: { pt: "Multithreading Simultâneo", en: "Simultaneous Multi-Threading", fr: "Multi-Threading Simultané" },
    desc: {
      pt: "Tecnologia que permite a um núcleo físico da CPU executar dois threads ao mesmo tempo. A Intel chama de Hyper-Threading (HT). Aumenta a utilização dos recursos do núcleo.",
      en: "Technology that allows a physical CPU core to run two threads simultaneously. Intel calls it Hyper-Threading (HT). Increases core resource utilization.",
      fr: "Technologie permettant à un cœur physique du CPU d'exécuter deux threads simultanément. Intel l'appelle Hyper-Threading (HT)."
    },
    category: "hardware", color: "#ff6b35"
  },
  {
    acronym: "PSU",
    full: { pt: "Unidade de Fonte de Alimentação", en: "Power Supply Unit", fr: "Unité d'Alimentation" },
    desc: {
      pt: "Componente que converte a corrente alternada (CA) da tomada em corrente contínua (CC) com tensões estáveis (+3.3V, +5V, +12V) utilizadas pelos componentes internos do computador.",
      en: "Component that converts alternating current (AC) from the outlet into stable direct current (DC) voltages (+3.3V, +5V, +12V) used by computer internal components.",
      fr: "Composant qui convertit le courant alternatif (CA) de la prise en courant continu (CC) avec des tensions stables (+3,3V, +5V, +12V) utilisées par les composants internes."
    },
    category: "hardware", color: "#84cc16"
  },
  {
    acronym: "UPS",
    full: { pt: "Nobreak / Fonte de Alimentação Ininterrupta", en: "Uninterruptible Power Supply", fr: "Alimentation Sans Interruption" },
    desc: {
      pt: "Dispositivo com bateria interna que fornece energia ao computador por alguns minutos em caso de queda de luz. Protege contra perda de dados e danos por variações de tensão.",
      en: "Device with internal battery that provides power to the computer for a few minutes during power outage. Protects against data loss and damage from voltage fluctuations.",
      fr: "Dispositif avec batterie interne qui fournit de l'énergie à l'ordinateur pendant quelques minutes en cas de coupure de courant."
    },
    category: "hardware", color: "#84cc16"
  },
  {
    acronym: "NIC",
    full: { pt: "Controladora de Interface de Rede", en: "Network Interface Controller", fr: "Contrôleur d'Interface Réseau" },
    desc: {
      pt: "Placa ou chip que conecta o computador a uma rede. Pode ser com fio (Ethernet) ou sem fio (Wi-Fi). Cada NIC tem um endereço MAC único gravado no hardware.",
      en: "Card or chip that connects the computer to a network. Can be wired (Ethernet) or wireless (Wi-Fi). Each NIC has a unique MAC address burned into hardware.",
      fr: "Carte ou puce qui connecte l'ordinateur à un réseau. Peut être filaire (Ethernet) ou sans fil (Wi-Fi). Chaque NIC a une adresse MAC unique gravée dans le matériel."
    },
    category: "hardware", color: "#06b6d4"
  },

  // ── MEMÓRIA ─────────────────────────────────────────────
  {
    acronym: "RAM",
    full: { pt: "Memória de Acesso Aleatório", en: "Random Access Memory", fr: "Mémoire à Accès Aléatoire" },
    desc: {
      pt: "Memória volátil de alta velocidade que armazena temporariamente os dados e programas em uso. Ao desligar o computador, todos os dados na RAM são perdidos.",
      en: "High-speed volatile memory that temporarily stores data and programs in use. When the computer is turned off, all data in RAM is lost.",
      fr: "Mémoire volatile haute vitesse qui stocke temporairement les données et programmes en cours d'utilisation. Quand l'ordinateur est éteint, toutes les données RAM sont perdues."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "DDR",
    full: { pt: "Taxa de Dados Dupla", en: "Double Data Rate", fr: "Débit de Données Double" },
    desc: {
      pt: "Tecnologia de memória RAM que transfere dados duas vezes por ciclo de clock (na subida e descida do sinal). DDR4 e DDR5 são as gerações modernas, com DDR5 oferecendo largura de banda muito maior.",
      en: "RAM technology that transfers data twice per clock cycle (on rising and falling signal edges). DDR4 and DDR5 are modern generations, with DDR5 offering much greater bandwidth.",
      fr: "Technologie RAM qui transfère des données deux fois par cycle d'horloge. DDR4 et DDR5 sont les générations modernes, DDR5 offrant une bande passante beaucoup plus grande."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "DDR5",
    full: { pt: "Taxa de Dados Dupla — 5ª Geração", en: "Double Data Rate 5th Generation", fr: "Débit de Données Double — 5e Génération" },
    desc: {
      pt: "Geração atual de memória RAM para desktops e laptops. Oferece velocidades a partir de 4800 MT/s, maior densidade por módulo, menor consumo de energia (1.1V) e canais internos independentes por DIMM.",
      en: "Current generation of RAM for desktops and laptops. Offers speeds from 4800 MT/s, higher density per module, lower power consumption (1.1V) and independent internal channels per DIMM.",
      fr: "Génération actuelle de RAM pour ordinateurs de bureau et portables. Offre des vitesses à partir de 4800 MT/s, une densité plus élevée par module et une consommation d'énergie plus faible (1,1V)."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "ECC",
    full: { pt: "Memória com Correção de Erros", en: "Error-Correcting Code Memory", fr: "Mémoire à Code Correcteur d'Erreurs" },
    desc: {
      pt: "Tipo especial de RAM que detecta e corrige automaticamente erros de bit causados por radiação cósmica ou instabilidades elétricas. Usada em servidores e estações de trabalho críticas.",
      en: "Special type of RAM that automatically detects and corrects bit errors caused by cosmic radiation or electrical instabilities. Used in servers and critical workstations.",
      fr: "Type spécial de RAM qui détecte et corrige automatiquement les erreurs de bit causées par le rayonnement cosmique ou les instabilités électriques. Utilisé dans les serveurs."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "DIMM",
    full: { pt: "Módulo de Memória de Linha Dupla", en: "Dual In-line Memory Module", fr: "Module de Mémoire à Double Ligne" },
    desc: {
      pt: "Formato físico padrão dos pentes de RAM para desktops. Os contatos elétricos ficam em ambos os lados do módulo. SO-DIMM é a versão menor usada em notebooks.",
      en: "Standard physical format of RAM sticks for desktops. Electrical contacts are on both sides of the module. SO-DIMM is the smaller version used in laptops.",
      fr: "Format physique standard des barrettes RAM pour ordinateurs de bureau. Les contacts électriques sont sur les deux côtés du module. SO-DIMM est la version plus petite pour ordinateurs portables."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "VRAM",
    full: { pt: "Memória de Acesso Aleatório de Vídeo", en: "Video Random Access Memory", fr: "Mémoire Vidéo à Accès Aléatoire" },
    desc: {
      pt: "Memória dedicada da GPU que armazena texturas, framebuffers e dados gráficos. Quanto mais VRAM, maiores resoluções e qualidades de textura o jogo ou aplicação pode usar.",
      en: "Dedicated GPU memory that stores textures, framebuffers and graphics data. More VRAM means higher resolutions and texture quality games or applications can use.",
      fr: "Mémoire dédiée du GPU qui stocke les textures, les framebuffers et les données graphiques. Plus de VRAM signifie des résolutions et des qualités de texture plus élevées."
    },
    category: "memory", color: "#a855f7"
  },
  {
    acronym: "ROM",
    full: { pt: "Memória Apenas de Leitura", en: "Read-Only Memory", fr: "Mémoire en Lecture Seule" },
    desc: {
      pt: "Memória não-volátil cujo conteúdo é gravado durante a fabricação. Mantém os dados mesmo sem energia. Usada historicamente para firmware. Hoje substituída por Flash/EEPROM que podem ser atualizadas.",
      en: "Non-volatile memory whose content is written during manufacturing. Retains data even without power. Historically used for firmware. Now replaced by Flash/EEPROM that can be updated.",
      fr: "Mémoire non volatile dont le contenu est écrit pendant la fabrication. Conserve les données même sans alimentation. Utilisée historiquement pour le firmware."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "SRAM",
    full: { pt: "Memória RAM Estática", en: "Static Random Access Memory", fr: "Mémoire RAM Statique" },
    desc: {
      pt: "Tipo de RAM extremamente rápida e cara usada como memória cache (L1, L2, L3) dentro dos processadores. Não precisa de recarga periódica (refresh) como a DRAM.",
      en: "Extremely fast and expensive type of RAM used as cache memory (L1, L2, L3) inside processors. Does not need periodic refresh like DRAM.",
      fr: "Type de RAM extrêmement rapide et coûteux utilisé comme mémoire cache (L1, L2, L3) dans les processeurs. Ne nécessite pas de rafraîchissement périodique comme la DRAM."
    },
    category: "memory", color: "#22c55e"
  },
  {
    acronym: "DRAM",
    full: { pt: "Memória RAM Dinâmica", en: "Dynamic Random Access Memory", fr: "Mémoire RAM Dynamique" },
    desc: {
      pt: "Tipo mais comum de memória RAM (DDR4, DDR5). Armazena cada bit em um capacitor que precisa ser recarregado continuamente (refresh). Mais lenta que SRAM mas muito mais barata e densa.",
      en: "Most common type of RAM (DDR4, DDR5). Stores each bit in a capacitor that needs to be continuously refreshed. Slower than SRAM but much cheaper and denser.",
      fr: "Type le plus courant de RAM (DDR4, DDR5). Stocke chaque bit dans un condensateur qui doit être rechargé en continu. Plus lente que la SRAM mais beaucoup moins chère."
    },
    category: "memory", color: "#22c55e"
  },

  // ── ARMAZENAMENTO & FILESYSTEMS ─────────────────────────
  {
    acronym: "NVMe",
    full: { pt: "Memória Express Não-Volátil", en: "Non-Volatile Memory Express", fr: "Mémoire Express Non-Volatile" },
    desc: {
      pt: "Protocolo moderno de comunicação para SSDs conectados via PCIe. Elimina os gargalos do antigo protocolo AHCI, atingindo velocidades de leitura de até 7000 MB/s em SSDs Gen 4.",
      en: "Modern communication protocol for SSDs connected via PCIe. Eliminates old AHCI protocol bottlenecks, achieving read speeds up to 7000 MB/s on Gen 4 SSDs.",
      fr: "Protocole de communication moderne pour les SSD connectés via PCIe. Élimine les goulets d'étranglement de l'ancien protocole AHCI, atteignant des vitesses de lecture allant jusqu'à 7000 MB/s."
    },
    category: "storage", color: "#f59e0b"
  },
  {
    acronym: "SSD",
    full: { pt: "Unidade de Estado Sólido", en: "Solid-State Drive", fr: "Disque à État Solide" },
    desc: {
      pt: "Dispositivo de armazenamento que usa memória flash (NAND) em vez de discos magnéticos giratórios. Muito mais rápido, silencioso e resistente a impactos que os HDDs tradicionais.",
      en: "Storage device that uses flash memory (NAND) instead of spinning magnetic disks. Much faster, quieter and more impact-resistant than traditional HDDs.",
      fr: "Dispositif de stockage qui utilise de la mémoire flash (NAND) au lieu de disques magnétiques rotatifs. Beaucoup plus rapide, silencieux et résistant aux chocs que les HDD traditionnels."
    },
    category: "storage", color: "#f59e0b"
  },
  {
    acronym: "HDD",
    full: { pt: "Disco Rígido", en: "Hard Disk Drive", fr: "Disque Dur" },
    desc: {
      pt: "Dispositivo de armazenamento magnético com pratos giratórios e cabeças de leitura/escrita mecânicas. Maior capacidade por menor custo que SSDs, mas muito mais lento e sensível a impactos.",
      en: "Magnetic storage device with spinning platters and mechanical read/write heads. Higher capacity at lower cost than SSDs, but much slower and sensitive to impacts.",
      fr: "Dispositif de stockage magnétique avec des plateaux rotatifs et des têtes de lecture/écriture mécaniques. Plus grande capacité à moindre coût que les SSD, mais beaucoup plus lent."
    },
    category: "storage", color: "#f59e0b"
  },
  {
    acronym: "RAID",
    full: { pt: "Matriz Redundante de Discos Independentes", en: "Redundant Array of Independent Disks", fr: "Matrice Redondante de Disques Indépendants" },
    desc: {
      pt: "Técnica que combina múltiplos discos para aumentar desempenho ou redundância. RAID 0 = striping (velocidade). RAID 1 = espelho (segurança). RAID 5/6 = paridade (equilíbrio). RAID 10 = striping + espelho.",
      en: "Technique combining multiple disks for performance or redundancy. RAID 0 = striping (speed). RAID 1 = mirror (safety). RAID 5/6 = parity (balance). RAID 10 = striping + mirror.",
      fr: "Technique combinant plusieurs disques pour la performance ou la redondance. RAID 0 = striping (vitesse). RAID 1 = miroir (sécurité). RAID 5/6 = parité (équilibre)."
    },
    category: "storage", color: "#f59e0b"
  },
  {
    acronym: "NTFS",
    full: { pt: "Sistema de Arquivos de Nova Tecnologia", en: "New Technology File System", fr: "Système de Fichiers Nouvelle Technologie" },
    desc: {
      pt: "Sistema de arquivos padrão do Windows desde o XP. Suporta arquivos grandes (>4GB), permissões de segurança granulares, criptografia EFS, compressão, journaling e links simbólicos.",
      en: "Standard Windows file system since XP. Supports large files (>4GB), granular security permissions, EFS encryption, compression, journaling and symbolic links.",
      fr: "Système de fichiers standard de Windows depuis XP. Prend en charge les fichiers volumineux (>4 Go), les autorisations de sécurité granulaires, le chiffrement EFS, la compression et le journaling."
    },
    category: "storage", color: "#3b82f6"
  },
  {
    acronym: "ext4",
    full: { pt: "4ª Geração do Sistema de Arquivos Estendido", en: "Fourth Extended File System", fr: "Quatrième Système de Fichiers Étendu" },
    desc: {
      pt: "Sistema de arquivos padrão da maioria das distribuições Linux. Suporta volumes de até 1 Exabyte, journaling para recuperação de falhas, extents para alocação eficiente e data deduplication.",
      en: "Default file system for most Linux distributions. Supports volumes up to 1 Exabyte, journaling for failure recovery, extents for efficient allocation.",
      fr: "Système de fichiers par défaut pour la plupart des distributions Linux. Prend en charge des volumes jusqu'à 1 exaoctet, le journaling pour la récupération après sinistre et les extents."
    },
    category: "storage", color: "#3b82f6"
  },
  {
    acronym: "Btrfs",
    full: { pt: "Sistema de Arquivos em Árvore B", en: "B-Tree File System", fr: "Système de Fichiers Arbre B" },
    desc: {
      pt: "Sistema de arquivos Linux moderno com snapshots instantâneos, checksums de integridade de dados, RAID embutido, compressão transparente e subvolumes. Padrão no Fedora e openSUSE.",
      en: "Modern Linux file system with instant snapshots, data integrity checksums, built-in RAID, transparent compression and subvolumes. Default on Fedora and openSUSE.",
      fr: "Système de fichiers Linux moderne avec des instantanés, des checksums d'intégrité des données, RAID intégré, compression transparente et sous-volumes."
    },
    category: "storage", color: "#3b82f6"
  },
  {
    acronym: "XFS",
    full: { pt: "Sistema de Arquivos X", en: "X File System", fr: "Système de Fichiers X" },
    desc: {
      pt: "Sistema de arquivos de alto desempenho criado pela SGI, muito usado em servidores Linux (padrão no RHEL/CentOS). Excelente para arquivos grandes e I/O paralelo de alta velocidade.",
      en: "High-performance file system created by SGI, widely used in Linux servers (default on RHEL/CentOS). Excellent for large files and high-speed parallel I/O.",
      fr: "Système de fichiers haute performance créé par SGI, très utilisé dans les serveurs Linux (par défaut sur RHEL/CentOS). Excellent pour les gros fichiers et l'I/O parallèle."
    },
    category: "storage", color: "#3b82f6"
  },
  {
    acronym: "ZFS",
    full: { pt: "Sistema de Arquivos Zettabyte", en: "Zettabyte File System", fr: "Système de Fichiers Zettaoctet" },
    desc: {
      pt: "Sistema de arquivos avançado criado pela Sun Microsystems. Combina filesystem e gerenciamento de volume. Oferece checksums de dados end-to-end, RAID-Z, snapshots, deduplicação e auto-reparo.",
      en: "Advanced file system created by Sun Microsystems. Combines filesystem and volume management. Offers end-to-end data checksums, RAID-Z, snapshots, deduplication and self-healing.",
      fr: "Système de fichiers avancé créé par Sun Microsystems. Combine le système de fichiers et la gestion de volumes. Offre des checksums, RAID-Z, des instantanés et la déduplication."
    },
    category: "storage", color: "#3b82f6"
  },
  {
    acronym: "FAT32",
    full: { pt: "Tabela de Alocação de Arquivos 32 bits", en: "File Allocation Table 32-bit", fr: "Table d'Allocation de Fichiers 32 bits" },
    desc: {
      pt: "Sistema de arquivos legado amplamente compatível. Limitado a arquivos de no máximo 4GB e volumes de 2TB. Usado em pendrives e cartões SD por sua compatibilidade universal entre diferentes SOs.",
      en: "Legacy widely compatible file system. Limited to files of max 4GB and 2TB volumes. Used on USB drives and SD cards for universal compatibility across different OSes.",
      fr: "Système de fichiers hérité très compatible. Limité aux fichiers de 4 Go maximum et aux volumes de 2 To. Utilisé sur les clés USB et cartes SD pour la compatibilité universelle."
    },
    category: "storage", color: "#f59e0b"
  },
  {
    acronym: "APFS",
    full: { pt: "Sistema de Arquivos da Apple", en: "Apple File System", fr: "Système de Fichiers Apple" },
    desc: {
      pt: "Sistema de arquivos moderno da Apple, padrão no macOS, iOS, tvOS e watchOS desde 2017. Otimizado para SSDs com criptografia nativa, snapshots e clones de arquivos com custo zero.",
      en: "Apple's modern file system, standard on macOS, iOS, tvOS and watchOS since 2017. Optimized for SSDs with native encryption, snapshots and zero-cost file clones.",
      fr: "Système de fichiers moderne d'Apple, standard sur macOS, iOS, tvOS et watchOS depuis 2017. Optimisé pour les SSD avec chiffrement natif, instantanés et clones de fichiers."
    },
    category: "storage", color: "#f59e0b"
  },

  // ── BARRAMENTOS & INTERFACES ─────────────────────────────
  {
    acronym: "PCIe",
    full: { pt: "Interconexão de Componentes Periféricos Express", en: "Peripheral Component Interconnect Express", fr: "Interconnexion de Composants Périphériques Express" },
    desc: {
      pt: "Barramento de alta velocidade que conecta GPUs, SSDs NVMe, placas de rede e outros periféricos à placa-mãe. Versões atuais: PCIe 4.0 (≈2GB/s por lane) e PCIe 5.0 (≈4GB/s por lane).",
      en: "High-speed bus connecting GPUs, NVMe SSDs, network cards and other peripherals to the motherboard. Current versions: PCIe 4.0 (≈2GB/s per lane) and PCIe 5.0 (≈4GB/s per lane).",
      fr: "Bus haute vitesse connectant les GPU, SSD NVMe, cartes réseau et autres périphériques à la carte mère. Versions actuelles: PCIe 4.0 (≈2 Go/s par voie) et PCIe 5.0 (≈4 Go/s par voie)."
    },
    category: "bus", color: "#84cc16"
  },
  {
    acronym: "SATA",
    full: { pt: "Tecnologia de Conexão Avançada Serial ATA", en: "Serial Advanced Technology Attachment", fr: "Technologie d'Attachement Avancée Série" },
    desc: {
      pt: "Interface de conexão para HDDs e SSDs mais antigos. SATA III tem velocidade máxima de 600 MB/s, suficiente para HDDs mas limitante para SSDs modernos. Está sendo gradualmente substituído pelo NVMe.",
      en: "Connection interface for older HDDs and SSDs. SATA III has max speed of 600 MB/s, sufficient for HDDs but limiting for modern SSDs. Gradually being replaced by NVMe.",
      fr: "Interface de connexion pour les anciens HDD et SSD. SATA III a une vitesse maximale de 600 Mo/s, suffisant pour les HDD mais limitant pour les SSD modernes."
    },
    category: "bus", color: "#f59e0b"
  },
  {
    acronym: "USB",
    full: { pt: "Barramento Serial Universal", en: "Universal Serial Bus", fr: "Bus Série Universel" },
    desc: {
      pt: "Padrão universal para conexão de periféricos. USB 2.0 = 480 Mbps; USB 3.2 Gen 2 = 10 Gbps; USB4/Thunderbolt 4 = 40 Gbps. O conector USB-C é reversível e suporta energia, dados e vídeo.",
      en: "Universal standard for connecting peripherals. USB 2.0 = 480 Mbps; USB 3.2 Gen 2 = 10 Gbps; USB4/Thunderbolt 4 = 40 Gbps. USB-C connector is reversible and supports power, data and video.",
      fr: "Standard universel pour connecter des périphériques. USB 2.0 = 480 Mbps; USB 3.2 Gen 2 = 10 Gbps; USB4/Thunderbolt 4 = 40 Gbps. Le connecteur USB-C est réversible."
    },
    category: "bus", color: "#84cc16"
  },

  // ── BIOS / FIRMWARE ──────────────────────────────────────
  {
    acronym: "BIOS",
    full: { pt: "Sistema Básico de Entrada e Saída", en: "Basic Input/Output System", fr: "Système d'Entrée-Sortie de Base" },
    desc: {
      pt: "Firmware gravado em chip na placa-mãe que inicializa o hardware durante o boot e passa o controle ao sistema operacional. O BIOS legado usa MBR e está sendo substituído pelo UEFI.",
      en: "Firmware stored on chip on the motherboard that initializes hardware during boot and passes control to the OS. Legacy BIOS uses MBR and is being replaced by UEFI.",
      fr: "Firmware stocké sur puce sur la carte mère qui initialise le matériel lors du démarrage et passe le contrôle au système d'exploitation. Le BIOS hérité utilise MBR."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "UEFI",
    full: { pt: "Interface de Firmware Extensível Unificado", en: "Unified Extensible Firmware Interface", fr: "Interface Micrologiciel Extensible Unifié" },
    desc: {
      pt: "Substituto moderno do BIOS com interface gráfica, suporte a discos >2TB (GPT), boot seguro (Secure Boot), inicialização mais rápida, suporte a redes e módulos de segurança como TPM.",
      en: "Modern BIOS replacement with GUI, support for disks >2TB (GPT), Secure Boot, faster initialization, network support and security modules like TPM.",
      fr: "Remplacement moderne du BIOS avec interface graphique, support des disques >2 To (GPT), Démarrage Sécurisé, initialisation plus rapide, support réseau et modules de sécurité comme TPM."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "POST",
    full: { pt: "Autoteste de Inicialização", en: "Power-On Self-Test", fr: "Autotest à la Mise Sous Tension" },
    desc: {
      pt: "Diagnóstico automático executado pelo BIOS/UEFI toda vez que o computador é ligado. Verifica a integridade da CPU, RAM, GPU e outros componentes essenciais antes de carregar o SO.",
      en: "Automatic diagnostic run by BIOS/UEFI every time the computer is powered on. Checks the integrity of CPU, RAM, GPU and other essential components before loading the OS.",
      fr: "Diagnostic automatique exécuté par le BIOS/UEFI chaque fois que l'ordinateur est allumé. Vérifie l'intégrité du CPU, RAM, GPU et autres composants essentiels."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "CMOS",
    full: { pt: "Semicondutor de Óxido de Metal Complementar", en: "Complementary Metal-Oxide Semiconductor", fr: "Semi-conducteur Oxyde de Métal Complémentaire" },
    desc: {
      pt: "Memória de baixíssimo consumo alimentada por uma bateria na placa-mãe (CR2032) que armazena as configurações do BIOS como data/hora, sequência de boot e parâmetros de hardware.",
      en: "Very low power memory powered by a battery on the motherboard (CR2032) that stores BIOS settings like date/time, boot sequence and hardware parameters.",
      fr: "Mémoire à très faible consommation alimentée par une pile sur la carte mère (CR2032) qui stocke les paramètres du BIOS comme la date/heure, la séquence de démarrage."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "MBR",
    full: { pt: "Registro Mestre de Inicialização", en: "Master Boot Record", fr: "Enregistrement de Démarrage Principal" },
    desc: {
      pt: "Setor especial no início de um disco rígido com o código de boot e a tabela de partições. Limitado a discos de até 2TB e 4 partições primárias. Substituído pelo GPT em sistemas modernos.",
      en: "Special sector at the start of a hard disk containing boot code and partition table. Limited to disks up to 2TB and 4 primary partitions. Replaced by GPT on modern systems.",
      fr: "Secteur spécial au début d'un disque dur contenant le code de démarrage et la table de partitions. Limité aux disques jusqu'à 2 To et 4 partitions primaires."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "GPT",
    full: { pt: "Tabela de Partição GUID", en: "GUID Partition Table", fr: "Table de Partition GUID" },
    desc: {
      pt: "Padrão moderno para tabelas de partição que substitui o MBR. Suporta discos de até 9,4 ZB, até 128 partições primárias no Windows e inclui backup automático da tabela de partições.",
      en: "Modern partition table standard replacing MBR. Supports disks up to 9.4 ZB, up to 128 primary partitions on Windows and includes automatic backup of partition table.",
      fr: "Norme moderne de table de partitions remplaçant le MBR. Prend en charge des disques jusqu'à 9,4 ZB, jusqu'à 128 partitions primaires sur Windows et inclut une sauvegarde automatique."
    },
    category: "bios", color: "#ec4899"
  },
  {
    acronym: "TPM",
    full: { pt: "Módulo de Plataforma Confiável", en: "Trusted Platform Module", fr: "Module de Plateforme de Confiance" },
    desc: {
      pt: "Chip de segurança dedicado que gera e armazena chaves criptográficas, verifica integridade do boot e habilita recursos como BitLocker. TPM 2.0 é requisito do Windows 11.",
      en: "Dedicated security chip that generates and stores cryptographic keys, verifies boot integrity and enables features like BitLocker. TPM 2.0 is a Windows 11 requirement.",
      fr: "Puce de sécurité dédiée qui génère et stocke des clés cryptographiques, vérifie l'intégrité du démarrage et active des fonctionnalités comme BitLocker. TPM 2.0 est requis pour Windows 11."
    },
    category: "bios", color: "#ec4899"
  },

  // ── SISTEMA OPERACIONAL ──────────────────────────────────
  {
    acronym: "SO",
    full: { pt: "Sistema Operacional", en: "Operating System (OS)", fr: "Système d'Exploitation" },
    desc: {
      pt: "Software fundamental que gerencia os recursos de hardware e fornece serviços para aplicativos. Intermediário entre o hardware e os programas do usuário. Exemplos: Windows, Linux, macOS.",
      en: "Fundamental software that manages hardware resources and provides services for applications. Intermediary between hardware and user programs. Examples: Windows, Linux, macOS.",
      fr: "Logiciel fondamental qui gère les ressources matérielles et fournit des services pour les applications. Intermédiaire entre le matériel et les programmes utilisateur."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "API",
    full: { pt: "Interface de Programação de Aplicativos", en: "Application Programming Interface", fr: "Interface de Programmation d'Application" },
    desc: {
      pt: "Conjunto de definições e protocolos que permitem que softwares se comuniquem entre si. Define como fazer pedidos ao SO, a serviços web ou a outras bibliotecas. Exemplos: Win32 API, POSIX, REST API.",
      en: "Set of definitions and protocols allowing software to communicate with each other. Defines how to make requests to the OS, web services or other libraries. Examples: Win32 API, POSIX, REST API.",
      fr: "Ensemble de définitions et protocoles permettant aux logiciels de communiquer entre eux. Définit comment faire des demandes au système d'exploitation, aux services web ou aux bibliothèques."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "CLI",
    full: { pt: "Interface de Linha de Comando", en: "Command Line Interface", fr: "Interface en Ligne de Commande" },
    desc: {
      pt: "Interface de usuário baseada em texto onde comandos são digitados para executar funções do SO. Exemplos: Terminal do Linux/macOS (Bash, Zsh) e PowerShell/CMD do Windows.",
      en: "Text-based user interface where commands are typed to execute OS functions. Examples: Linux/macOS Terminal (Bash, Zsh) and Windows PowerShell/CMD.",
      fr: "Interface utilisateur en mode texte où des commandes sont tapées pour exécuter des fonctions du système d'exploitation. Exemples: Terminal Linux/macOS et PowerShell/CMD de Windows."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "GUI",
    full: { pt: "Interface Gráfica do Usuário", en: "Graphical User Interface", fr: "Interface Graphique Utilisateur" },
    desc: {
      pt: "Interface visual com ícones, janelas e menus que o usuário interage via mouse e teclado. Contrasta com a CLI baseada em texto. Windows Explorer, GNOME e macOS Finder são exemplos de GUIs.",
      en: "Visual interface with icons, windows and menus that users interact with via mouse and keyboard. Contrasts with text-based CLI. Windows Explorer, GNOME and macOS Finder are GUI examples.",
      fr: "Interface visuelle avec icônes, fenêtres et menus que l'utilisateur utilise via souris et clavier. Contraste avec la CLI textuelle. Windows Explorer, GNOME et macOS Finder sont des exemples."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "PID",
    full: { pt: "Identificador de Processo", en: "Process Identifier", fr: "Identifiant de Processus" },
    desc: {
      pt: "Número único atribuído pelo SO a cada processo em execução. Permite identificar, monitorar e gerenciar processos individualmente. Visível no Gerenciador de Tarefas (Windows) ou comando 'ps' (Linux).",
      en: "Unique number assigned by the OS to each running process. Allows identifying, monitoring and managing processes individually. Visible in Task Manager (Windows) or 'ps' command (Linux).",
      fr: "Numéro unique attribué par le système d'exploitation à chaque processus en cours d'exécution. Permet d'identifier, surveiller et gérer les processus individuellement."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "BSOD",
    full: { pt: "Tela Azul da Morte", en: "Blue Screen of Death", fr: "Écran Bleu de la Mort" },
    desc: {
      pt: "Tela de erro crítico do Windows que aparece quando o kernel detecta uma falha irrecuperável. Exibe um código de erro (STOP code) e reinicia o sistema. Causas comuns: driver defeituoso, RAM com erro ou overclocking instável.",
      en: "Windows critical error screen that appears when the kernel detects an unrecoverable failure. Displays an error code (STOP code) and restarts the system. Common causes: faulty driver, faulty RAM or unstable overclocking.",
      fr: "Écran d'erreur critique de Windows qui apparaît lorsque le noyau détecte une défaillance irrécupérable. Affiche un code d'erreur (STOP code) et redémarre le système."
    },
    category: "os", color: "#3b82f6"
  },

  // ── REDES & PROTOCOLOS ───────────────────────────────────
  {
    acronym: "TCP/IP",
    full: { pt: "Protocolo de Controle de Transmissão / Protocolo de Internet", en: "Transmission Control Protocol / Internet Protocol", fr: "Protocole de Contrôle de Transmission / Protocole Internet" },
    desc: {
      pt: "Suite de protocolos base da Internet. O IP cuida do endereçamento e roteamento de pacotes; o TCP garante a entrega confiável e ordenada dos dados com verificação de erros.",
      en: "Base protocol suite of the Internet. IP handles packet addressing and routing; TCP ensures reliable and ordered data delivery with error checking.",
      fr: "Suite de protocoles de base d'Internet. IP gère l'adressage et le routage des paquets; TCP assure la livraison fiable et ordonnée des données avec vérification des erreurs."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "TCP",
    full: { pt: "Protocolo de Controle de Transmissão", en: "Transmission Control Protocol", fr: "Protocole de Contrôle de Transmission" },
    desc: {
      pt: "Protocolo orientado à conexão que garante entrega confiável e ordenada de dados. Usa o handshake de três vias (SYN → SYN-ACK → ACK) para estabelecer conexão. Usado em HTTP, email e transferência de arquivos.",
      en: "Connection-oriented protocol that guarantees reliable and ordered data delivery. Uses the three-way handshake (SYN → SYN-ACK → ACK) to establish connection. Used in HTTP, email and file transfer.",
      fr: "Protocole orienté connexion garantissant une livraison fiable et ordonnée des données. Utilise le handshake en trois étapes (SYN → SYN-ACK → ACK) pour établir la connexion."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "UDP",
    full: { pt: "Protocolo de Datagrama do Usuário", en: "User Datagram Protocol", fr: "Protocole de Datagramme Utilisateur" },
    desc: {
      pt: "Protocolo sem conexão que envia pacotes sem garantia de entrega ou ordem. Mais rápido que o TCP por não ter overhead de confirmação. Ideal para streaming, jogos online e DNS.",
      en: "Connectionless protocol that sends packets without delivery or order guarantees. Faster than TCP due to no acknowledgment overhead. Ideal for streaming, online gaming and DNS.",
      fr: "Protocole sans connexion qui envoie des paquets sans garantie de livraison ou d'ordre. Plus rapide que TCP en raison de l'absence de surcharge d'accusé de réception."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "IP",
    full: { pt: "Protocolo de Internet", en: "Internet Protocol", fr: "Protocole Internet" },
    desc: {
      pt: "Protocolo responsável pelo endereçamento e roteamento de pacotes na internet. IPv4 usa endereços de 32 bits (ex: 192.168.1.1). IPv6 usa 128 bits para suportar muito mais dispositivos.",
      en: "Protocol responsible for packet addressing and routing on the internet. IPv4 uses 32-bit addresses (e.g. 192.168.1.1). IPv6 uses 128 bits to support many more devices.",
      fr: "Protocole responsable de l'adressage et du routage des paquets sur Internet. IPv4 utilise des adresses 32 bits (ex: 192.168.1.1). IPv6 utilise 128 bits pour supporter beaucoup plus d'appareils."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "DNS",
    full: { pt: "Sistema de Nomes de Domínio", en: "Domain Name System", fr: "Système de Noms de Domaine" },
    desc: {
      pt: "Sistema que traduz nomes de domínio legíveis (google.com) em endereços IP numéricos. Funciona como uma agenda telefônica da internet. Porta padrão: 53 (UDP/TCP).",
      en: "System that translates human-readable domain names (google.com) into numeric IP addresses. Works like the internet's phone book. Default port: 53 (UDP/TCP).",
      fr: "Système qui traduit les noms de domaine lisibles par l'homme (google.com) en adresses IP numériques. Fonctionne comme l'annuaire téléphonique d'Internet. Port par défaut: 53."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "DHCP",
    full: { pt: "Protocolo de Configuração Dinâmica de Host", en: "Dynamic Host Configuration Protocol", fr: "Protocole de Configuration Dynamique des Hôtes" },
    desc: {
      pt: "Protocolo que atribui automaticamente endereços IP, máscara de sub-rede, gateway e DNS aos dispositivos quando se conectam à rede. Elimina a necessidade de configuração manual.",
      en: "Protocol that automatically assigns IP addresses, subnet mask, gateway and DNS to devices when they connect to the network. Eliminates the need for manual configuration.",
      fr: "Protocole qui attribue automatiquement des adresses IP, masque de sous-réseau, passerelle et DNS aux appareils lors de leur connexion au réseau."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "HTTP",
    full: { pt: "Protocolo de Transferência de Hipertexto", en: "Hypertext Transfer Protocol", fr: "Protocole de Transfert Hypertexte" },
    desc: {
      pt: "Protocolo base da Web que define como mensagens são formatadas e transmitidas entre navegadores e servidores. HTTP/2 e HTTP/3 são versões modernas com melhor desempenho. Porta padrão: 80.",
      en: "Web's base protocol defining how messages are formatted and transmitted between browsers and servers. HTTP/2 and HTTP/3 are modern versions with better performance. Default port: 80.",
      fr: "Protocole de base du Web définissant comment les messages sont formatés et transmis entre navigateurs et serveurs. HTTP/2 et HTTP/3 sont des versions modernes plus performantes. Port: 80."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "HTTPS",
    full: { pt: "Protocolo de Transferência de Hipertexto Seguro", en: "Hypertext Transfer Protocol Secure", fr: "Protocole de Transfert Hypertexte Sécurisé" },
    desc: {
      pt: "Versão segura do HTTP que usa criptografia TLS/SSL para proteger a comunicação entre cliente e servidor. O cadeado verde no navegador indica HTTPS ativo. Porta padrão: 443.",
      en: "Secure version of HTTP using TLS/SSL encryption to protect communication between client and server. The green padlock in the browser indicates active HTTPS. Default port: 443.",
      fr: "Version sécurisée de HTTP utilisant le chiffrement TLS/SSL pour protéger la communication entre client et serveur. Le cadenas vert dans le navigateur indique HTTPS actif. Port: 443."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "FTP",
    full: { pt: "Protocolo de Transferência de Arquivos", en: "File Transfer Protocol", fr: "Protocole de Transfert de Fichiers" },
    desc: {
      pt: "Protocolo para transferência de arquivos entre computadores numa rede. Usa as portas 20 (dados) e 21 (controle). Transmite credenciais em texto puro — use SFTP ou FTPS para segurança.",
      en: "Protocol for file transfer between computers on a network. Uses ports 20 (data) and 21 (control). Transmits credentials in plain text — use SFTP or FTPS for security.",
      fr: "Protocole de transfert de fichiers entre ordinateurs sur un réseau. Utilise les ports 20 (données) et 21 (contrôle). Transmet les informations d'identification en clair — utilisez SFTP ou FTPS."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "SSH",
    full: { pt: "Shell Seguro", en: "Secure Shell", fr: "Shell Sécurisé" },
    desc: {
      pt: "Protocolo criptografado para acesso remoto seguro a sistemas Unix/Linux e outros dispositivos de rede. Substitui o Telnet inseguro. Usa criptografia assimétrica (par de chaves pública/privada). Porta: 22.",
      en: "Encrypted protocol for secure remote access to Unix/Linux systems and other network devices. Replaces insecure Telnet. Uses asymmetric encryption (public/private key pair). Port: 22.",
      fr: "Protocole chiffré pour l'accès distant sécurisé aux systèmes Unix/Linux et autres dispositifs réseau. Remplace Telnet non sécurisé. Utilise le chiffrement asymétrique (paire de clés). Port: 22."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "VPN",
    full: { pt: "Rede Virtual Privada", en: "Virtual Private Network", fr: "Réseau Privé Virtuel" },
    desc: {
      pt: "Tecnologia que cria um túnel criptografado sobre a internet para conectar dispositivos ou redes de forma segura e privada. Mascara o IP real do usuário e protege o tráfego em redes públicas.",
      en: "Technology creating an encrypted tunnel over the internet to connect devices or networks securely and privately. Masks the user's real IP and protects traffic on public networks.",
      fr: "Technologie créant un tunnel chiffré sur Internet pour connecter des appareils ou des réseaux de manière sécurisée et privée. Masque l'IP réelle de l'utilisateur."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "OSI",
    full: { pt: "Interconexão de Sistemas Abertos", en: "Open Systems Interconnection", fr: "Interconnexion de Systèmes Ouverts" },
    desc: {
      pt: "Modelo de referência com 7 camadas para entender e padronizar comunicações de rede: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação. Facilita o diagnóstico e o desenvolvimento de protocolos.",
      en: "7-layer reference model for understanding and standardizing network communications: Physical, Data Link, Network, Transport, Session, Presentation and Application. Facilitates diagnosis and protocol development.",
      fr: "Modèle de référence à 7 couches pour comprendre et standardiser les communications réseau: Physique, Liaison, Réseau, Transport, Session, Présentation et Application."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "MAC",
    full: { pt: "Controle de Acesso ao Meio", en: "Media Access Control", fr: "Contrôle d'Accès au Support" },
    desc: {
      pt: "Endereço físico único de 48 bits (ex: AA:BB:CC:DD:EE:FF) gravado na placa de rede pelo fabricante. Identifica dispositivos na camada 2 (enlace) do modelo OSI dentro de uma rede local.",
      en: "Unique 48-bit physical address (e.g. AA:BB:CC:DD:EE:FF) burned into the network card by the manufacturer. Identifies devices at layer 2 (data link) of the OSI model within a local network.",
      fr: "Adresse physique unique de 48 bits (ex: AA:BB:CC:DD:EE:FF) gravée dans la carte réseau par le fabricant. Identifie les appareils à la couche 2 (liaison) du modèle OSI."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "LAN",
    full: { pt: "Rede de Área Local", en: "Local Area Network", fr: "Réseau Local" },
    desc: {
      pt: "Rede de computadores que cobre uma área geográfica limitada como uma casa, escritório ou campus. Alta velocidade, baixa latência e gerenciada pelo próprio usuário/empresa.",
      en: "Computer network covering a limited geographic area like a home, office or campus. High speed, low latency and managed by the user/company themselves.",
      fr: "Réseau informatique couvrant une zone géographique limitée comme une maison, un bureau ou un campus. Haute vitesse, faible latence et géré par l'utilisateur/l'entreprise."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "WAN",
    full: { pt: "Rede de Área Ampla", en: "Wide Area Network", fr: "Réseau Étendu" },
    desc: {
      pt: "Rede que cobre grandes áreas geográficas, conectando múltiplas LANs. A internet é o maior exemplo de WAN. Geralmente provida por operadoras de telecomunicações.",
      en: "Network covering large geographic areas, connecting multiple LANs. The internet is the largest example of a WAN. Generally provided by telecommunications operators.",
      fr: "Réseau couvrant de grandes zones géographiques, connectant plusieurs LAN. Internet est le plus grand exemple de WAN. Généralement fourni par les opérateurs de télécommunications."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "NAT",
    full: { pt: "Tradução de Endereços de Rede", en: "Network Address Translation", fr: "Traduction d'Adresses Réseau" },
    desc: {
      pt: "Técnica que permite que múltiplos dispositivos de uma rede local compartilhem um único endereço IP público. O roteador mantém uma tabela de mapeamento entre IPs internos e portas externas.",
      en: "Technique allowing multiple devices on a local network to share a single public IP address. The router maintains a mapping table between internal IPs and external ports.",
      fr: "Technique permettant à plusieurs appareils d'un réseau local de partager une seule adresse IP publique. Le routeur maintient une table de correspondance entre IPs internes et ports externes."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "SYN",
    full: { pt: "Sincronização (flag TCP)", en: "Synchronize (TCP flag)", fr: "Synchroniser (drapeau TCP)" },
    desc: {
      pt: "Flag do cabeçalho TCP usado no início do handshake de três vias para iniciar uma conexão. O cliente envia SYN → servidor responde SYN-ACK → cliente confirma com ACK. Ataques SYN Flood exploram esse processo.",
      en: "TCP header flag used at the start of the three-way handshake to initiate a connection. Client sends SYN → server responds SYN-ACK → client confirms with ACK. SYN Flood attacks exploit this process.",
      fr: "Drapeau d'en-tête TCP utilisé au début du handshake en trois étapes pour initier une connexion. Le client envoie SYN → le serveur répond SYN-ACK → le client confirme avec ACK."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "ACK",
    full: { pt: "Confirmação (flag TCP)", en: "Acknowledgment (TCP flag)", fr: "Accusé de réception (drapeau TCP)" },
    desc: {
      pt: "Flag TCP que confirma o recebimento de dados. Parte essencial do controle de fluxo do TCP: o receptor envia ACK para cada pacote recebido, garantindo entrega confiável.",
      en: "TCP flag confirming data receipt. Essential part of TCP flow control: the receiver sends ACK for each received packet, ensuring reliable delivery.",
      fr: "Drapeau TCP confirmant la réception des données. Partie essentielle du contrôle de flux TCP: le récepteur envoie ACK pour chaque paquet reçu, garantissant une livraison fiable."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "Wi-Fi",
    full: { pt: "Fidelidade Sem Fio", en: "Wireless Fidelity", fr: "Fidélité Sans Fil" },
    desc: {
      pt: "Tecnologia de rede sem fio baseada nos padrões IEEE 802.11. Wi-Fi 6 (802.11ax) opera em 2.4/5 GHz com até 9.6 Gbps teóricos. Wi-Fi 6E adiciona a banda de 6 GHz para menor interferência.",
      en: "Wireless network technology based on IEEE 802.11 standards. Wi-Fi 6 (802.11ax) operates at 2.4/5 GHz with up to 9.6 Gbps theoretical speed. Wi-Fi 6E adds the 6 GHz band for less interference.",
      fr: "Technologie réseau sans fil basée sur les normes IEEE 802.11. Wi-Fi 6 (802.11ax) fonctionne à 2,4/5 GHz avec jusqu'à 9,6 Gbps théoriques. Wi-Fi 6E ajoute la bande 6 GHz."
    },
    category: "network", color: "#06b6d4"
  },

  // ── SEGURANÇA ────────────────────────────────────────────
  {
    acronym: "DDoS",
    full: { pt: "Ataque Distribuído de Negação de Serviço", en: "Distributed Denial of Service", fr: "Déni de Service Distribué" },
    desc: {
      pt: "Ataque onde múltiplos sistemas (botnets) inundam um alvo com tráfego excessivo para torná-lo indisponível. Diferente do DoS simples, o DDoS usa dezenas de milhares de máquinas comprometidas.",
      en: "Attack where multiple systems (botnets) flood a target with excessive traffic to make it unavailable. Unlike simple DoS, DDoS uses tens of thousands of compromised machines.",
      fr: "Attaque où plusieurs systèmes (botnets) inondent une cible de trafic excessif pour la rendre indisponible. Contrairement au DoS simple, le DDoS utilise des dizaines de milliers de machines compromises."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "DoS",
    full: { pt: "Negação de Serviço", en: "Denial of Service", fr: "Déni de Service" },
    desc: {
      pt: "Ataque que tenta tornar um serviço indisponível sobrecarregando-o com requisições ou explorando vulnerabilidades. Diferente do DDoS, parte de uma única origem.",
      en: "Attack attempting to make a service unavailable by overwhelming it with requests or exploiting vulnerabilities. Unlike DDoS, originates from a single source.",
      fr: "Attaque tentant de rendre un service indisponible en le surchargeant de requêtes ou en exploitant des vulnérabilités. Contrairement au DDoS, provient d'une seule source."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "SQL",
    full: { pt: "Linguagem de Consulta Estruturada", en: "Structured Query Language", fr: "Langage de Requête Structuré" },
    desc: {
      pt: "Linguagem padrão para gerenciar bancos de dados relacionais. SQL Injection é uma das vulnerabilidades mais comuns: acontece quando inputs não sanitizados permitem executar comandos SQL maliciosos.",
      en: "Standard language for managing relational databases. SQL Injection is one of the most common vulnerabilities: occurs when unsanitized inputs allow executing malicious SQL commands.",
      fr: "Langage standard pour gérer les bases de données relationnelles. L'injection SQL est l'une des vulnérabilités les plus courantes: se produit lorsque des entrées non assainies permettent d'exécuter des commandes SQL malveillantes."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "XSS",
    full: { pt: "Script Entre Sites", en: "Cross-Site Scripting", fr: "Script Inter-Sites" },
    desc: {
      pt: "Vulnerabilidade web onde um atacante injeta scripts maliciosos em páginas visualizadas por outros usuários. Pode roubar cookies de sessão, redirecionar usuários ou modificar o conteúdo da página.",
      en: "Web vulnerability where an attacker injects malicious scripts into pages viewed by other users. Can steal session cookies, redirect users or modify page content.",
      fr: "Vulnérabilité web où un attaquant injecte des scripts malveillants dans des pages vues par d'autres utilisateurs. Peut voler des cookies de session, rediriger des utilisateurs ou modifier le contenu de la page."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "AES",
    full: { pt: "Padrão de Criptografia Avançada", en: "Advanced Encryption Standard", fr: "Standard de Chiffrement Avancé" },
    desc: {
      pt: "Algoritmo de criptografia simétrica adotado como padrão pelo NIST em 2001. Usa chaves de 128, 192 ou 256 bits. AES-256 é considerado inquebrável com tecnologia atual e usado em HTTPS, VPNs e BitLocker.",
      en: "Symmetric encryption algorithm adopted as standard by NIST in 2001. Uses keys of 128, 192 or 256 bits. AES-256 is considered unbreakable with current technology and used in HTTPS, VPNs and BitLocker.",
      fr: "Algorithme de chiffrement symétrique adopté comme standard par le NIST en 2001. Utilise des clés de 128, 192 ou 256 bits. AES-256 est considéré incassable avec la technologie actuelle."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "TLS",
    full: { pt: "Segurança da Camada de Transporte", en: "Transport Layer Security", fr: "Sécurité de la Couche de Transport" },
    desc: {
      pt: "Protocolo criptográfico que fornece segurança nas comunicações de rede. Substituto do SSL. Usado no HTTPS para criptografar o tráfego entre navegador e servidor. TLS 1.3 é a versão atual mais segura.",
      en: "Cryptographic protocol providing security in network communications. SSL replacement. Used in HTTPS to encrypt traffic between browser and server. TLS 1.3 is the current most secure version.",
      fr: "Protocole cryptographique fournissant la sécurité dans les communications réseau. Successeur de SSL. Utilisé dans HTTPS pour chiffrer le trafic entre navigateur et serveur. TLS 1.3 est la version actuelle."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "SSL",
    full: { pt: "Camada de Soquetes Segura", en: "Secure Sockets Layer", fr: "Couche de Sockets Sécurisée" },
    desc: {
      pt: "Predecessor do TLS para criptografia de comunicações de rede. Considerado obsoleto e inseguro (SSLv3 foi depreciado em 2015). Ainda é comumente mencionado mesmo quando na prática é o TLS que está em uso.",
      en: "Predecessor to TLS for encrypting network communications. Considered obsolete and insecure (SSLv3 was deprecated in 2015). Still commonly mentioned even though TLS is what's actually in use.",
      fr: "Prédécesseur de TLS pour le chiffrement des communications réseau. Considéré obsolète et non sécurisé (SSLv3 déprécié en 2015). Encore souvent mentionné même si c'est TLS qui est réellement utilisé."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "MFA",
    full: { pt: "Autenticação Multifator", en: "Multi-Factor Authentication", fr: "Authentification Multifacteur" },
    desc: {
      pt: "Método de autenticação que exige dois ou mais fatores de verificação: algo que você sabe (senha), algo que você tem (token/app) e algo que você é (biometria). Aumenta drasticamente a segurança de contas.",
      en: "Authentication method requiring two or more verification factors: something you know (password), something you have (token/app) and something you are (biometrics). Drastically increases account security.",
      fr: "Méthode d'authentification nécessitant deux facteurs de vérification ou plus: quelque chose que vous savez (mot de passe), quelque chose que vous avez (token/app) et quelque chose que vous êtes (biométrie)."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "2FA",
    full: { pt: "Autenticação de Dois Fatores", en: "Two-Factor Authentication", fr: "Authentification à Deux Facteurs" },
    desc: {
      pt: "Forma específica de MFA que usa exatamente dois fatores de verificação. Comumente implementado como senha + código OTP via SMS, email ou app autenticador (Google Authenticator, Authy).",
      en: "Specific form of MFA using exactly two verification factors. Commonly implemented as password + OTP code via SMS, email or authenticator app (Google Authenticator, Authy).",
      fr: "Forme spécifique de MFA utilisant exactement deux facteurs de vérification. Couramment implémenté comme mot de passe + code OTP par SMS, email ou application d'authentification."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "CVE",
    full: { pt: "Vulnerabilidades e Exposições Comuns", en: "Common Vulnerabilities and Exposures", fr: "Vulnérabilités et Expositions Communes" },
    desc: {
      pt: "Sistema público de identificação de vulnerabilidades de segurança. Cada CVE tem um ID único (ex: CVE-2021-44228 = Log4Shell). Mantido pelo MITRE Corporation e financiado pelo governo dos EUA.",
      en: "Public system for identifying security vulnerabilities. Each CVE has a unique ID (e.g. CVE-2021-44228 = Log4Shell). Maintained by MITRE Corporation and funded by the US government.",
      fr: "Système public d'identification des vulnérabilités de sécurité. Chaque CVE a un ID unique (ex: CVE-2021-44228 = Log4Shell). Maintenu par MITRE Corporation et financé par le gouvernement américain."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "IDS",
    full: { pt: "Sistema de Detecção de Intrusão", en: "Intrusion Detection System", fr: "Système de Détection d'Intrusion" },
    desc: {
      pt: "Sistema que monitora o tráfego de rede ou atividade do sistema em busca de comportamentos suspeitos e emite alertas. Difere do IPS por apenas detectar, não bloquear automaticamente.",
      en: "System that monitors network traffic or system activity for suspicious behavior and issues alerts. Differs from IPS by only detecting, not automatically blocking.",
      fr: "Système qui surveille le trafic réseau ou l'activité du système à la recherche de comportements suspects et émet des alertes. Diffère de l'IPS en ne faisant que détecter, sans bloquer automatiquement."
    },
    category: "security", color: "#ef4444"
  },
  {
    acronym: "IPS",
    full: { pt: "Sistema de Prevenção de Intrusão", en: "Intrusion Prevention System", fr: "Système de Prévention d'Intrusion" },
    desc: {
      pt: "Evolução do IDS que além de detectar ataques pode bloqueá-los automaticamente em tempo real. Fica em linha no tráfego de rede e pode rejeitar pacotes maliciosos ou bloquear conexões.",
      en: "Evolution of IDS that in addition to detecting attacks can block them automatically in real time. Sits inline in network traffic and can reject malicious packets or block connections.",
      fr: "Évolution de l'IDS qui en plus de détecter les attaques peut les bloquer automatiquement en temps réel. Se trouve en ligne dans le trafic réseau et peut rejeter les paquets malveillants."
    },
    category: "security", color: "#ef4444"
  },

  // ── GERAL ────────────────────────────────────────────────
  {
    acronym: "I/O",
    full: { pt: "Entrada/Saída", en: "Input/Output", fr: "Entrée/Sortie" },
    desc: {
      pt: "Comunicação entre o processador/memória e dispositivos externos (teclado, disco, rede). I/O de disco é frequentemente o gargalo de desempenho mais comum em sistemas. Medido em IOPS ou MB/s.",
      en: "Communication between the processor/memory and external devices (keyboard, disk, network). Disk I/O is often the most common performance bottleneck in systems. Measured in IOPS or MB/s.",
      fr: "Communication entre le processeur/mémoire et les périphériques externes (clavier, disque, réseau). L'I/O disque est souvent le goulet d'étranglement le plus courant dans les systèmes."
    },
    category: "general", color: "#7a99bb"
  },
  {
    acronym: "IOPS",
    full: { pt: "Operações de Entrada/Saída por Segundo", en: "Input/Output Operations Per Second", fr: "Opérations d'Entrée/Sortie par Seconde" },
    desc: {
      pt: "Métrica de desempenho de armazenamento que mede quantas operações de leitura/escrita um disco executa por segundo. SSDs NVMe modernos atingem centenas de milhares de IOPS; HDDs raramente passam de 200.",
      en: "Storage performance metric measuring how many read/write operations a disk performs per second. Modern NVMe SSDs reach hundreds of thousands of IOPS; HDDs rarely exceed 200.",
      fr: "Métrique de performance de stockage mesurant combien d'opérations de lecture/écriture un disque effectue par seconde. Les SSD NVMe modernes atteignent des centaines de milliers d'IOPS."
    },
    category: "general", color: "#7a99bb"
  },
  {
    acronym: "OS",
    full: { pt: "Sistema Operacional", en: "Operating System", fr: "Système d'Exploitation" },
    desc: {
      pt: "Abreviação em inglês para Sistema Operacional (SO em português). Software base que gerencia hardware e fornece plataforma para aplicativos. Exemplos: Windows 11, Ubuntu Linux, macOS Sonoma.",
      en: "Abbreviation for Operating System. Base software that manages hardware and provides platform for applications. Examples: Windows 11, Ubuntu Linux, macOS Sonoma.",
      fr: "Abréviation de Système d'Exploitation. Logiciel de base qui gère le matériel et fournit une plateforme pour les applications. Exemples: Windows 11, Ubuntu Linux, macOS Sonoma."
    },
    category: "os", color: "#3b82f6"
  },
  {
    acronym: "SMTP",
    full: { pt: "Protocolo Simples de Transferência de Correio", en: "Simple Mail Transfer Protocol", fr: "Protocole Simple de Transfert de Courrier" },
    desc: {
      pt: "Protocolo para envio de emails entre servidores. Porta 25 (entre servidores), 587 (envio autenticado) e 465 (SSL). Para receber emails, usa-se IMAP (porta 143/993) ou POP3 (porta 110/995).",
      en: "Protocol for sending emails between servers. Port 25 (between servers), 587 (authenticated submission) and 465 (SSL). For receiving emails, IMAP (port 143/993) or POP3 (port 110/995) are used.",
      fr: "Protocole d'envoi d'emails entre serveurs. Port 25 (entre serveurs), 587 (soumission authentifiée) et 465 (SSL). Pour recevoir des emails, on utilise IMAP (port 143/993) ou POP3 (port 110/995)."
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "URL",
    full: { pt: "Localizador Uniforme de Recursos", en: "Uniform Resource Locator", fr: "Localisateur Uniforme de Ressources" },
    desc: {
      pt: "Endereço completo de um recurso na internet. Formato: protocolo://domínio:porta/caminho?parâmetros. Exemplo: https://www.exemplo.com.br:443/pagina?id=1",
      en: "Complete address of a resource on the internet. Format: protocol://domain:port/path?parameters. Example: https://www.example.com:443/page?id=1",
      fr: "Adresse complète d'une ressource sur Internet. Format: protocole://domaine:port/chemin?paramètres. Exemple: https://www.exemple.fr:443/page?id=1"
    },
    category: "network", color: "#06b6d4"
  },
  {
    acronym: "PWA",
    full: { pt: "Aplicativo Web Progressivo", en: "Progressive Web App", fr: "Application Web Progressive" },
    desc: {
      pt: "Aplicativo web que usa tecnologias modernas para oferecer experiência similar a apps nativos: instalável, funciona offline (Service Worker), recebe notificações push e é acessível sem loja de apps.",
      en: "Web application using modern technologies to offer a native app-like experience: installable, works offline (Service Worker), receives push notifications and is accessible without an app store.",
      fr: "Application web utilisant des technologies modernes pour offrir une expérience similaire aux applications natives: installable, fonctionne hors ligne, reçoit des notifications push."
    },
    category: "general", color: "#8b5cf6"
  }
];

// ============================================================
//  GLOSSARY VIEW INIT
// ============================================================
function initGlossary() {
  if (!DATA_STORE) return;
  renderGlossary('');
}

function renderGlossary(query) {
  const lang = currentLang;
  const g = GLOSSARY_DATA[lang] || GLOSSARY_DATA.pt;
  const container = document.getElementById('glossary-content');
  if (!container) return;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? GLOSSARY_ENTRIES.filter(e =>
        e.acronym.toLowerCase().includes(q) ||
        (e.full[lang] || e.full.pt).toLowerCase().includes(q) ||
        (e.desc[lang] || e.desc.pt).toLowerCase().includes(q)
      )
    : GLOSSARY_ENTRIES;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="glossary-no-results">${g.noResults} "<strong>${query}</strong>"</div>`;
    return;
  }

  // Group by category
  const groups = {};
  filtered.forEach(e => {
    const cat = e.category || 'general';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(e);
  });

  const categoryOrder = ['hardware','memory','storage','bus','bios','os','network','security','general'];

  let html = '';
  if (!q) {
    // Stats bar
    html += `<div class="glossary-stats">
      <span class="glossary-stat-badge">${GLOSSARY_ENTRIES.length} <span>siglas</span></span>
      <span class="glossary-stat-badge">${Object.keys(groups).length} <span>categorias</span></span>
    </div>`;
  } else {
    html += `<div class="glossary-stats">
      <span class="glossary-stat-badge">${filtered.length} <span>resultado${filtered.length !== 1 ? 's' : ''}</span></span>
    </div>`;
  }

  categoryOrder.forEach(cat => {
    if (!groups[cat]) return;
    const catLabel = g.categories[cat] || cat;
    html += `<div class="glossary-category">
      <div class="glossary-cat-header">${catLabel}</div>
      <div class="glossary-cards">`;

    groups[cat].forEach(e => {
      const fullText = e.full[lang] || e.full.pt;
      const descText = e.desc[lang] || e.desc.pt;
      const color = e.color || '#00d4ff';
      html += `
        <div class="glossary-card" style="--card-color:${color}">
          <div class="glossary-card-top">
            <span class="glossary-acronym" style="color:${color}">${e.acronym}</span>
            <span class="glossary-full">${fullText}</span>
          </div>
          <div class="glossary-desc">${descText}</div>
        </div>`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = html;
}

function glossarySearch() {
  const val = document.getElementById('glossary-search-input')?.value || '';
  renderGlossary(val);
}

function glossarySearchKey(e) {
  if (e.key === 'Escape') {
    document.getElementById('glossary-search-input').value = '';
    renderGlossary('');
  }
}
