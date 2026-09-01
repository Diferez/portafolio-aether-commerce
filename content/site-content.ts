import type { Locale } from "@/i18n/config";
import type { LandingContent } from "@/types/content";

const sharedKeywords = [
  "Diego Fernando Martinez",
  "Systems Engineer",
  "Full-Stack Software Engineer",
  "Backend Engineer",
  "Node.js",
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "AWS",
  "Google Cloud",
  "Stripe",
  "LangGraph",
  "AI agents",
] as const;

export const content = {
  es: {
    locale: "es",
    metadata: {
      title: "Ingeniero de Sistemas · Full-Stack con foco backend",
      description:
        "Portafolio de Diego Fernando Martinez: ingeniería full-stack con foco en backend, fintech, pagos, cloud y agentes de IA.",
      keywords: [
        ...sharedKeywords,
        "Ingeniero de Sistemas",
        "Desarrollador backend",
        "Arquitectura cloud",
        "Integraciones de pago",
        "Agentes de IA",
      ],
    },
    nav: {
      role: "Ingeniero de Sistemas",
      primaryLabel: "Navegación principal",
      items: [
        { label: "Proyectos", href: "#proyectos" },
        { label: "Capacidades", href: "#capacidades" },
        { label: "Enfoque", href: "#enfoque" },
      ],
      cta: "Contacto",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      switchLanguage: "Cambiar a inglés",
    },
    hero: {
      eyebrow: "Full-Stack Software Engineer · backend first",
      titleLead: "Construyo sistemas para productos reales.",
      description:
        "Convierto procesos complejos en productos digitales simples, confiables y listos para crecer. Diseño soluciones que automatizan operaciones, conectan servicios y eliminan fricción entre tu negocio y la tecnología.",
      secondaryDescription:
        "Conecto tecnología y operación para crear soluciones que simplifican procesos y hacen crecer tu negocio.",
      projectsCta: "Ver casos de estudio",
      contactCta: "Hablar conmigo",
      availability: "Disponible para proyectos seleccionados",
      location: "Colombia · remoto internacional",
      focusLabel: "Áreas de trabajo",
      focus: ["Backend & APIs", "Cloud", "Fintech", "IA aplicada"],
      diagramKicker: "Mapa de responsabilidad",
      diagramLabel: "Lo visible es solo la entrada.",
      diagramCoreTitle: "Arquitectura de producto",
      diagramCoreDetail: "El punto donde experiencia, backend, datos y operación dejan de ser piezas separadas.",
      diagramNodes: [
        {
          phase: "Entrada",
          title: "Flujo de usuario",
          detail: "Necesidad, restricción, estado y acción visible.",
        },
        {
          phase: "Núcleo",
          title: "Reglas y APIs",
          detail: "Servicios que validan, calculan, autorizan y coordinan.",
        },
        {
          phase: "Estado",
          title: "Datos e integraciones",
          detail: "Persistencia, pagos, eventos e idempotencia.",
        },
        {
          phase: "Salida",
          title: "Operación",
          detail: "Deploy, observabilidad, seguridad y mantenimiento.",
        },
      ],
      diagramCaption:
        "Diseño la interfaz como la puerta de un sistema que debe responder bien cuando hay usuarios, fallos y cambios.",
    },
    narrative: {
      eyebrow: "No parto de una plantilla",
      title: "Construyo alrededor de tu negocio.",
      descriptionOne: "Cada empresa tiene procesos, clientes y objetivos distintos.",
      descriptionTwo: "Diseño soluciones que se adaptan a ellos, no al revés.",
      firstStatement: "Tu negocio no debería adaptarse al software.",
      secondStatement: "El software debería adaptarse a tu negocio.",
      projectTitle: "Aquí está lo que ya he construido.",
      projectDescription: "Productos reales. Problemas reales. Decisiones reales.",
      projectPreviewAlt: "Vista principal de la tienda Liminal Accesorios",
    },
    aetherNarrative: {
      intro: {
        eyebrow: "Aether / comercio conectado",
        title: "Una tienda que funciona más allá de la interfaz.",
        paragraphs: [
          "Comprar es solo una parte del problema.",
          "Aether conecta la experiencia del cliente con inventario, pedidos, operación y asistencia inteligente en un mismo producto.",
        ],
      },
      storefront: {
        eyebrow: "Una experiencia pensada para comprar",
        title: "Menos fricción. Más claridad.",
        paragraphs: [
          "El cliente encuentra lo que necesita sin navegar entre ruido, menús innecesarios o procesos complicados.",
          "Productos, disponibilidad y compra forman parte de una misma experiencia.",
        ],
      },
      customerAssistant: {
        eyebrow: "El catálogo también puede conversar",
        title: "Encuentra lo que buscas conversando.",
        paragraphs: ["El asistente entiende lo que el cliente necesita, encuentra opciones reales dentro del catálogo y lo ayuda a avanzar hacia la compra."],
        emphasis: "No responde sobre una tienda. Forma parte de ella.",
      },
      administration: {
        eyebrow: "Del otro lado de la compra",
        title: "Lo que ocurre en la tienda se convierte en decisiones.",
        paragraphs: [
          "Pedidos, productos, inventario y señales importantes de la operación aparecen en un mismo lugar.",
          "El objetivo no es mostrar más información.",
        ],
        emphasis: "Es saber qué necesita atención.",
      },
      operationalAssistant: {
        eyebrow: "La operación también puede conversarse",
        title: "Preguntar en lugar de buscar.",
        paragraphs: [
          "¿Qué pedidos están procesándose?",
          "¿Qué productos tienen poco stock?",
          "Aether convierte información dispersa del negocio en respuestas directas y accionables.",
        ],
      },
      closing: {
        eyebrow: "Una sola experiencia, dos lados del negocio",
        title: "El cliente compra. El negocio responde.",
        paragraphs: [
          "Aether conecta ambos.",
          "No es solo una tienda con un panel administrativo ni un chatbot añadido encima. Es un producto diseñado para que clientes, datos y operación trabajen juntos.",
        ],
      },
      visuals: {
        sequenceLabel: "Secuencia visual del producto Aether",
        storefrontAlt: "Vista principal de la tienda Aether",
        storefrontAssistantAlt: "Asistente de compra de Aether",
        administrationAlt: "Panel administrativo de Aether",
        administrationAssistantAlt: "Asistente operativo del panel de Aether",
      },
    },
    expertise: {
      eyebrow: "01 / Propuesta de valor",
      title: "No separo el código del contexto operativo.",
      description:
        "Una interfaz es solo una parte del producto. Mi trabajo conecta decisiones de arquitectura, reglas de negocio, datos, integraciones y entrega continua.",
      items: [
        {
          index: "A",
          title: "Backend y arquitectura",
          description:
            "Diseño APIs, servicios y modelos de datos alrededor de límites claros, flujos críticos y mantenimiento a largo plazo.",
          evidence: ["Node.js / TypeScript", "Python", "REST / eventos", "SQL / NoSQL"],
        },
        {
          index: "B",
          title: "Producto de extremo a extremo",
          description:
            "Puedo llevar una funcionalidad desde la definición técnica hasta la interfaz, las pruebas y su despliegue.",
          evidence: ["React / Next.js", "Integraciones", "Testing", "CI/CD"],
        },
        {
          index: "C",
          title: "Sistemas sensibles",
          description:
            "Experiencia en banca, fintech y pagos, donde la trazabilidad, la idempotencia y el control de cambios importan.",
          evidence: ["Stripe", "Webhooks", "Microservicios", "Observabilidad"],
        },
      ],
    },
    projects: {
      eyebrow: "02 / Trabajo seleccionado",
      title: "Proyectos reales, explicados desde sus decisiones.",
      description:
        "Cada proyecto muestra el problema, la responsabilidad y las decisiones que sostienen el producto.",
      problemLabel: "Problema",
      responsibilityLabel: "Responsabilidad",
      decisionLabel: "Decisiones",
      resultLabel: "Estado / resultado",
      architectureLabel: "Flujo principal",
      items: [
        {
          number: "01",
          category: "Comercio electrónico + agentes de IA",
          title: "Aether Commerce",
          summary:
            "Un producto de comercio electrónico bilingüe con storefront, panel administrativo, API, pagos y un asistente capaz de consultar productos y operar el carrito con controles explícitos.",
          status: "Demo pública desplegada",
          statusTone: "live",
          sections: [
            {
              label: "Problema",
              body: "Construir una tienda que demostrara algo más que una interfaz: catálogo, carrito firmado, checkout, operación administrativa y asistencia conversacional conectada al dominio real.",
            },
            {
              label: "Responsabilidad",
              body: "Arquitectura e implementación del monorepo, contratos compartidos, Worker API, D1, storefront, panel administrativo, integración de Stripe y servicio de IA.",
            },
            {
              label: "Decisiones",
              body: "El backend recalcula precio e inventario; las mutaciones del asistente usan tokens de carrito e idempotencia; LangGraph coordina intención, restricciones, herramientas, validación y auditoría en la ruta Python validada.",
            },
            {
              label: "Estado / resultado",
              body: "Storefront, API, admin y asistente Worker están desplegados. La variante completa FastAPI/LangGraph está validada en Docker; su hosting separado con PostgreSQL y Redis permanece documentado como siguiente etapa.",
            },
          ],
          architecture: ["Storefront", "Asistente", "Worker API", "D1 / Stripe"],
          technologies: [
            "Next.js",
            "TypeScript",
            "Cloudflare Workers",
            "D1",
            "Python",
            "FastAPI",
            "LangGraph",
            "Gemini",
            "Stripe",
          ],
          href: "store",
          hrefLabel: "Abrir demo en producción",
          note: "El agente busca, compara y consulta variantes; las acciones mutables requieren autorización, validación y registro de auditoría.",
        },
        {
          number: "02",
          category: "Fintech + pagos",
          title: "SaaS de pagos flexibles",
          summary:
            "Plataforma para dividir pagos en cuotas configurables y coordinar procesos transaccionales entre la aplicación y servicios externos.",
          status: "Caso privado",
          statusTone: "private",
          sections: [
            {
              label: "Problema",
              body: "Modelar una experiencia flexible sin perder consistencia entre la interfaz, el estado del pago y los eventos externos.",
            },
            {
              label: "Responsabilidad",
              body: "Desarrollo full-stack e integración del frontend con un backend serverless y flujos transaccionales.",
            },
            {
              label: "Decisiones",
              body: "Separar presentación, lógica de negocio, persistencia y eventos; procesar cambios de estado mediante Stripe y webhooks.",
            },
            {
              label: "Estado / resultado",
              body: "Caso presentado sin identidad del cliente, métricas ni enlace público para respetar la confidencialidad.",
            },
          ],
          architecture: ["Next.js", "Cloud Functions", "Firestore", "Stripe"],
          technologies: ["Next.js", "Vercel", "Google Cloud", "Firestore", "Stripe"],
        },
        {
          number: "03",
          category: "Banca + microservicios",
          title: "Servicios para una plataforma bancaria",
          summary:
            "Trabajo en un entorno financiero donde cada cambio debía convivir con controles de entrega, separación de responsabilidades y estabilidad operativa.",
          status: "Experiencia profesional privada",
          statusTone: "private",
          sections: [
            {
              label: "Problema",
              body: "Evolucionar funcionalidades bancarias en una arquitectura distribuida sin comprometer trazabilidad ni confiabilidad.",
            },
            {
              label: "Responsabilidad",
              body: "Desarrollo y mantenimiento de servicios y funcionalidades como contratista externo.",
            },
            {
              label: "Decisiones",
              body: "Servicios desacoplados, funciones serverless, automatización de entrega y control cuidadoso de cambios.",
            },
            {
              label: "Estado / resultado",
              body: "Experiencia en producción descrita al nivel permitido; sin publicar datos internos de la organización.",
            },
          ],
          architecture: [
            "Interfaz Angular",
            "Servicios Node.js",
            "Funciones AWS Lambda",
            "Entrega con Azure DevOps",
          ],
          technologies: ["AWS Lambda", "Node.js", "Angular", "Azure DevOps", "CI/CD"],
        },
        {
          number: "04",
          category: "Cloud + operaciones financieras",
          title: "Plataforma financiera sobre AWS",
          summary:
            "Arquitectura con APIs, autenticación, datos relacionales e infraestructura reproducible para flujos financieros.",
          status: "Caso privado",
          statusTone: "validated",
          sections: [
            {
              label: "Problema",
              body: "Mantener una base técnica escalable y comprensible para una aplicación con reglas y datos financieros.",
            },
            {
              label: "Responsabilidad",
              body: "Diseño de la separación entre frontend, backend, datos e infraestructura.",
            },
            {
              label: "Decisiones",
              body: "Persistencia relacional en RDS, autenticación y despliegues automatizados con infraestructura como código.",
            },
            {
              label: "Estado / resultado",
              body: "Caso técnico publicable sin información comercial ni métricas no verificadas.",
            },
          ],
          technologies: ["AWS", "SST", "Amazon RDS", "APIs", "IaC"],
        },
      ],
    },
    capabilities: {
      eyebrow: "03 / Capacidades",
      title: "Tecnología organizada por el problema que resuelve.",
      description:
        "No uso porcentajes ni una pared de logos. Estas son las áreas en las que conecto herramientas con decisiones de producto y operación.",
      items: [
        {
          title: "Backend y APIs",
          description: "Servicios, reglas de negocio, autenticación, asincronía, eventos y contratos mantenibles.",
          tools: ["Node.js", "TypeScript", "NestJS", "Express", "Fastify", "Python"],
        },
        {
          title: "Frontend de producto",
          description: "Interfaces accesibles que reflejan con claridad el estado y las restricciones del dominio.",
          tools: ["React", "Next.js", "Angular", "SSR", "Accesibilidad"],
        },
        {
          title: "Cloud e infraestructura",
          description: "Sistemas serverless, observables y desplegables de forma reproducible.",
          tools: ["AWS", "Google Cloud", "Cloudflare", "Docker", "Terraform", "CI/CD"],
        },
        {
          title: "Datos",
          description: "Modelos relacionales y documentales, migraciones, índices y persistencia orientada a flujos reales.",
          tools: ["PostgreSQL", "MySQL", "RDS", "Firestore", "D1", "Redis"],
        },
        {
          title: "Pagos e integraciones",
          description: "Checkout, webhooks, suscripciones, reembolsos e idempotencia alrededor de eventos externos.",
          tools: ["Stripe", "Webhooks", "Clerk", "Resend", "APIs externas"],
        },
        {
          title: "IA aplicada y agentes",
          description: "Agentes con herramientas, RAG, grounding, validación, guardrails y respuestas ligadas a evidencia disponible.",
          tools: ["LangGraph", "Gemini", "Tool calling", "RAG", "SSE", "Evaluación"],
        },
        {
          title: "Calidad y entrega",
          description: "Pruebas, contratos, observabilidad, seguridad y despliegues por ambiente antes de producción.",
          tools: ["GitHub Actions", "Playwright", "OpenAPI", "Logging", "Métricas"],
        },
      ],
    },
    approach: {
      eyebrow: "04 / Enfoque",
      title: "Entiendo el dominio antes de proponer arquitectura.",
      description:
        "Trabajo por incrementos revisables y hago explícitos los riesgos temprano. La arquitectura debe facilitar el cambio, no volverlo ceremonial.",
      steps: [
        {
          number: "01",
          title: "Contexto",
          description: "Objetivos, usuarios, restricciones, flujos críticos y sistemas existentes.",
        },
        {
          number: "02",
          title: "Modelo",
          description: "Límites, datos, contratos, amenazas, integraciones y decisiones reversibles.",
        },
        {
          number: "03",
          title: "Entrega",
          description: "Incrementos pequeños, pruebas útiles, revisión y ambientes previos a producción.",
        },
        {
          number: "04",
          title: "Operación",
          description: "Despliegue controlado, señales observables, mantenimiento y evolución.",
        },
      ],
      principle: "La complejidad debe justificar su costo operativo.",
    },
    contact: {
      eyebrow: "05 / Contacto",
      title: "¿Hay un problema serio que resolver?",
      description:
        "Cuéntame el contexto, el estado actual y qué necesita cambiar. Respondo mejor a problemas concretos que a briefs llenos de adjetivos.",
      directLabel: "Canales directos",
      whatsappCta: "Escribir por WhatsApp",
    },
    footer: {
      summary: "Ingeniería full-stack con foco en backend, cloud y productos en producción.",
      rights: "Todos los derechos reservados.",
      backToTop: "Volver arriba",
      privacy: "Privacidad",
      cookies: "Cookies",
      terms: "Términos",
    },
  },
  en: {
    locale: "en",
    metadata: {
      title: "Systems Engineer · Backend-focused Full-Stack",
      description:
        "Diego Fernando Martinez's portfolio: backend-focused full-stack engineering for fintech, payments, cloud, and AI agents.",
      keywords: [
        ...sharedKeywords,
        "Backend developer",
        "Cloud architecture",
        "Payment integrations",
        "AI agent engineer",
      ],
    },
    nav: {
      role: "Systems Engineer",
      primaryLabel: "Primary navigation",
      items: [
        { label: "Projects", href: "#projects" },
        { label: "Capabilities", href: "#capabilities" },
        { label: "Approach", href: "#approach" },
      ],
      cta: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchLanguage: "Switch to Spanish",
    },
    hero: {
      eyebrow: "Full-Stack Software Engineer · backend first",
      titleLead: "I build systems for real products.",
      description:
        "Systems Engineer specializing in backend, APIs, and cloud architecture. I build complete products with Node.js, TypeScript, Python, React, and Next.js—particularly in fintech, commerce, payments, and applied AI.",
      secondaryDescription:
        "I connect products, payments, operations, and people so the system works beyond the interface.",
      projectsCta: "View case studies",
      contactCta: "Talk to me",
      availability: "Available for selected projects",
      location: "Colombia · international remote",
      focusLabel: "Areas of work",
      focus: ["Backend & APIs", "Cloud", "Fintech", "Applied AI"],
      diagramKicker: "Responsibility map",
      diagramLabel: "The visible layer is only the entry point.",
      diagramCoreTitle: "Product architecture",
      diagramCoreDetail: "Where experience, backend, data, and operations stop being separate pieces.",
      diagramNodes: [
        {
          phase: "Entry",
          title: "User flow",
          detail: "Need, constraint, state, and visible action.",
        },
        {
          phase: "Core",
          title: "Rules and APIs",
          detail: "Services that validate, calculate, authorize, and coordinate.",
        },
        {
          phase: "State",
          title: "Data and integrations",
          detail: "Persistence, payments, events, and idempotency.",
        },
        {
          phase: "Release",
          title: "Operations",
          detail: "Deploy, observability, security, and maintenance.",
        },
      ],
      diagramCaption:
        "I design the interface as the doorway into a system that must hold up under users, failures, and change.",
    },
    narrative: {
      eyebrow: "I don't start from a template",
      title: "I build around your business.",
      descriptionOne: "Every company has different processes, customers, and objectives.",
      descriptionTwo: "I design solutions that adapt to them, not the other way around.",
      firstStatement: "Your business should not adapt to software.",
      secondStatement: "Software should adapt to your business.",
      projectTitle: "Here is what I have already built.",
      projectDescription: "Real products. Real problems. Real decisions.",
      projectPreviewAlt: "Liminal Accesorios storefront main view",
    },
    aetherNarrative: {
      intro: {
        eyebrow: "Aether / connected commerce",
        title: "A store that works beyond the interface.",
        paragraphs: [
          "Buying is only one part of the problem.",
          "Aether connects the customer experience with inventory, orders, operations, and intelligent assistance in one product.",
        ],
      },
      storefront: {
        eyebrow: "An experience designed for buying",
        title: "Less friction. More clarity.",
        paragraphs: [
          "Customers find what they need without navigating noise, unnecessary menus, or complicated processes.",
          "Products, availability, and purchase belong to the same experience.",
        ],
      },
      customerAssistant: {
        eyebrow: "The catalogue can talk too",
        title: "Search stops being a guessing game.",
        paragraphs: ["The assistant understands what the customer needs, finds real options in the catalogue, and helps them move towards a purchase."],
        emphasis: "It does not answer about a store. It is part of it.",
      },
      administration: {
        eyebrow: "On the other side of the purchase",
        title: "What happens in the store becomes decisions.",
        paragraphs: [
          "Orders, products, inventory, and operational signals appear in one place.",
          "The goal is not to show more information.",
        ],
        emphasis: "It is knowing what needs attention.",
      },
      operationalAssistant: {
        eyebrow: "Operations can talk too",
        title: "Ask instead of search.",
        paragraphs: [
          "Which orders are being processed?",
          "Which products are low in stock?",
          "Aether turns dispersed business information into direct, actionable answers.",
        ],
      },
      closing: {
        eyebrow: "One experience, two sides of the business",
        title: "The customer buys. The business responds.",
        paragraphs: [
          "Aether connects both.",
          "It is not only a storefront with an admin panel or a chatbot added on top. It is a product designed so customers, data, and operations work together.",
        ],
      },
      visuals: {
        sequenceLabel: "Aether product visual sequence",
        storefrontAlt: "Aether storefront main view",
        storefrontAssistantAlt: "Aether shopping assistant",
        administrationAlt: "Aether administration dashboard",
        administrationAssistantAlt: "Aether administration operational assistant",
      },
    },
    expertise: {
      eyebrow: "01 / Value",
      title: "I do not separate code from its operating context.",
      description:
        "An interface is only one part of a product. My work connects architecture, business rules, data, integrations, and continuous delivery.",
      items: [
        {
          index: "A",
          title: "Backend and architecture",
          description:
            "I design APIs, services, and data models around clear boundaries, critical flows, and long-term maintenance.",
          evidence: ["Node.js / TypeScript", "Python", "REST / events", "SQL / NoSQL"],
        },
        {
          index: "B",
          title: "End-to-end product work",
          description:
            "I can take a feature from technical definition to interface, tests, and deployment.",
          evidence: ["React / Next.js", "Integrations", "Testing", "CI/CD"],
        },
        {
          index: "C",
          title: "Sensitive systems",
          description:
            "Experience in banking, fintech, and payments, where traceability, idempotency, and change control matter.",
          evidence: ["Stripe", "Webhooks", "Microservices", "Observability"],
        },
      ],
    },
    projects: {
      eyebrow: "02 / Selected work",
      title: "Real projects, explained through technical decisions.",
      description:
        "Each project explains the problem, ownership, and decisions that sustain the product. No invented metrics or confidential names.",
      problemLabel: "Problem",
      responsibilityLabel: "Ownership",
      decisionLabel: "Decisions",
      resultLabel: "Status / outcome",
      architectureLabel: "Main flow",
      items: [
        {
          number: "01",
          category: "Commerce + AI agents",
          title: "Aether Commerce",
          summary:
            "A bilingual commerce product with a storefront, admin, API, payments, and an assistant that can query products and operate the cart through explicit controls.",
          status: "Public demo deployed",
          statusTone: "live",
          sections: [
            {
              label: "Problem",
              body: "Build a store that demonstrated more than an interface: catalog, signed cart, checkout, admin operations, and conversational assistance connected to the real domain.",
            },
            {
              label: "Ownership",
              body: "Architecture and implementation of the monorepo, shared contracts, Worker API, D1, storefront, admin, Stripe integration, and AI service.",
            },
            {
              label: "Decisions",
              body: "The backend recalculates price and inventory; assistant mutations use cart tokens and idempotency; LangGraph coordinates intent, constraints, tools, validation, and audit in the validated Python path.",
            },
            {
              label: "Status / outcome",
              body: "The storefront, API, admin, and assistant Worker are deployed. The full FastAPI/LangGraph variant is Docker-validated; separate PostgreSQL and Redis hosting remains a documented next stage.",
            },
          ],
          architecture: ["Storefront", "Assistant", "Worker API", "D1 / Stripe"],
          technologies: [
            "Next.js",
            "TypeScript",
            "Cloudflare Workers",
            "D1",
            "Python",
            "FastAPI",
            "LangGraph",
            "Gemini",
            "Stripe",
          ],
          href: "store",
          hrefLabel: "Open production demo",
          note: "The agent searches, compares, and checks variants; mutable actions require authorization, validation, and audit records.",
        },
        {
          number: "02",
          category: "Fintech + payments",
          title: "Flexible payments SaaS",
          summary:
            "A platform for splitting payments into configurable installments and coordinating transactional processes across the application and external services.",
          status: "Private case",
          statusTone: "private",
          sections: [
            {
              label: "Problem",
              body: "Model a flexible experience without losing consistency between the interface, payment state, and external events.",
            },
            {
              label: "Ownership",
              body: "Full-stack development and integration of the frontend with a serverless backend and transactional flows.",
            },
            {
              label: "Decisions",
              body: "Separate presentation, business logic, persistence, and events; process state changes through Stripe and webhooks.",
            },
            {
              label: "Status / outcome",
              body: "Presented without client identity, metrics, or a public link to preserve confidentiality.",
            },
          ],
          architecture: ["Next.js", "Cloud Functions", "Firestore", "Stripe"],
          technologies: ["Next.js", "Vercel", "Google Cloud", "Firestore", "Stripe"],
        },
        {
          number: "03",
          category: "Banking + microservices",
          title: "Services for a banking platform",
          summary:
            "Work in a financial environment where every change had to coexist with delivery controls, clear ownership, and operational stability.",
          status: "Private professional work",
          statusTone: "private",
          sections: [
            {
              label: "Problem",
              body: "Evolve banking features in a distributed architecture without compromising traceability or reliability.",
            },
            {
              label: "Ownership",
              body: "Feature and service development and maintenance as an external contractor.",
            },
            {
              label: "Decisions",
              body: "Decoupled services, serverless functions, delivery automation, and careful change control.",
            },
            {
              label: "Status / outcome",
              body: "Production experience described at the permitted level, without internal organization data.",
            },
          ],
          architecture: [
            "Angular interface",
            "Node.js services",
            "AWS Lambda functions",
            "Azure DevOps delivery",
          ],
          technologies: ["AWS Lambda", "Node.js", "Angular", "Azure DevOps", "CI/CD"],
        },
        {
          number: "04",
          category: "Cloud + financial operations",
          title: "Financial platform on AWS",
          summary:
            "An architecture with APIs, authentication, relational data, and reproducible infrastructure for financial workflows.",
          status: "Private case",
          statusTone: "validated",
          sections: [
            {
              label: "Problem",
              body: "Maintain a scalable, understandable technical foundation for an application with financial rules and data.",
            },
            {
              label: "Ownership",
              body: "Design the separation between frontend, backend, data, and infrastructure.",
            },
            {
              label: "Decisions",
              body: "Relational persistence on RDS, authentication, and automated infrastructure-as-code deployments.",
            },
            {
              label: "Status / outcome",
              body: "A publishable technical case without commercial information or unverified metrics.",
            },
          ],
          technologies: ["AWS", "SST", "Amazon RDS", "APIs", "IaC"],
        },
      ],
    },
    capabilities: {
      eyebrow: "03 / Capabilities",
      title: "Technology organized by the problem it solves.",
      description:
        "No percentages or logo walls. These are the areas where I connect tools with product and operating decisions.",
      items: [
        {
          title: "Backend and APIs",
          description: "Services, business rules, authentication, async work, events, and maintainable contracts.",
          tools: ["Node.js", "TypeScript", "NestJS", "Express", "Fastify", "Python"],
        },
        {
          title: "Product frontend",
          description: "Accessible interfaces that clearly reflect domain state and constraints.",
          tools: ["React", "Next.js", "Angular", "SSR", "Accessibility"],
        },
        {
          title: "Cloud and infrastructure",
          description: "Serverless, observable systems that can be deployed reproducibly.",
          tools: ["AWS", "Google Cloud", "Cloudflare", "Docker", "Terraform", "CI/CD"],
        },
        {
          title: "Data",
          description: "Relational and document models, migrations, indexes, and persistence shaped around real workflows.",
          tools: ["PostgreSQL", "MySQL", "RDS", "Firestore", "D1", "Redis"],
        },
        {
          title: "Payments and integrations",
          description: "Checkout, webhooks, subscriptions, refunds, and idempotency around external events.",
          tools: ["Stripe", "Webhooks", "Clerk", "Resend", "External APIs"],
        },
        {
          title: "Applied AI and agents",
          description: "Tool-using agents, RAG, grounding, validation, guardrails, and answers tied to available evidence.",
          tools: ["LangGraph", "Gemini", "Tool calling", "RAG", "SSE", "Evaluation"],
        },
        {
          title: "Quality and delivery",
          description: "Tests, contracts, observability, security, and environment-based releases before production.",
          tools: ["GitHub Actions", "Playwright", "OpenAPI", "Logging", "Metrics"],
        },
      ],
    },
    approach: {
      eyebrow: "04 / Approach",
      title: "I understand the domain before proposing architecture.",
      description:
        "I work in reviewable increments and make risk visible early. Architecture should make change easier, not ceremonial.",
      steps: [
        {
          number: "01",
          title: "Context",
          description: "Goals, users, constraints, critical flows, and existing systems.",
        },
        {
          number: "02",
          title: "Model",
          description: "Boundaries, data, contracts, threats, integrations, and reversible decisions.",
        },
        {
          number: "03",
          title: "Delivery",
          description: "Small increments, useful tests, review, and pre-production environments.",
        },
        {
          number: "04",
          title: "Operations",
          description: "Controlled release, observable signals, maintenance, and evolution.",
        },
      ],
      principle: "Complexity must justify its operating cost.",
    },
    contact: {
      eyebrow: "05 / Contact",
      title: "Is there a serious problem to solve?",
      description:
        "Tell me the context, the current state, and what needs to change. I respond better to concrete problems than briefs full of adjectives.",
      directLabel: "Direct channels",
      whatsappCta: "Write on WhatsApp",
    },
    footer: {
      summary: "Backend-focused full-stack engineering for cloud products in production.",
      rights: "All rights reserved.",
      backToTop: "Back to top",
      privacy: "Privacy",
      cookies: "Cookies",
      terms: "Terms",
    },
  },
} as const satisfies Record<Locale, LandingContent>;
