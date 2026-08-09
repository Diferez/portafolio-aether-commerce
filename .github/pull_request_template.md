## Checklist pre-merge

- [ ] PR apunta a `develop` para pruebas o a `main` solo desde una rama ya validada.
- [ ] `npm run lint` pasa localmente o en CI.
- [ ] `npm test` pasa localmente o en CI.
- [ ] Si cambia integración con la tienda, actualicé `NEXT_PUBLIC_STORE_URL` y `NEXT_PUBLIC_AETHER_API_URL` en el environment correcto.
- [ ] Revisé el despliegue de desarrollo antes de mergear a `main`.
