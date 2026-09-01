import type { Locale } from "@/i18n/config";

export const privacyVersion = "2026-09-01";

export type LegalDocumentKey = "privacy" | "cookies" | "terms";

type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type LegalDocument = {
  key: LegalDocumentKey;
  title: string;
  description: string;
  updatedLabel: string;
  updatedAt: string;
  sections: readonly LegalSection[];
};

export const legalPaths: Record<Locale, Record<LegalDocumentKey, string>> = {
  es: {
    privacy: "privacidad",
    cookies: "cookies",
    terms: "terminos",
  },
  en: {
    privacy: "privacy",
    cookies: "cookies",
    terms: "terms",
  },
};

export function legalHref(locale: Locale, key: LegalDocumentKey) {
  return `/${locale}/legal/${legalPaths[locale][key]}`;
}

export function legalKeyFromSlug(locale: Locale, slug: string) {
  return (Object.entries(legalPaths[locale]) as Array<[LegalDocumentKey, string]>).find(
    ([, path]) => path === slug,
  )?.[0];
}

export const legalUi = {
  es: {
    home: "Volver al portafolio",
    navigation: "Documentos legales",
    language: "English",
    privacy: "Privacidad",
    cookies: "Cookies",
    terms: "Términos",
    noticeTitle: "Cookie funcional",
    noticeBody:
      "Este sitio usa únicamente una cookie necesaria para recordar el idioma. No usa cookies de publicidad, analítica ni seguimiento.",
    noticeAction: "Entendido",
    noticeLink: "Ver política de cookies",
  },
  en: {
    home: "Back to portfolio",
    navigation: "Legal documents",
    language: "Español",
    privacy: "Privacy",
    cookies: "Cookies",
    terms: "Terms",
    noticeTitle: "Functional cookie",
    noticeBody:
      "This site only uses a necessary cookie to remember your language. It does not use advertising, analytics, or tracking cookies.",
    noticeAction: "Got it",
    noticeLink: "View cookie policy",
  },
} as const;

