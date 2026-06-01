// Privacy policy content (bilingual). Sensible defaults for review — replace
// the [bracketed] legal specifics (entity, address) and the retention period
// with your real values. Kept out of next-intl messages to avoid bloating the
// client bundle; this is a static server-rendered page.

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const en: LegalDoc = {
  title: "Privacy Policy",
  updated: "Last updated: 1 June 2026",
  intro:
    'Valora Group ("we", "us") helps businesses worldwide solve problems with AI. This policy explains what we collect through this website, how we use it, and your choices. Questions? Email hello@valoragroup.ai.',
  sections: [
    {
      heading: "Information we collect",
      body: [
        "Contact form — when you reach out, we collect your name, email address, optional company name, and your message.",
        "AI assistant — messages you send to the on-site assistant are processed to generate a reply. Please don't share sensitive personal information in the chat.",
        "We don't use advertising or analytics tracking. The only cookie we set remembers your language preference.",
      ],
    },
    {
      heading: "How we use your information",
      body: [
        "To respond to your inquiry, deliver our services, and operate the assistant.",
        "We do not sell your personal information or share it for advertising.",
      ],
    },
    {
      heading: "Service providers",
      body: [
        "We rely on a few trusted providers that process data on our behalf, each under their own security and privacy commitments:",
        "Vercel (website hosting), Supabase (secure storage of contact submissions), Resend (email delivery), Anthropic (AI assistant responses), Cloudflare (bot protection), and Upstash (abuse rate-limiting).",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "We keep contact submissions for up to 24 months so we can follow up, then delete them. Emails remain in our inbox under our normal retention.",
        "You can ask us to delete your data at any time — see Your rights.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Depending on where you live (including under the EU GDPR and California CCPA), you may have the right to access, correct, delete, port, or object to the processing of your personal information, and to withdraw consent.",
        "To exercise any of these, email hello@valoragroup.ai and we'll respond within a reasonable time.",
      ],
    },
    {
      heading: "International transfers",
      body: [
        "Our providers may process data in the United States and other countries. Where required, appropriate safeguards (such as standard contractual clauses) are in place.",
      ],
    },
    {
      heading: "Security",
      body: [
        "Data is encrypted in transit (TLS) and at rest with our providers, and contact records are stored in a database locked down so only our server can access them. No method is 100% secure, but we take reasonable measures to protect your information.",
      ],
    },
    {
      heading: "Children",
      body: ["This website is intended for businesses and is not directed to children."],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this policy from time to time. The current version will always be posted here with an updated date.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Valora Group — [registered legal entity and address]. Email: hello@valoragroup.ai.",
      ],
    },
  ],
};

const es: LegalDoc = {
  title: "Política de Privacidad",
  updated: "Última actualización: 1 de junio de 2026",
  intro:
    'Valora Group ("nosotros") ayuda a negocios de todo el mundo a resolver problemas con IA. Esta política explica qué información recopilamos en este sitio, cómo la usamos y tus opciones. ¿Dudas? Escríbenos a hello@valoragroup.ai.',
  sections: [
    {
      heading: "Información que recopilamos",
      body: [
        "Formulario de contacto — cuando nos escribes, recopilamos tu nombre, correo electrónico, nombre de empresa (opcional) y tu mensaje.",
        "Asistente de IA — los mensajes que envías al asistente del sitio se procesan para generar una respuesta. Por favor, no compartas información personal sensible en el chat.",
        "No usamos seguimiento publicitario ni de analítica. La única cookie que guardamos recuerda tu preferencia de idioma.",
      ],
    },
    {
      heading: "Cómo usamos tu información",
      body: [
        "Para responder a tu consulta, prestar nuestros servicios y operar el asistente.",
        "No vendemos tu información personal ni la compartimos con fines publicitarios.",
      ],
    },
    {
      heading: "Proveedores de servicio",
      body: [
        "Nos apoyamos en algunos proveedores de confianza que procesan datos en nuestro nombre, cada uno bajo sus propios compromisos de seguridad y privacidad:",
        "Vercel (alojamiento del sitio), Supabase (almacenamiento seguro de los envíos de contacto), Resend (envío de correo), Anthropic (respuestas del asistente de IA), Cloudflare (protección contra bots) y Upstash (límite de abuso).",
      ],
    },
    {
      heading: "Conservación de datos",
      body: [
        "Conservamos los envíos de contacto hasta 24 meses para poder dar seguimiento, y luego los eliminamos. Los correos permanecen en nuestra bandeja según nuestra conservación habitual.",
        "Puedes pedirnos que eliminemos tus datos en cualquier momento — consulta Tus derechos.",
      ],
    },
    {
      heading: "Tus derechos",
      body: [
        "Según dónde vivas (incluidos el RGPD de la UE y la CCPA de California), puedes tener derecho a acceder, corregir, eliminar, portar u oponerte al tratamiento de tu información personal, y a retirar tu consentimiento.",
        "Para ejercer cualquiera de estos, escríbenos a hello@valoragroup.ai y responderemos en un plazo razonable.",
      ],
    },
    {
      heading: "Transferencias internacionales",
      body: [
        "Nuestros proveedores pueden procesar datos en Estados Unidos y otros países. Cuando es necesario, existen salvaguardas adecuadas (como cláusulas contractuales tipo).",
      ],
    },
    {
      heading: "Seguridad",
      body: [
        "Los datos se cifran en tránsito (TLS) y en reposo con nuestros proveedores, y los registros de contacto se guardan en una base de datos restringida para que solo nuestro servidor pueda acceder. Ningún método es 100% seguro, pero tomamos medidas razonables para proteger tu información.",
      ],
    },
    {
      heading: "Menores",
      body: ["Este sitio está dirigido a negocios y no a menores de edad."],
    },
    {
      heading: "Cambios en esta política",
      body: [
        "Podemos actualizar esta política de vez en cuando. La versión vigente siempre estará publicada aquí con su fecha de actualización.",
      ],
    },
    {
      heading: "Contacto",
      body: [
        "Valora Group — [entidad legal registrada y dirección]. Correo: hello@valoragroup.ai.",
      ],
    },
  ],
};

export function getPrivacy(locale: string): LegalDoc {
  return locale === "es" ? es : en;
}
