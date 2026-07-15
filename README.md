# Diego Fernando Martinez Portfolio Landing

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
- `NEXT_PUBLIC_STORE_URL`: ruta pública de la tienda; para Cloudflare usa `/store`.
- `NEXT_PUBLIC_AETHER_API_URL`: URL pública del Worker API de Aether.
- `CONTACT_RECIPIENT_EMAIL`: correo receptor, solo disponible en servidor.
- `CONTACT_DELIVERY_PROVIDER`: usa `formsubmit` para enviar las solicitudes al correo configurado.

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

El endpoint `app/api/contact/route.ts` valida datos, sanitiza entradas, usa honeypot antispam y aplica limitación básica de frecuencia en memoria. Con `CONTACT_DELIVERY_PROVIDER=formsubmit`, el servidor reenvía la solicitud al correo de `CONTACT_RECIPIENT_EMAIL` sin exponerlo en el navegador.

## SEO

La app genera:

- Metadatos localizados.
- Canonical por idioma.
- `hreflang`.
- Open Graph y Twitter Card.
- `sitemap.xml`.
- `robots.txt`.
- JSON-LD de servicio profesional.

## Despliegue en Cloudflare

El front se publica como un solo sitio: el portafolio vive en `/` y la tienda
Aether vive en `/store`.

Antes de publicar, configura:

- `NEXT_PUBLIC_SITE_URL`: dominio final del portafolio en Cloudflare.
- `NEXT_PUBLIC_STORE_URL=/store`.
- `NEXT_PUBLIC_AETHER_API_URL`: URL del Worker API de Aether.
- `CONTACT_RECIPIENT_EMAIL`: correo receptor del formulario.
- `CONTACT_DELIVERY_PROVIDER=formsubmit`.

El build principal ejecuta el portafolio y la tienda juntos:

```bash
npm run build
```

Para un build limpio en Cloudflare, instala dependencias del portafolio y de
Aether antes de construir:

```bash
npm ci
cd aether-commerce && corepack enable && pnpm install --frozen-lockfile
cd ..
npm run build
```

`AETHER_STOREFRONT_ORIGIN` es opcional. Solo se usa como respaldo si decides
desplegar la tienda como Pages separado; el flujo recomendado no lo necesita.

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