export const legalContent: Record<Locale, Record<LegalDocumentKey, LegalDocument>> = {
  es: {
    privacy: {
      key: "privacy",
      title: "Política de privacidad y tratamiento de datos",
      description:
        "Explica qué datos recoge este portafolio, para qué se usan, durante cuánto tiempo se conservan y cómo ejercer tus derechos.",
      updatedLabel: "Última actualización",
      updatedAt: "1 de septiembre de 2026",
      sections: [
        {
          title: "1. Responsable y alcance",
          paragraphs: [
            "El responsable del tratamiento es Diego Fernando Martinez, profesional independiente. Domicilio y dirección: Carrera 73 # 20A-40, Medellín, Antioquia, Colombia. Correo electrónico: diferez676@gmail.com. Teléfono: +57 304 274 9571. Esta política aplica al portafolio y a sus canales directos de contacto.",
            "Puedes comunicar una consulta de privacidad por correo a diferez676@gmail.com o por teléfono al +57 304 274 9571.",
          ],
        },
        {
          title: "2. Datos que se tratan",
          items: [
            "Datos que compartas voluntariamente por correo o teléfono, como nombre, correo electrónico, empresa, contexto de la solicitud y cualquier información que incluyas.",
            "Preferencia de idioma: una cookie propia llamada portfolio_locale y el registro local de que cerraste el aviso de cookies.",
          ],
        },
        {
          title: "3. Finalidades y bases",
          items: [
            "Responder la solicitud, evaluar una posible colaboración y mantener el contexto de la conversación.",
            "Atender obligaciones legales o reclamaciones cuando corresponda.",
            "El tratamiento de la información que envíes por canales directos se basa en tu autorización y en el interés legítimo de responder y proteger el servicio. No se usan los datos para publicidad, listas de correo, perfiles ni decisiones automatizadas.",
          ],
        },
        {
          title: "4. Encargados y tratamiento internacional",
          paragraphs: [
            "El sitio utiliza infraestructura de Cloudflare para alojamiento y seguridad. Los mensajes enviados por correo también pueden ser procesados por el proveedor de correo correspondiente para entregarlos y almacenarlos. Estos proveedores pueden procesar información fuera de Colombia bajo sus propias medidas y compromisos de seguridad.",
            "No se venden datos personales ni se comparten con terceros para fines publicitarios. Solo se comunican cuando es necesario para prestar el servicio, cumplir la ley o proteger derechos.",
          ],
        },
        {
          title: "5. Conservación",
          paragraphs: [
            "La información recibida por canales directos se conserva solo durante el tiempo necesario para responder y atender obligaciones legales, salvo que deba mantenerse por más tiempo para resolver una disputa o ejercer derechos. Luego se elimina o anonimiza razonablemente.",
          ],
        },
        {
          title: "6. Tus derechos",
          items: [
            "Conocer, acceder, actualizar y rectificar tus datos.",
            "Solicitar prueba de la autorización, conocer el uso realizado, revocarla y pedir la supresión cuando proceda.",
            "Oponerte o solicitar limitación del tratamiento cuando resulte aplicable.",
            "Presentar una queja ante la Superintendencia de Industria y Comercio después de agotar el trámite directo cuando así lo exija la normativa colombiana.",
          ],
          paragraphs: [
            "Para ejercer estos derechos, usa el canal indicado en la sección 1 e identifica tu solicitud, el derecho que deseas ejercer y la información necesaria para verificar tu identidad. Las consultas se atienden dentro de los plazos legales aplicables; en Colombia, hasta 10 días hábiles para consultas y 15 días hábiles para reclamos, con las ampliaciones permitidas por la ley.",
          ],
        },
        {
          title: "7. Datos sensibles y menores",
          paragraphs: [
            "No envíes datos sensibles, financieros, credenciales, secretos ni documentos de identidad por los canales de contacto. El sitio no está dirigido a menores de edad ni pretende recopilar sus datos.",
          ],
        },
        {
          title: "8. Seguridad y cambios",
          paragraphs: [
            "Se aplican minimización, control de acceso y transporte cifrado cuando corresponde. Ningún sistema es infalible; si se identifica un incidente relevante se actuará conforme a las obligaciones aplicables.",
            "Los cambios sustanciales se publicarán en esta página con una nueva fecha de actualización.",
          ],
        },
      ],
    },
    cookies: {
      key: "cookies",
      title: "Política de cookies",
      description:
        "Detalle de la única cookie funcional y del almacenamiento local utilizado por este portafolio.",
      updatedLabel: "Última actualización",
      updatedAt: "12 de agosto de 2026",
      sections: [
        {
          title: "1. Uso actual",
          paragraphs: [
            "Este portafolio no usa cookies de publicidad, analítica, medición de audiencia ni seguimiento entre sitios. Solo guarda una preferencia necesaria para ofrecer la versión de idioma solicitada.",
          ],
        },
        {
          title: "2. Cookie propia",
          items: [
            "portfolio_locale — finalidad: recordar si elegiste español o inglés; proveedor: este sitio; duración máxima: 12 meses; tipo: funcional y propia; SameSite: Lax.",
          ],
        },
        {
          title: "3. Almacenamiento local",
          paragraphs: [
            "El navegador guarda localmente la clave portfolio_cookie_notice_v1 para recordar que cerraste el aviso informativo. No contiene identidad, correo ni historial de navegación y permanece hasta que borres los datos del sitio.",
          ],
        },
        {
          title: "4. Gestión",
          paragraphs: [
            "Puedes borrar o bloquear la cookie y el almacenamiento local desde la configuración de tu navegador. Si eliminas portfolio_locale, el sitio volverá a elegir el idioma según tu navegador o la ruta visitada.",
            "Los enlaces a GitHub, LinkedIn, WhatsApp, Aether Commerce u otros servicios abren sitios externos que aplican sus propias políticas y pueden usar sus propias cookies después de que los visites.",
          ],
        },
        {
          title: "5. Cambios futuros",
          paragraphs: [
            "Si se añaden cookies no esenciales, esta política y el aviso se actualizarán y esas tecnologías no se activarán antes de obtener el consentimiento exigible.",
          ],
        },
      ],
    },
    terms: {
      key: "terms",
      title: "Términos de uso",
      description: "Condiciones aplicables al acceso y uso de este portafolio profesional.",
      updatedLabel: "Última actualización",
      updatedAt: "12 de agosto de 2026",
      sections: [
        {
          title: "1. Finalidad del sitio",
          paragraphs: [
            "Este sitio presenta experiencia, capacidades y proyectos de Diego Fernando Martinez. Su contenido es informativo y no constituye asesoría profesional, oferta vinculante ni garantía de disponibilidad.",
          ],
        },
        {
          title: "2. Propiedad intelectual",
          paragraphs: [
            "Salvo que se indique lo contrario, el diseño, los textos y los materiales originales del portafolio pertenecen a Diego Fernando Martinez y están protegidos por las normas aplicables. Puedes enlazar el sitio y citar fragmentos breves con atribución; no puedes copiar, revender, suplantar autoría ni explotar sustancialmente el contenido sin autorización.",
            "Las marcas, logotipos y nombres de tecnologías o terceros pertenecen a sus respectivos titulares y se mencionan únicamente para describir experiencia o interoperabilidad.",
          ],
        },
        {
          title: "3. Casos profesionales y confidencialidad",
          paragraphs: [
            "Los casos privados se describen de forma general para proteger identidades, información interna y obligaciones de confidencialidad. No debes interpretar esas descripciones como autorización para inferir, identificar o divulgar clientes, sistemas o datos reservados.",
          ],
        },
        {
          title: "4. Enlaces externos",
          paragraphs: [
            "Los enlaces externos se ofrecen como referencia. Cada tercero controla su contenido, disponibilidad, seguridad y políticas; su inclusión no implica patrocinio ni responsabilidad sobre esos servicios.",
          ],
        },
        {
          title: "5. Uso permitido",
          items: [
            "No interferir con el funcionamiento, seguridad o disponibilidad del sitio.",
            "No intentar acceder sin autorización, introducir código malicioso, automatizar solicitudes abusivas ni enviar spam a los canales directos.",
            "No enviar datos sensibles, secretos, credenciales ni contenido ilícito o que vulnere derechos de terceros.",
          ],
        },
        {
          title: "6. Contacto y contratación",
          paragraphs: [
            "Enviar un correo o iniciar una conversación no crea una relación contractual, laboral, fiduciaria ni de exclusividad. Cualquier servicio profesional requerirá alcance, condiciones y aceptación por separado.",
          ],
        },
        {
          title: "7. Disponibilidad y responsabilidad",
          paragraphs: [
            "Se procura mantener información correcta y el sitio disponible, pero puede haber errores, interrupciones o cambios. En la medida permitida por la ley, no se asume responsabilidad por decisiones tomadas exclusivamente con base en contenido informativo ni por actos de servicios externos.",
          ],
        },
        {
          title: "8. Ley aplicable y cambios",
          paragraphs: [
            "Estos términos se interpretan conforme a la ley colombiana, sin limitar derechos imperativos que correspondan al visitante. Las controversias se someterán a las autoridades competentes según las reglas aplicables.",
            "Los términos pueden actualizarse para reflejar cambios funcionales o legales. La versión vigente es la publicada en esta página.",
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      key: "privacy",
      title: "Privacy and personal data policy",
      description:
        "Explains what data this portfolio collects, why it is used, how long it is retained, and how to exercise your rights.",
      updatedLabel: "Last updated",
      updatedAt: "September 1, 2026",
      sections: [
        {
          title: "1. Controller and scope",
          paragraphs: [
            "The data controller is Diego Fernando Martinez, an independent professional. Registered address: Carrera 73 # 20A-40, Medellín, Antioquia, Colombia. Email: diferez676@gmail.com. Phone: +57 304 274 9571. This policy applies to the portfolio and its direct contact channels.",
            "You may submit a privacy request by email at diferez676@gmail.com or by phone at +57 304 274 9571.",
          ],
        },
        {
          title: "2. Data processed",
          items: [
            "Data you voluntarily share by email or phone, such as your name, email address, company, request context, and any information you include.",
            "Language preference: a first-party cookie named portfolio_locale and the local record that you dismissed the cookie notice.",
          ],
        },
        {
          title: "3. Purposes and legal grounds",
          items: [
            "Respond to your request, assess a potential engagement, and preserve conversation context.",
            "Address legal duties or claims where applicable.",
            "Processing information sent through direct channels relies on your authorization and the legitimate interest in responding and protecting the service. Data is not used for advertising, mailing lists, profiling, or automated decisions.",
          ],
        },
        {
          title: "4. Processors and international processing",
          paragraphs: [
            "The site uses Cloudflare infrastructure for hosting and security. Messages sent by email may also be processed by the relevant email provider to deliver and store them. These providers may process information outside Colombia under their own security measures and commitments.",
            "Personal data is not sold or shared with third parties for advertising. It is disclosed only when needed to provide the service, comply with law, or protect rights.",
          ],
        },
        {
          title: "5. Retention",
          paragraphs: [
            "Information received through direct channels is retained only as long as needed to respond and meet legal duties, unless it must be kept longer to resolve a dispute or exercise legal rights. It is then reasonably deleted or anonymized.",
          ],
        },
        {
          title: "6. Your rights",
          items: [
            "Know, access, update, and correct your personal data.",
            "Request proof of authorization, learn how data was used, withdraw authorization, and request deletion where applicable.",
            "Object to or request restriction of processing where applicable.",
            "Complain to a competent supervisory authority, including Colombia's Superintendence of Industry and Commerce where applicable.",
          ],
          paragraphs: [
            "Use the channel in section 1 and identify your request, the right you wish to exercise, and information needed to verify your identity. Requests are handled within applicable legal deadlines; where the GDPR applies, normally within one month, subject to lawful extensions.",
          ],
        },
        {
          title: "7. Sensitive data and children",
          paragraphs: [
            "Do not send sensitive or financial data, credentials, secrets, or identity documents through the contact channels. The site is not directed to children and does not intentionally collect their data.",
          ],
        },
        {
          title: "8. Security and changes",
          paragraphs: [
            "Minimization, access control, and encrypted transport where applicable are used. No system is infallible; relevant incidents will be handled under applicable obligations.",
            "Material changes will be published here with a new update date.",
          ],
        },
      ],
    },
    cookies: {
      key: "cookies",
      title: "Cookie policy",
      description:
        "Details the only functional cookie and local storage used by this portfolio.",
      updatedLabel: "Last updated",
      updatedAt: "August 12, 2026",
      sections: [
        {
          title: "1. Current use",
          paragraphs: [
            "This portfolio does not use advertising, analytics, audience measurement, or cross-site tracking cookies. It only stores a preference needed to provide the language version you request.",
          ],
        },
        {
          title: "2. First-party cookie",
          items: [
            "portfolio_locale — purpose: remember whether you selected Spanish or English; provider: this site; maximum duration: 12 months; type: functional and first-party; SameSite: Lax.",
          ],
        },
        {
          title: "3. Local storage",
          paragraphs: [
            "Your browser locally stores portfolio_cookie_notice_v1 to remember that you dismissed the information notice. It contains no identity, email, or browsing history and remains until you clear site data.",
          ],
        },
        {
          title: "4. Managing storage",
          paragraphs: [
            "You can delete or block the cookie and local storage through your browser settings. If you remove portfolio_locale, the site will choose a language again from your browser preference or the route you visit.",
            "Links to GitHub, LinkedIn, WhatsApp, Aether Commerce, or other services open external sites that apply their own policies and may use their own cookies after you visit them.",
          ],
        },
        {
          title: "5. Future changes",
          paragraphs: [
            "If non-essential cookies are added, this policy and the notice will be updated and those technologies will not be activated before any required consent is obtained.",
          ],
        },
      ],
    },
    terms: {
      key: "terms",
      title: "Terms of use",
      description: "Terms that apply when accessing and using this professional portfolio.",
      updatedLabel: "Last updated",
      updatedAt: "August 12, 2026",
      sections: [
        {
          title: "1. Site purpose",
          paragraphs: [
            "This site presents Diego Fernando Martinez's experience, capabilities, and projects. Its content is informational and is not professional advice, a binding offer, or a guarantee of availability.",
          ],
        },
        {
          title: "2. Intellectual property",
          paragraphs: [
            "Unless stated otherwise, the portfolio's design, text, and original materials belong to Diego Fernando Martinez and are protected by applicable law. You may link to the site and quote short excerpts with attribution; you may not copy, resell, misrepresent authorship, or substantially exploit the content without permission.",
            "Third-party trademarks, logos, and technology names belong to their respective owners and are mentioned only to describe experience or interoperability.",
          ],
        },
        {
          title: "3. Professional cases and confidentiality",
          paragraphs: [
            "Private cases are described at a general level to protect identities, internal information, and confidentiality duties. Those descriptions do not authorize attempts to infer, identify, or disclose clients, systems, or restricted data.",
          ],
        },
        {
          title: "4. External links",
          paragraphs: [
            "External links are provided for reference. Each third party controls its content, availability, security, and policies; inclusion does not imply sponsorship or responsibility for those services.",
          ],
        },
        {
          title: "5. Acceptable use",
          items: [
            "Do not interfere with the site's operation, security, or availability.",
            "Do not attempt unauthorized access, introduce malicious code, automate abusive requests, or send spam through direct channels.",
            "Do not submit sensitive data, secrets, credentials, unlawful material, or content that infringes third-party rights.",
          ],
        },
        {
          title: "6. Contact and engagement",
          paragraphs: [
            "Sending an email or starting a conversation does not create a contractual, employment, fiduciary, or exclusive relationship. Any professional service requires separately agreed scope and terms.",
          ],
        },
        {
          title: "7. Availability and liability",
          paragraphs: [
            "Reasonable efforts are made to keep information accurate and the site available, but errors, interruptions, or changes may occur. To the extent permitted by law, no responsibility is accepted for decisions made solely from informational content or for external services.",
          ],
        },
        {
          title: "8. Governing law and changes",
          paragraphs: [
            "These terms are interpreted under Colombian law without limiting any mandatory rights available to a visitor. Disputes are submitted to the competent authorities under applicable rules.",
            "The terms may be updated to reflect functional or legal changes. The version published on this page is the current one.",
          ],
        },
      ],
    },
  },
};
