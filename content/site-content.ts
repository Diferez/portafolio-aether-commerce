import type { Locale } from "@/i18n/config";
import type { LandingContent } from "@/types/content";

const sharedKeywords = [
  "Diego Fernando Martinez",
  "Backend Developer",
  "Next.js Developer",
  "Node.js Developer",
  "Cloud Software Engineer",
  "AWS Developer",
  "Azure Developer",
  "Google Cloud Developer",
  "SaaS Developer",
  "Stripe Integration Developer",
  "AI Automation Developer",
  "LLM Agent Developer",
  "Freelance Software Developer",
] as const;

export const content = {
  es: {
    locale: "es",
    metadata: {
      title: "Desarrollador Full Stack para productos web, cloud e IA",
      description:
        "Desarrollo aplicaciones web, plataformas SaaS, APIs, sistemas cloud, pagos, automatizaciones y soluciones con inteligencia artificial listas para producción.",
      keywords: [
        ...sharedKeywords,
        "Desarrollador Full Stack",
        "Desarrollo de aplicaciones web",
        "Desarrollo de plataformas SaaS",
        "Automatización con inteligencia artificial",
        "Integraciones de pago",
        "Arquitectura cloud",
      ],
    },
    nav: {
      items: [
        { label: "Inicio", href: "#inicio" },
        { label: "Servicios", href: "#servicios" },
        { label: "Experiencia", href: "#experiencia" },
        { label: "Proyectos", href: "#proyectos" },
        { label: "Tecnologías", href: "#tecnologias" },
        { label: "Inteligencia artificial", href: "#ia" },
        { label: "Contacto", href: "#contacto" },
      ],
      cta: "Iniciar un proyecto",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      switchLanguage: "Cambiar a inglés",
    },
    hero: {
      eyebrow: "Disponible para nuevos proyectos",
      title:
        "Construyo productos digitales completos, escalables y preparados para crecer.",
      description:
        "Desarrollo aplicaciones web, plataformas SaaS, APIs, arquitecturas cloud, sistemas de pago y soluciones de automatización con inteligencia artificial.",
      primaryCta: "Ver experiencia",
      secondaryCta: "Iniciar un proyecto",
      storeCta: "Explorar tienda demo",
      storeUnavailable: "Tienda demo próximamente",
      diagramTitle: "Plataforma completa",
      diagramNodes: [
        "Interfaz web",
        "API",
        "Base de datos",
        "Cloud",
        "Pagos",
        "IA",
        "Automatizaciones",
      ],
    },
    positioning: {
      title: "De la idea a producción.",
      stages: [
        "Diseño de solución",
        "Desarrollo",
        "Despliegue cloud",
        "Evolución continua",
      ],
    },
    services: {
      eyebrow: "Servicios",
      title:
        "Soluciones completas para construir, mejorar y operar productos digitales.",
      description:
        "Cada servicio se orienta a resultados de negocio: publicar más rápido, reducir riesgo técnico, integrar sistemas y sostener productos en producción.",
      items: [
        {
          title: "Aplicaciones web completas",
          description:
            "Diseño y desarrollo de plataformas SaaS, herramientas internas, portales, dashboards, sistemas administrativos y productos digitales completos.",
          icon: "app",
        },
        {
          title: "Backend y APIs",
          description:
            "APIs REST, autenticación, autorización, lógica de negocio, integraciones, procesamiento asíncrono y arquitecturas orientadas a eventos.",
          icon: "api",
        },
        {
          title: "Frontend moderno",
          description:
            "Interfaces rápidas, accesibles y responsive desarrolladas con React, Next.js, Angular, TypeScript y Tailwind CSS.",
          icon: "frontend",
        },
        {
          title: "Cloud y serverless",
          description:
            "Diseño, despliegue y mantenimiento de soluciones en AWS, Microsoft Azure, Google Cloud, Vercel y Supabase.",
          icon: "cloud",
        },
        {
          title: "Pagos e integraciones",
          description:
            "Integración de Stripe, webhooks, suscripciones, reembolsos, flujos transaccionales y servicios externos.",
          icon: "payments",
        },
        {
          title: "Inteligencia artificial y automatización",
          description:
            "Agentes basados en LLM, chatbots, tool calling, flujos inteligentes, asistentes empresariales y extracción estructurada de información.",
          icon: "ai",
        },
        {
          title: "DevOps y CI/CD",
          description:
            "Docker, pipelines automatizados, infraestructura como código, despliegues reproducibles, configuración por ambientes, monitoreo y logging.",
          icon: "devops",
        },
        {
          title: "Mantenimiento y optimización",
          description:
            "Corrección de errores, refactorización, modernización de aplicaciones, optimización de bases de datos, rendimiento, seguridad y escalabilidad.",
          icon: "maintenance",
        },
        {
          title: "Consultoría técnica",
          description:
            "Evaluación de arquitectura, selección de tecnologías, planificación de proyectos, identificación de riesgos y acompañamiento técnico.",
          icon: "consulting",
        },
      ],
    },
    clients: {
      eyebrow: "Para quién",
      title: "Trabajo con equipos que necesitan llevar software real a producción.",
      description:
        "La misma base técnica se adapta a startups, empresas en crecimiento, comercios y equipos que necesitan apoyo especializado.",
      items: [
        {
          title: "Startups",
          description:
            "Construcción de MVP, validación técnica, arquitectura inicial y evolución hacia una plataforma escalable.",
          icon: "startup",
        },
        {
          title: "Pequeñas y medianas empresas",
          description:
            "Digitalización de procesos, sistemas administrativos, automatización, integraciones y modernización de herramientas.",
          icon: "business",
        },
        {
          title: "Comercio y eCommerce",
          description:
            "Catálogos, pagos, pedidos, inventario, paneles administrativos, notificaciones y análisis comercial.",
          icon: "commerce",
        },
        {
          title: "Equipos de desarrollo",
          description:
            "Apoyo backend o frontend, mantenimiento, resolución de problemas, integraciones cloud y ampliación temporal del equipo.",
          icon: "team",
        },
        {
          title: "Clientes individuales",
          description:
            "Desarrollo de productos personalizados, plataformas especializadas y acompañamiento desde la idea hasta la publicación.",
          icon: "individual",
        },
      ],
    },
    experience: {
      eyebrow: "Experiencia",
      title: "Experiencia profesional en pagos, banca, cloud y productos web.",
      description:
        "Una línea de tiempo enfocada en responsabilidades confirmadas, sin métricas inventadas ni afirmaciones no verificadas.",
      items: [
        {
          company: "Utopia Group",
          role: "Software Engineer",
          period: "2025-2026",
          highlights: [
            "Implementación y mantenimiento de servicios de pago integrados con Stripe.",
            "Procesamiento de pagos, webhooks, reembolsos y suscripciones.",
            "Mejora de la confiabilidad del backend y de operaciones de facturación seguras y escalables.",
            "Mantenimiento de sistemas internos relacionados con pagos.",
          ],
        },
        {
          company: "SETI",
          role: "Software Engineer",
          period: "2021-2025",
          projects: [
            {
              title: "Aplicación bancaria para Banistmo",
              description:
                "Trabajo como contratista externo en una aplicación bancaria basada en microservicios.",
              highlights: [
                "AWS Lambda, Node.js y Angular.",
                "Administración de pipelines de CI/CD mediante Azure DevOps.",
                "Desarrollo y mantenimiento de servicios y funcionalidades empresariales.",
              ],
            },
            {
              title: "Plataforma SaaS de pagos flexibles",
              description:
                "Plataforma fintech y de administración de propiedades para dividir pagos de alquiler o reservas en cuotas personalizables sin intereses.",
              highlights: [
                "Integración con sistemas de administración de propiedades.",
                "Frontend en Next.js desplegado en Vercel.",
                "Backend serverless en Google Cloud con Firestore, Cloud Functions y Stripe.",
                "Flujos de pago y procesos transaccionales.",
              ],
            },
            {
              title: "Plataforma cloud de operaciones financieras",
              description:
                "Aplicación escalable para operaciones financieras con APIs, interfaces de usuario, autenticación y flujos transaccionales.",
              highlights: [
                "AWS, SST Framework y Amazon RDS.",
                "Pipelines de despliegue e infraestructura como código.",
                "Separación entre frontend, backend e infraestructura.",
              ],
            },
          ],
        },
        {
          company: "Talos",
          role: "Junior Software Engineer",
          period: "2020-2021",
          highlights: [
            "Participación en el desarrollo de una aplicación eCommerce.",
            "Desarrollo con React y Angular.",
            "Construcción y mejora de interfaces de usuario.",
            "Optimización del rendimiento de la aplicación.",
            "Trabajo dentro de un equipo de ingeniería de software.",
          ],
        },
      ],
    },
    caseStudies: {
      eyebrow: "Casos de estudio",
      title:
        "Proyectos presentados con contexto técnico sin revelar información confidencial.",
      description:
        "Los casos priorizan arquitectura, responsabilidades y consideraciones de seguridad sobre nombres privados o enlaces inexistentes.",
      items: [
        {
          eyebrow: "Banca y microservicios",
          title: "Plataforma bancaria basada en microservicios",
          summary:
            "Solución empresarial con servicios desacoplados, despliegues controlados y foco en confiabilidad para flujos bancarios.",
          sections: [
            {
              title: "Contexto",
              body: "Participación como contratista externo en una aplicación bancaria construida con microservicios.",
            },
            {
              title: "Responsabilidades",
              body: "Desarrollo y mantenimiento de funcionalidades, servicios y pipelines de entrega continua.",
            },
            {
              title: "Seguridad y confiabilidad",
              body: "Trabajo bajo consideraciones propias de sistemas financieros: control de cambios, trazabilidad, estabilidad operativa y separación de responsabilidades.",
            },
          ],
          technologies: [
            "AWS Lambda",
            "Node.js",
            "Angular",
            "Azure DevOps",
            "CI/CD",
            "Microservicios",
          ],
        },
        {
          eyebrow: "Fintech y propiedades",
          title: "Plataforma SaaS de pagos flexibles",
          summary:
            "Producto SaaS para dividir pagos en cuotas personalizables, integrar sistemas externos y operar flujos transaccionales.",
          sections: [
            {
              title: "Solución",
              body: "Frontend en Next.js, despliegue en Vercel y backend serverless en Google Cloud.",
            },
            {
              title: "Integraciones",
              body: "Conexión con sistemas externos, Stripe, webhooks y procesos transaccionales.",
            },
            {
              title: "Operación",
              body: "Separación entre interfaz, lógica de negocio, datos y eventos para facilitar mantenimiento y evolución.",
            },
          ],
          technologies: [
            "Next.js",
            "Vercel",
            "Google Cloud",
            "Firestore",
            "Cloud Functions",
            "Stripe",
            "Serverless",
          ],
        },
        {
          eyebrow: "Operaciones financieras",
          title: "Plataforma de operaciones financieras en AWS",
          summary:
            "Aplicación escalable para APIs, autenticación, persistencia relacional y despliegues automatizados.",
          sections: [
            {
              title: "Arquitectura",
              body: "Separación clara entre frontend, backend e infraestructura para mejorar mantenibilidad.",
            },
            {
              title: "Datos",
              body: "Persistencia relacional con Amazon RDS y modelado orientado a flujos financieros.",
            },
            {
              title: "Despliegue",
              body: "Automatización con infraestructura como código y pipelines de publicación.",
            },
          ],
          technologies: [
            "AWS",
            "SST Framework",
            "Amazon RDS",
            "APIs",
            "Autenticación",
            "Infraestructura como código",
          ],
        },
      ],
    },
    ai: {
      eyebrow: "IA aplicada",
      title: "Automatización con IA conectada a procesos reales.",
      description:
        "La inteligencia artificial se integra con reglas de negocio, datos, seguridad, observabilidad y supervisión humana.",
      note:
        "No se plantea la IA como una solución mágica: se diseña con validaciones, guardrails, registro de eventos y puntos claros de control humano.",
      items: [
        {
          title: "Agentes basados en LLM",
          description:
            "Agentes que usan herramientas, razonamiento estructurado, APIs, bases de datos, memoria, contexto y validación de resultados.",
          icon: "ai",
          items: [
            "Tool calling",
            "Procesamiento de documentos",
            "Extracción de datos",
            "Validación",
          ],
        },
        {
          title: "Chatbots empresariales",
          description:
            "Asistentes para atención al cliente, consultas internas, bases de conocimiento, integración con sistemas y escalamiento humano.",
          icon: "workflow",
          items: [
            "Soporte",
            "Consultas internas",
            "Bases de conocimiento",
            "Escalamiento",
          ],
        },
        {
          title: "Automatización inteligente",
          description:
            "Procesamiento de correos, clasificación de información, reportes, tareas operativas e integraciones activadas por eventos.",
          icon: "rocket",
          items: ["Correos", "Reportes", "Eventos", "Integraciones"],
        },
        {
          title: "Dashboards y datos en tiempo real",
          description:
            "WebSockets, métricas, alertas, visualización operativa, procesamiento de eventos y actualización en tiempo real.",
          icon: "database",
          items: ["WebSockets", "Métricas", "Alertas", "Eventos"],
        },
      ],
    },
    stack: {
      eyebrow: "Stack tecnológico",
      title: "Herramientas organizadas por capa, sin porcentajes artificiales.",
      description:
        "La tecnología se selecciona según el producto, el equipo, los costos, la seguridad, la escalabilidad y las necesidades operativas.",
      categories: [
        {
          title: "Lenguajes",
          items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML", "CSS"],
        },
        {
          title: "Frontend",
          items: [
            "React",
            "Next.js",
            "Angular",
            "Tailwind CSS",
            "Diseño responsive",
            "Accesibilidad",
            "Gestión de estado",
            "Integración con APIs",
            "Server-side rendering",
            "Static generation",
          ],
        },
        {
          title: "Backend",
          items: [
            "Node.js",
            "NestJS",
            "Express",
            "Fastify",
            "Django",
            "Flask",
            "APIs REST",
            "WebSockets",
            "Webhooks",
            "Hono",
            "Zod",
            "Procesamiento asíncrono",
            "Eventos",
            "Microservicios",
            "Serverless",
          ],
        },
        {
          title: "Inteligencia artificial",
          items: [
            "Agentes basados en LLM",
            "Chatbots",
            "Tool calling",
            "RAG",
            "Automatización inteligente",
            "Procesamiento de documentos",
            "Validación y guardrails",
            "Dashboards asistidos por IA",
          ],
        },
        {
          title: "AWS",
          items: [
            "AWS Lambda",
            "EC2",
            "RDS",
            "S3",
            "SES",
            "API Gateway",
            "SQS",
            "CloudWatch",
            "Cognito",
            "ECS",
            "CloudFront",
            "Serverless",
            "Infraestructura como código",
          ],
        },
        {
          title: "Microsoft Azure",
          items: [
            "Azure Functions",
            "App Service",
            "Azure DevOps",
            "Azure SQL",
            "Blob Storage",
            "Key Vault",
            "Pipelines de CI/CD",
          ],
        },
        {
          title: "Google Cloud",
          items: [
            "Cloud Functions",
            "Compute Engine",
            "Cloud Run",
            "Firestore",
            "Firebase",
            "Cloud Storage",
            "Pub/Sub",
            "Serverless",
          ],
        },
        {
          title: "Cloudflare",
          items: [
            "Cloudflare Workers",
            "Cloudflare Pages",
            "Cloudflare D1",
            "Wrangler",
            "Edge runtime",
            "Bindings",
            "Variables de entorno",
            "Despliegue serverless",
          ],
        },
        {
          title: "Plataformas gestionadas",
          items: [
            "Vercel",
            "Supabase",
            "Firebase",
            "Clerk",
            "Cloudinary",
            "Preview deployments",
            "Authentication",
            "Databases",
            "Storage",
            "Edge functions",
          ],
        },
        {
          title: "Bases de datos y datos",
          items: [
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Firestore",
            "Supabase",
            "Redis",
            "SQLite",
            "Cloudflare D1",
            "Drizzle ORM",
            "Amazon RDS",
            "Azure SQL",
            "Parquet",
            "Migraciones",
            "Índices",
            "Backups",
            "Procesamiento de datasets",
          ],
        },
        {
          title: "Integraciones y pagos",
          items: [
            "Stripe",
            "Stripe Checkout",
            "Resend",
            "Cloudinary",
            "Clerk",
            "Pagos",
            "Suscripciones",
            "Reembolsos",
            "Webhooks",
            "Correos transaccionales",
            "APIs externas",
          ],
        },
        {
          title: "DevOps e ingeniería",
          items: [
            "Docker",
            "Kubernetes",
            "Terraform",
            "GitHub Actions",
            "Wrangler",
            "pnpm workspace",
            "Azure DevOps",
            "CI/CD",
            "Pruebas unitarias",
            "Pruebas de integración",
            "Monitoreo",
            "Logging",
            "Seguridad",
            "Gestión de secretos",
            "Rendimiento",
          ],
        },
      ],
    },
    cloud: {
      eyebrow: "Multicloud",
      title: "Soluciones cloud sin limitarse a un solo proveedor.",
      description:
        "No todos los proyectos necesitan usar varias nubes al mismo tiempo. La arquitectura se define según el contexto, el presupuesto y las necesidades operativas.",
      platforms: ["AWS", "Microsoft Azure", "Google Cloud", "Cloudflare", "Vercel", "Supabase"],
      factors: [
        "Requisitos del producto",
        "Costos",
        "Escalabilidad",
        "Velocidad de desarrollo",
        "Seguridad",
        "Integraciones",
        "Experiencia del equipo",
        "Necesidades operativas",
      ],
    },
    process: {
      eyebrow: "Proceso",
      title: "Un flujo claro para pasar de incertidumbre a entregas progresivas.",
      description:
        "El trabajo combina descubrimiento, decisiones técnicas, comunicación frecuente y mantenimiento posterior al despliegue.",
      steps: [
        {
          title: "Discovery",
          description:
            "Alineación de objetivos, usuarios, restricciones, sistemas existentes y riesgos iniciales.",
        },
        {
          title: "Definición de alcance",
          description:
            "Priorización de entregables, fases, criterios de aceptación y dependencias.",
        },
        {
          title: "Diseño técnico",
          description:
            "Arquitectura, modelo de datos, integraciones, seguridad, despliegue y observabilidad.",
        },
        {
          title: "Desarrollo iterativo",
          description:
            "Implementación por incrementos revisables con comunicación frecuente.",
        },
        {
          title: "Pruebas y despliegue",
          description:
            "Validación funcional, accesibilidad, rendimiento y publicación controlada.",
        },
        {
          title: "Mantenimiento y evolución",
          description:
            "Correcciones, mejoras, monitoreo, nuevas funcionalidades y optimización.",
        },
      ],
    },
    differentiators: {
      eyebrow: "Diferenciadores",
      title: "Más que escribir código: construir sistemas sostenibles.",
      items: [
        "Visión completa de frontend, backend, datos e infraestructura para reducir fricciones entre capas.",
        "Experiencia en productos financieros y flujos de pago donde la confiabilidad y la trazabilidad importan.",
        "Capacidad para trabajar con AWS, Azure, Google Cloud y plataformas gestionadas según el caso.",
        "Automatización e inteligencia artificial integradas a procesos reales, con validaciones y supervisión.",
        "Enfoque en mantenibilidad: código legible, separación de responsabilidades, pruebas, monitoreo y despliegues reproducibles.",
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "Hablemos de tu proyecto.",
      description:
        "Comparte el contexto esencial y la solicitud quedara registrada de forma segura para seguimiento.",
      fields: {
        name: "Nombre",
        company: "Empresa",
        email: "Correo",
        projectType: "Tipo de proyecto",
        message: "Mensaje",
        preferredLanguage: "Idioma preferido",
        consent:
          "Acepto que la información enviada se use para responder esta solicitud.",
        website: "Sitio web",
      },
      placeholders: {
        name: "Tu nombre",
        company: "Empresa o equipo",
        email: "tu@empresa.com",
        message: "Cuéntame qué necesitas construir, mejorar o mantener.",
      },
      projectTypes: [
        "Aplicación completa",
        "Backend o API",
        "Frontend",
        "Cloud o DevOps",
        "Inteligencia artificial",
        "Mantenimiento",
        "Consultoría",
        "Otro",
      ],
      languageOptions: { es: "Español", en: "Inglés" },
      submit: "Solicitar una evaluación",
      whatsappCta: "Contactar por WhatsApp",
      sending: "Enviando solicitud...",
      success: "Solicitud recibida. Gracias por compartir el contexto.",
      error:
        "No fue posible enviar la solicitud. Inténtalo nuevamente en unos minutos.",
      privacy:
        "La información se usa únicamente para responder tu solicitud. No publiques secretos, claves ni datos sensibles en el mensaje.",
      validation: {
        required: "Este campo es obligatorio.",
        email: "Ingresa un correo válido.",
        message: "Incluye al menos 20 caracteres para entender el contexto.",
        consent: "Debes aceptar el tratamiento de la información enviada.",
      },
    },
    footer: {
      specialties: [
        "Web apps",
        "APIs",
        "Cloud",
        "Pagos",
        "IA aplicada",
        "DevOps",
      ],
      rights: "Todos los derechos reservados.",
      remote: "Disponible para proyectos remotos e internacionales.",
      privacyLabel: "Política de privacidad",
    },
  },
  en: {
    locale: "en",
    metadata: {
      title: "Diego Fernando Martinez | Full Stack Software Engineer",
      description:
        "I build web applications, SaaS platforms, APIs, cloud systems, payments, automation, and AI-enabled solutions ready for production.",
      keywords: [
        ...sharedKeywords,
        "Web application development",
        "SaaS platform development",
        "AI automation development",
        "Payment integrations",
        "Cloud architecture",
      ],
    },
    nav: {
      items: [
        { label: "Home", href: "#home" },
        { label: "Services", href: "#services" },
        { label: "Experience", href: "#experience" },
        { label: "Projects", href: "#projects" },
        { label: "Technologies", href: "#technologies" },
        { label: "Artificial intelligence", href: "#ai" },
        { label: "Contact", href: "#contact" },
      ],
      cta: "Start a project",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchLanguage: "Switch to Spanish",
    },
    hero: {
      eyebrow: "Available for selected projects",
      title: "I build complete, scalable digital products designed to grow.",
      description:
        "I develop web applications, SaaS platforms, APIs, cloud architectures, payment systems, and AI-powered automation solutions.",
      primaryCta: "Explore my experience",
      secondaryCta: "Start a project",
      storeCta: "Explore demo store",
      storeUnavailable: "Demo store coming soon",
      diagramTitle: "Complete platform",
      diagramNodes: [
        "Web interface",
        "API",
        "Database",
        "Cloud",
        "Payments",
        "AI",
        "Automations",
      ],
    },
    positioning: {
      title: "From idea to production.",
      stages: [
        "Product design",
        "Development",
        "Cloud deployment",
        "Continuous improvement",
      ],
    },
    services: {
      eyebrow: "Services",
      title: "Complete solutions to build, improve, and operate digital products.",
      description:
        "Each service is focused on business outcomes: shipping faster, reducing technical risk, integrating systems, and sustaining production products.",
      items: [
        {
          title: "Complete web applications",
          description:
            "Design and development of SaaS platforms, internal tools, portals, dashboards, admin systems, and complete digital products.",
          icon: "app",
        },
        {
          title: "Backend and APIs",
          description:
            "REST APIs, authentication, authorization, business logic, integrations, asynchronous processing, and event-driven architectures.",
          icon: "api",
        },
        {
          title: "Modern frontend",
          description:
            "Fast, accessible, responsive interfaces built with React, Next.js, Angular, TypeScript, and Tailwind CSS.",
          icon: "frontend",
        },
        {
          title: "Cloud and serverless",
          description:
            "Design, deployment, and maintenance of solutions on AWS, Microsoft Azure, Google Cloud, Vercel, and Supabase.",
          icon: "cloud",
        },
        {
          title: "Payments and integrations",
          description:
            "Stripe integration, webhooks, subscriptions, refunds, transactional flows, and external services.",
          icon: "payments",
        },
        {
          title: "Artificial intelligence and automation",
          description:
            "LLM-based agents, chatbots, tool calling, intelligent workflows, business assistants, and structured data extraction.",
          icon: "ai",
        },
        {
          title: "DevOps and CI/CD",
          description:
            "Docker, automated pipelines, infrastructure as code, reproducible deployments, environment configuration, monitoring, and logging.",
          icon: "devops",
        },
        {
          title: "Maintenance and optimization",
          description:
            "Bug fixing, refactoring, application modernization, database optimization, performance, security, and scalability.",
          icon: "maintenance",
        },
        {
          title: "Technical consulting",
          description:
            "Architecture assessment, technology selection, project planning, risk identification, and technical guidance.",
          icon: "consulting",
        },
      ],
    },
    clients: {
      eyebrow: "Who it helps",
      title: "I work with teams that need real software shipped to production.",
      description:
        "The same technical foundation adapts to startups, growing companies, commerce businesses, and teams that need specialized support.",
      items: [
        {
          title: "Startups",
          description:
            "MVP development, technical validation, initial architecture, and evolution toward a scalable platform.",
          icon: "startup",
        },
        {
          title: "Small and midsize businesses",
          description:
            "Process digitalization, admin systems, automation, integrations, and modernization of existing tools.",
          icon: "business",
        },
        {
          title: "Commerce and eCommerce",
          description:
            "Catalogs, payments, orders, inventory, admin panels, notifications, and business analytics.",
          icon: "commerce",
        },
        {
          title: "Development teams",
          description:
            "Backend or frontend support, maintenance, troubleshooting, cloud integrations, and temporary team extension.",
          icon: "team",
        },
        {
          title: "Individual clients",
          description:
            "Custom product development, specialized platforms, and guidance from idea to launch.",
          icon: "individual",
        },
      ],
    },
    experience: {
      eyebrow: "Experience",
      title: "Professional experience across payments, banking, cloud, and web products.",
      description:
        "A timeline focused on confirmed responsibilities, without invented metrics or unsupported claims.",
      items: [
        {
          company: "Utopia Group",
          role: "Software Engineer",
          period: "2025-2026",
          highlights: [
            "Implementation and maintenance of payment services integrated with Stripe.",
            "Payment processing, webhooks, refunds, and subscriptions.",
            "Improved backend reliability and safe, scalable billing operations.",
            "Maintenance of internal systems related to payments.",
          ],
        },
        {
          company: "SETI",
          role: "Software Engineer",
          period: "2021-2025",
          projects: [
            {
              title: "Banking application for Banistmo",
              description:
                "External contractor work on a banking application based on microservices.",
              highlights: [
                "AWS Lambda, Node.js, and Angular.",
                "CI/CD pipeline administration through Azure DevOps.",
                "Development and maintenance of enterprise services and features.",
              ],
            },
            {
              title: "Flexible Payments SaaS Platform",
              description:
                "Fintech and property management platform for splitting rent or reservation payments into customizable interest-free installments.",
              highlights: [
                "Integration with property management systems.",
                "Frontend built with Next.js and deployed on Vercel.",
                "Serverless backend on Google Cloud with Firestore, Cloud Functions, and Stripe.",
                "Payment flows and transactional processes.",
              ],
            },
            {
              title: "Cloud Financial Operations Platform",
              description:
                "Scalable application for financial operations with APIs, user interfaces, authentication, and transactional flows.",
              highlights: [
                "AWS, SST Framework, and Amazon RDS.",
                "Deployment pipelines and infrastructure as code.",
                "Separation between frontend, backend, and infrastructure.",
              ],
            },
          ],
        },
        {
          company: "Talos",
          role: "Junior Software Engineer",
          period: "2020-2021",
          highlights: [
            "Participation in the development of an eCommerce application.",
            "Development with React and Angular.",
            "Building and improving user interfaces.",
            "Application performance optimization.",
            "Work within a software engineering team.",
          ],
        },
      ],
    },
    caseStudies: {
      eyebrow: "Case studies",
      title:
        "Projects presented with technical context without exposing confidential information.",
      description:
        "These cases prioritize architecture, responsibilities, and security considerations over private names or unavailable links.",
      items: [
        {
          eyebrow: "Banking and microservices",
          title: "Microservices-based banking platform",
          summary:
            "Enterprise solution with decoupled services, controlled deployments, and reliability focus for banking workflows.",
          sections: [
            {
              title: "Context",
              body: "External contractor participation in a banking application built with microservices.",
            },
            {
              title: "Responsibilities",
              body: "Development and maintenance of features, services, and continuous delivery pipelines.",
            },
            {
              title: "Security and reliability",
              body: "Work under financial-system considerations: change control, traceability, operational stability, and separation of responsibilities.",
            },
          ],
          technologies: [
            "AWS Lambda",
            "Node.js",
            "Angular",
            "Azure DevOps",
            "CI/CD",
            "Microservices",
          ],
        },
        {
          eyebrow: "Fintech and property operations",
          title: "Flexible Payments SaaS Platform",
          summary:
            "SaaS product for splitting payments into customizable installments, integrating external systems, and operating transactional workflows.",
          sections: [
            {
              title: "Solution",
              body: "Next.js frontend, Vercel deployment, and serverless backend on Google Cloud.",
            },
            {
              title: "Integrations",
              body: "External systems, Stripe, webhooks, and transactional processes.",
            },
            {
              title: "Operations",
              body: "Separation between interface, business logic, data, and events to support maintenance and evolution.",
            },
          ],
          technologies: [
            "Next.js",
            "Vercel",
            "Google Cloud",
            "Firestore",
            "Cloud Functions",
            "Stripe",
            "Serverless",
          ],
        },
        {
          eyebrow: "Financial operations",
          title: "AWS financial operations platform",
          summary:
            "Scalable application for APIs, authentication, relational persistence, and automated deployments.",
          sections: [
            {
              title: "Architecture",
              body: "Clear separation between frontend, backend, and infrastructure to improve maintainability.",
            },
            {
              title: "Data",
              body: "Relational persistence with Amazon RDS and modeling oriented around financial workflows.",
            },
            {
              title: "Deployment",
              body: "Automation with infrastructure as code and release pipelines.",
            },
          ],
          technologies: [
            "AWS",
            "SST Framework",
            "Amazon RDS",
            "APIs",
            "Authentication",
            "Infrastructure as code",
          ],
        },
      ],
    },
    ai: {
      eyebrow: "Applied AI",
      title: "AI automation connected to real business processes.",
      description:
        "Artificial intelligence is integrated with business rules, data, security, observability, and human supervision.",
      note:
        "AI is not treated as magic: systems are designed with validation, guardrails, event logging, and clear human control points.",
      items: [
        {
          title: "LLM-based agents",
          description:
            "Agents that use tools, structured reasoning, APIs, databases, memory, context, and result validation.",
          icon: "ai",
          items: [
            "Tool calling",
            "Document processing",
            "Data extraction",
            "Validation",
          ],
        },
        {
          title: "Business chatbots",
          description:
            "Assistants for customer support, internal queries, knowledge bases, system integration, and human escalation.",
          icon: "workflow",
          items: [
            "Support",
            "Internal queries",
            "Knowledge bases",
            "Escalation",
          ],
        },
        {
          title: "Intelligent automation",
          description:
            "Email processing, information classification, report generation, operational tasks, and event-driven integrations.",
          icon: "rocket",
          items: ["Email", "Reports", "Events", "Integrations"],
        },
        {
          title: "Real-time dashboards and data",
          description:
            "WebSockets, metrics, alerts, operational visualization, event processing, and real-time updates.",
          icon: "database",
          items: ["WebSockets", "Metrics", "Alerts", "Events"],
        },
      ],
    },
    stack: {
      eyebrow: "Technology stack",
      title: "Tools organized by layer, without artificial proficiency percentages.",
      description:
        "Technology is selected based on the product, team, costs, security, scalability, and operational needs.",
      categories: [
        {
          title: "Languages",
          items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML", "CSS"],
        },
        {
          title: "Frontend",
          items: [
            "React",
            "Next.js",
            "Angular",
            "Tailwind CSS",
            "Responsive design",
            "Accessibility",
            "State management",
            "API integration",
            "Server-side rendering",
            "Static generation",
          ],
        },
        {
          title: "Backend",
          items: [
            "Node.js",
            "NestJS",
            "Express",
            "Fastify",
            "Django",
            "Flask",
            "REST APIs",
            "WebSockets",
            "Webhooks",
            "Hono",
            "Zod",
            "Async processing",
            "Events",
            "Microservices",
            "Serverless",
          ],
        },
        {
          title: "Artificial intelligence",
          items: [
            "LLM-based agents",
            "Chatbots",
            "Tool calling",
            "RAG",
            "Intelligent automation",
            "Document processing",
            "Validation and guardrails",
            "AI-assisted dashboards",
          ],
        },
        {
          title: "AWS",
          items: [
            "AWS Lambda",
            "EC2",
            "RDS",
            "S3",
            "SES",
            "API Gateway",
            "SQS",
            "CloudWatch",
            "Cognito",
            "ECS",
            "CloudFront",
            "Serverless",
            "Infrastructure as code",
          ],
        },
        {
          title: "Microsoft Azure",
          items: [
            "Azure Functions",
            "App Service",
            "Azure DevOps",
            "Azure SQL",
            "Blob Storage",
            "Key Vault",
            "CI/CD pipelines",
          ],
        },
        {
          title: "Google Cloud",
          items: [
            "Cloud Functions",
            "Compute Engine",
            "Cloud Run",
            "Firestore",
            "Firebase",
            "Cloud Storage",
            "Pub/Sub",
            "Serverless",
          ],
        },
        {
          title: "Cloudflare",
          items: [
            "Cloudflare Workers",
            "Cloudflare Pages",
            "Cloudflare D1",
            "Wrangler",
            "Edge runtime",
            "Bindings",
            "Environment variables",
            "Serverless deployment",
          ],
        },
        {
          title: "Managed platforms",
          items: [
            "Vercel",
            "Supabase",
            "Firebase",
            "Clerk",
            "Cloudinary",
            "Preview deployments",
            "Authentication",
            "Databases",
            "Storage",
            "Edge functions",
          ],
        },
        {
          title: "Databases and data",
          items: [
            "PostgreSQL",
            "MySQL",
            "MongoDB",
            "Firestore",
            "Supabase",
            "Redis",
            "SQLite",
            "Cloudflare D1",
            "Drizzle ORM",
            "Amazon RDS",
            "Azure SQL",
            "Parquet",
            "Migrations",
            "Indexes",
            "Backups",
            "Dataset processing",
          ],
        },
        {
          title: "Integrations and payments",
          items: [
            "Stripe",
            "Stripe Checkout",
            "Resend",
            "Cloudinary",
            "Clerk",
            "Payments",
            "Subscriptions",
            "Refunds",
            "Webhooks",
            "Transactional email",
            "External APIs",
          ],
        },
        {
          title: "DevOps and engineering",
          items: [
            "Docker",
            "Kubernetes",
            "Terraform",
            "GitHub Actions",
            "Wrangler",
            "pnpm workspace",
            "Azure DevOps",
            "CI/CD",
            "Unit tests",
            "Integration tests",
            "Monitoring",
            "Logging",
            "Security",
            "Secret management",
            "Performance",
          ],
        },
      ],
    },
    cloud: {
      eyebrow: "Multicloud",
      title: "Cloud solutions without vendor tunnel vision.",
      description:
        "Not every project needs several clouds at once. Architecture is defined by context, costs, and operational needs.",
      platforms: ["AWS", "Microsoft Azure", "Google Cloud", "Cloudflare", "Vercel", "Supabase"],
      factors: [
        "Product requirements",
        "Costs",
        "Scalability",
        "Development speed",
        "Security",
        "Integrations",
        "Team experience",
        "Operational needs",
      ],
    },
    process: {
      eyebrow: "Process",
      title: "A clear workflow for moving from uncertainty to progressive delivery.",
      description:
        "The work combines discovery, technical decisions, frequent communication, and post-deployment maintenance.",
      steps: [
        {
          title: "Discovery",
          description:
            "Alignment on goals, users, constraints, existing systems, and initial risks.",
        },
        {
          title: "Scope definition",
          description:
            "Prioritization of deliverables, phases, acceptance criteria, and dependencies.",
        },
        {
          title: "Technical design",
          description:
            "Architecture, data model, integrations, security, deployment, and observability.",
        },
        {
          title: "Iterative development",
          description:
            "Implementation in reviewable increments with frequent communication.",
        },
        {
          title: "Testing and deployment",
          description:
            "Functional validation, accessibility, performance, and controlled release.",
        },
        {
          title: "Maintenance and evolution",
          description:
            "Fixes, improvements, monitoring, new features, and optimization.",
        },
      ],
    },
    differentiators: {
      eyebrow: "Differentiators",
      title: "More than writing code: building systems that can be sustained.",
      items: [
        "Full view of frontend, backend, data, and infrastructure to reduce friction between layers.",
        "Experience with financial products and payment flows where reliability and traceability matter.",
        "Ability to work with AWS, Azure, Google Cloud, and managed platforms depending on the case.",
        "Automation and artificial intelligence integrated into real processes, with validation and supervision.",
        "Maintainability focus: readable code, clear responsibilities, tests, monitoring, and reproducible deployments.",
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's discuss your idea.",
      description:
        "Share the essential context and the request will be stored securely for follow-up.",
      fields: {
        name: "Name",
        company: "Company",
        email: "Email",
        projectType: "Project type",
        message: "Message",
        preferredLanguage: "Preferred language",
        consent:
          "I agree that the submitted information may be used to respond to this request.",
        website: "Website",
      },
      placeholders: {
        name: "Your name",
        company: "Company or team",
        email: "you@company.com",
        message: "Tell me what you need to build, improve, or maintain.",
      },
      projectTypes: [
        "Complete application",
        "Backend or API",
        "Frontend",
        "Cloud or DevOps",
        "Artificial intelligence",
        "Maintenance",
        "Consulting",
        "Other",
      ],
      languageOptions: { es: "Spanish", en: "English" },
      submit: "Request an assessment",
      whatsappCta: "Contact on WhatsApp",
      sending: "Sending request...",
      success: "Request received. Thanks for sharing the context.",
      error: "The request could not be sent. Please try again in a few minutes.",
      privacy:
        "The information is used only to respond to your request. Do not include secrets, keys, or sensitive data in the message.",
      validation: {
        required: "This field is required.",
        email: "Enter a valid email address.",
        message: "Include at least 20 characters so the context is clear.",
        consent: "You must accept the processing of the submitted information.",
      },
    },
    footer: {
      specialties: [
        "Web apps",
        "APIs",
        "Cloud",
        "Payments",
        "Applied AI",
        "DevOps",
      ],
      rights: "All rights reserved.",
      remote: "Available for remote and international projects.",
      privacyLabel: "Privacy policy",
    },
  },
} as const satisfies Record<Locale, LandingContent>;
