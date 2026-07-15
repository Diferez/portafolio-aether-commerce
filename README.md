# Full Stack Portfolio Landing

Landing page bilingüe para un Software Engineer Full Stack. Incluye rutas en español e inglés, contenido editable, SEO localizado, formulario de contacto del lado servidor y pruebas básicas.

## Requisitos

- Node.js 22.13 o superior.
- npm.

## Instalación

```bash
npm install
npm run dev
```

La página principal redirige al idioma detectado por navegador mediante `Accept-Language` y guarda la preferencia manual del visitante.

## Configuración

Copia `.env.example` a `.env.local` y ajusta los valores:

- `NEXT_PUBLIC_SITE_URL`: URL pública usada para canonical, sitemap y Open Graph.
- `NEXT_PUBLIC_BRAND_NAME`: marca profesional visible.
- `NEXT_PUBLIC_STORE_URL`: enlace opcional de la tienda demo. Si queda vacío, la interfaz muestra un estado de próximamente.
- `CONTACT_RECIPIENT_EMAIL`: correo receptor, solo disponible en servidor.
- `CONTACT_DELIVERY_PROVIDER`: proveedor o flujo que se conectará al endpoint de contacto.

No coloques correos privados, teléfonos o datos sensibles en componentes, HTML, archivos públicos o variables `NEXT_PUBLIC`.

## Estructura

- `app/[locale]`: rutas localizadas.
- `components/sections`: secciones principales de la landing.
- `components/ui`: componentes visuales reutilizables.
- `content`: textos, experiencia, servicios, stack y casos de estudio.
- `config`: marca, URL pública y enlaces configurables.
- `i18n`: locales y cookie de preferencia.
- `lib`: utilidades de validación y sanitización.
- `tests`: pruebas automáticas.

## Cambiar contenido

Edita `content/site-content.ts`. Mantén los proyectos confidenciales con nombres genéricos y no agregues enlaces de demo o repositorio si no existen.

## Contacto

El endpoint `app/api/contact/route.ts` valida datos, sanitiza entradas, usa honeypot antispam y aplica limitación básica de frecuencia en memoria. La función `queueContactRequest` queda preparada para conectar un proveedor de correo, una cola o una función serverless.

## SEO

La app genera:

- Metadatos localizados.
- Canonical por idioma.
- `hreflang`.
- Open Graph y Twitter Card.
- `sitemap.xml`.
- `robots.txt`.
- JSON-LD de servicio profesional.

## Despliegue

El proyecto está listo para Vercel o para el flujo de hosting configurado en `.openai/hosting.json`. Antes de publicar, actualiza `NEXT_PUBLIC_SITE_URL` con el dominio final.

## Pruebas

```bash
npm test
```

Las pruebas compilan el sitio y revisan renderizado bilingüe, detección de idioma, formulario, enlaces, accesibilidad básica y ausencia de cadenas privadas en código y build.

## Capturas sugeridas para perfiles freelance

- Hero en escritorio mostrando el diagrama de arquitectura.
- Sección de servicios con tres filas visibles.
- Línea de tiempo profesional.
- Casos de estudio.
- Formulario de contacto en móvil.
