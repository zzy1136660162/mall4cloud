# Repository Guidelines

## Project Structure & Module Organization

This repository is a Mall4Cloud monorepo. Backend services are Maven modules at the root, including `mall4cloud-gateway`, `mall4cloud-auth`, `mall4cloud-platform`, `mall4cloud-product`, `mall4cloud-order`, `mall4cloud-user`, and shared libraries under `mall4cloud-common` and `mall4cloud-api`. Java source follows `src/main/java`, MyBatis mappers and SQL resources live in `src/main/resources`, and tests should be placed in each module under `src/test/java`.

Frontend apps are under `front-end/`. The active mini-program app is `front-end/mall4cloud-uniapp`, with pages and components in `src/`. Admin and merchant frontends are under `front-end/mall4cloud-platform*` and `front-end/mall4cloud-multishop*`. Database and deployment support files are in `db/`, `doc/`, `es/`, and `scripts/`.

## Build, Test, and Development Commands

Backend requires Java 17 and Maven:

- `mvn test`: run all backend module tests.
- `mvn -pl mall4cloud-platform -am test`: test one service and required dependencies.
- `mvn -DskipTests package`: build backend artifacts without running tests.

Uni-app frontend commands run from `front-end/mall4cloud-uniapp` and require pnpm:

- `pnpm install`: install frontend dependencies.
- `pnpm dev:mp-weixin`: run WeChat mini-program development build.
- `pnpm build:mp-weixin`: produce WeChat mini-program build output.
- `pnpm lint`: lint Vue and JavaScript files in `src/`.

## Coding Style & Naming Conventions

Use 4-space indentation for Java and keep package structure aligned with existing modules: `controller`, `service`, `mapper`, `model`, `dto`, and `vo`. Controller paths follow existing auth conventions: public app endpoints generally include `/ua/`; authenticated app endpoints use `/a/` or service-specific paths.

For Vue and JavaScript, follow the existing ESLint Standard style: no semicolons, single quotes, and component/page files named in kebab-case or existing route style.

## Testing Guidelines

Add backend tests beside the changed module in `src/test/java`, using `*Test` naming. Prefer focused service or controller tests for business logic and route/auth changes. For frontend changes, run `pnpm lint` and manually verify the target H5 or mini-program page, especially layout-sensitive pages.

## Commit & Pull Request Guidelines

Recent history uses short Chinese summaries and merge commits. Keep commit subjects concise and action-oriented, for example `修复小程序商品列表布局` or `优化人才库免登录接口`. Pull requests should describe the affected module, user-visible behavior, verification commands, and include screenshots for mini-program or admin UI changes. Link related issues or deployment notes when backend routes, database scripts, or configuration are changed.

## Security & Configuration Tips

Do not commit secrets, tokens, generated build output, or local environment files. When exposing unauthenticated APIs, prefer the established `/ua/` route pattern instead of broad security whitelist changes.
