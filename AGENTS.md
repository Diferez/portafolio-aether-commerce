# Reglas de colaboración y despliegue

## Flujo de ramas obligatorio

- `develop` es la rama de integración y validación previa a producción.
- Todo cambio debe entrar primero a `develop` mediante un Pull Request.
- Solo después de validar CI y el despliegue de desarrollo se puede abrir un Pull Request de `develop` hacia `main`.
- `main` representa producción y no debe recibir commits directos.
- No se deben crear Pull Requests de ramas de feature directamente hacia `main`.

## Protección de ramas

- `main` y `develop` deben permanecer protegidas contra borrado.
- `main` solo puede aceptar Pull Requests cuyo origen sea `develop`.
- Los cambios de configuración, infraestructura y despliegue también deben seguir el flujo `develop` → `main`.

## Limpieza de ramas

- Las ramas de feature deben eliminarse después de fusionar su Pull Request.
- Antes de borrar una rama se debe confirmar que no tenga cambios pendientes ni un Pull Request abierto.
- Las ramas `main` y `develop` nunca se eliminan.
