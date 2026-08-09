# Portafolio de Diego Fernando Martínez

Sitio bilingüe e independiente para presentar experiencia, servicios y casos de estudio. La tienda Aether vive en su propio repositorio y despliegue; ambos sitios se enlazan mediante URLs públicas configurables.

## Desarrollo local

Requiere Node.js 22.13 o superior.

```bash
npm ci
npm run dev
```

Copia `.env.example` como `.env.local` cuando necesites sobrescribir la configuración.

## Configuración

- `NEXT_PUBLIC_SITE_URL`: URL pública del portafolio, usada por canonical, sitemap y Open Graph.
- `NEXT_PUBLIC_BRAND_NAME`: nombre profesional visible.
- `NEXT_PUBLIC_STORE_URL`: URL absoluta del despliegue independiente de Aether.
- `NEXT_PUBLIC_AETHER_API_URL`: URL pública del Worker API de Aether.
- `AETHER_API_ORIGIN`: origen server-side del mismo API; el formulario envía a `/api/v1/contact` para persistir solicitudes en D1.

No incluyas datos privados en variables `NEXT_PUBLIC_*`.

## Estructura

- `app/[locale]`: páginas localizadas.
- `components/sections`: secciones de la landing.
- `content`: textos y casos de estudio editables.
- `config`: marca y enlaces entre portafolio y tienda.
- `i18n`: idiomas y preferencia del visitante.
- `worker`: entrada del Worker de Cloudflare.
- `tests`: validación de renderizado, accesibilidad y privacidad.

## Validación

```bash
npm run lint
npm test
```

`npm test` genera el build de producción y ejecuta las pruebas del portafolio. No instala ni compila la tienda.

## Despliegue

El portafolio se publica de forma independiente. El repositorio conserva `.openai/hosting.json` para el despliegue administrado por Sites y también incluye un workflow opcional para el Worker público existente de Cloudflare.

Variables del environment `production` en GitHub:

- `CLOUDFLARE_DEPLOY_ENABLED=true`
- `PORTFOLIO_WORKER_NAME=portafolio-aether-commerce`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STORE_URL`
- `NEXT_PUBLIC_AETHER_API_URL`
- `AETHER_API_ORIGIN`

Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

La tienda debe configurar `NEXT_PUBLIC_PORTFOLIO_URL` con la URL de este sitio. El portafolio debe configurar `NEXT_PUBLIC_STORE_URL` con la URL de la tienda; esa relación bidireccional es el único acoplamiento entre repositorios.
