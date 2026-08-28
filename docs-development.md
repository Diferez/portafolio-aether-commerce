# Ambiente de desarrollo del portafolio

`main` representa producción. Usa `develop` para validar cambios antes de promoverlos.

## Flujo recomendado

1. Crea una rama de feature desde `develop`.
2. Abre PR contra `develop`.
3. CI ejecuta lint, build y tests.
4. Al mergear en `develop`, GitHub Actions despliega el Worker de desarrollo.
5. Revisa el sitio de desarrollo.
6. Abre PR de `develop` a `main` para producción.

## URLs esperadas

- Desarrollo: `https://portafolio-aether-commerce-dev.pickofwow.workers.dev`
- Producción: `https://diferez.com` (también disponible en `https://www.diferez.com`)

## GitHub Environment `development`

Variables:

- `CLOUDFLARE_DEPLOY_ENABLED=true`
- `PORTFOLIO_WORKER_NAME=portafolio-aether-commerce-dev`
- `NEXT_PUBLIC_SITE_URL=https://portafolio-aether-commerce-dev.pickofwow.workers.dev`
- `NEXT_PUBLIC_STORE_URL=https://aether-storefront-dev.pickofwow.workers.dev`
- `NEXT_PUBLIC_AETHER_API_URL=https://aether-api-dev.pickofwow.workers.dev`
- `AETHER_API_ORIGIN=https://aether-api-dev.pickofwow.workers.dev`

Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Mantén estos valores separados del environment `production`.
