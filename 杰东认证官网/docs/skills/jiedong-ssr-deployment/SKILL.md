---
name: jiedong-ssr-deployment
description: Use this skill whenever deploying or maintaining the Jiedong Certification Nuxt SSR website on the 115.191.79.224 server, updating the Docker Compose service, Nginx reverse proxy, deployment artifacts, backups, verification, rollback, or syncing Nginx config back to the local mall4cloud production deployment package.
---

# Jiedong SSR Deployment

This skill captures the production deployment workflow for the Jiedong Certification Nuxt SSR homepage.

## Server Profile

- Host: `115.191.79.224`
- SSH port: `22`
- User: `root`
- Credential handling: ask the user for the password when needed. Do not write passwords into project files.
- OS: Ubuntu
- Runtime stack: Docker Compose under `/mnt/docker-services`
- Nginx: container `mall4cloud-nginx`, image `nginx:1.25-alpine`
- Website SSR service: container `jiedong-cert`, image `node:22-alpine`
- Public SSR port: `5000`
- Nginx public ports: `80`, `443`

## Key Paths

- Remote Compose file: `/mnt/docker-services/docker-compose.yaml`
- Remote Nginx config root: `/mnt/docker-services/nginx`
- Remote Nginx server config: `/mnt/docker-services/nginx/conf_d/default.conf`
- Remote Nginx main config: `/mnt/docker-services/nginx/conf/nginx.conf`
- Remote SSL directory: `/mnt/docker-services/nginx/ssl`
- Remote app directory: `/mnt/web-services/jiedong-cert`
- Local synced Compose file: `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\docker-compose.yaml`
- Local synced Nginx template directory: `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\nginx`

## Deployment Model

Use Nuxt's production SSR output, not a static export.

Build locally:

```powershell
npm run build
```

Package only the generated Nuxt server output:

```powershell
tar -czf tmp_remote_nginx\jiedong-cert-output.tar.gz .output
```

Extract remotely into:

```bash
/mnt/web-services/jiedong-cert/.output
```

The Docker Compose service runs:

```yaml
jiedong-cert:
  image: node:22-alpine
  container_name: jiedong-cert
  restart: always
  working_dir: /app
  environment:
    - NODE_ENV=production
    - HOST=0.0.0.0
    - PORT=5000
  ports:
    - "5000:5000"
  volumes:
    - /mnt/web-services/jiedong-cert:/app:ro
  command: ["node", ".output/server/index.mjs"]
```

Nginx `location /` in both the `80` and `443 ssl` server blocks proxies to:

```nginx
proxy_pass http://jiedong-cert:5000;
```

Preserve existing API/static locations such as `/we-api/`, `/agent-api/`, `/minio-api/`, `/admin-page/`, and `/public-files`.

## Required Backup Before Changes

Before changing remote files, create a timestamped backup:

```bash
stamp=$(date +%Y%m%d%H%M%S)
backup_dir=/mnt/docker-services/backups/jiedong-cert-$stamp
mkdir -p "$backup_dir"
cp -a /mnt/docker-services/docker-compose.yaml "$backup_dir/docker-compose.yaml"
cp -a /mnt/docker-services/nginx/conf_d "$backup_dir/conf_d"
cp -a /mnt/docker-services/nginx/conf "$backup_dir/conf"
```

If replacing an existing app output, move the old output aside:

```bash
stamp=$(date +%Y%m%d%H%M%S)
mkdir -p /mnt/web-services/backups
mv /mnt/web-services/jiedong-cert/.output "/mnt/web-services/backups/jiedong-cert-output-$stamp"
```

Only run the `mv` if the `.output` directory exists.

## Apply And Verify

After uploading `.output`, `docker-compose.yaml`, and `default.conf`:

```bash
cd /mnt/docker-services
docker compose config --quiet
docker compose up -d jiedong-cert
docker exec mall4cloud-nginx nginx -t
docker exec mall4cloud-nginx nginx -s reload
```

Verify all entry points:

```bash
docker ps --filter name=jiedong-cert --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sSI http://127.0.0.1:5000/ | sed -n '1,12p'
curl -sSI http://127.0.0.1/ | sed -n '1,12p'
curl -k -sSI https://127.0.0.1/ | sed -n '1,12p'
docker exec mall4cloud-nginx nginx -t
```

From the local machine, verify:

```powershell
curl.exe -sSI http://115.191.79.224:5000/
curl.exe -sSI http://115.191.79.224/
curl.exe -k -sSI https://115.191.79.224/
```

Check that the HTML contains the Jiedong SSR page title:

```powershell
curl.exe -fsS http://115.191.79.224:5000/ | Select-String -Pattern '杰东认证|医药健康产品批文批号申办服务伙伴'
```

## Rollback

If Compose or Nginx validation fails, restore the backup made before the change:

```bash
backup_dir=/mnt/docker-services/backups/jiedong-cert-YYYYMMDDHHMMSS
cp -a "$backup_dir/docker-compose.yaml" /mnt/docker-services/docker-compose.yaml
rm -rf /mnt/docker-services/nginx/conf_d
cp -a "$backup_dir/conf_d" /mnt/docker-services/nginx/conf_d
docker exec mall4cloud-nginx nginx -t
docker exec mall4cloud-nginx nginx -s reload
```

If needed, remove or stop the SSR service:

```bash
cd /mnt/docker-services
docker compose stop jiedong-cert
docker compose rm -f jiedong-cert
```

## Sync Docker Deployment Files Back Locally

After a successful deployment, sync Docker-related deployment files back to the local mall4cloud production package.

Sync the remote Compose file:

- Remote: `/mnt/docker-services/docker-compose.yaml`
- Local: `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\docker-compose.yaml`

Before overwriting the local Compose file, create a timestamped backup beside it, for example:

```powershell
docker-compose.backup-YYYYMMDDHHMMSS.yaml
```

Sync Nginx configuration directories:

- Sync remote `/mnt/docker-services/nginx/conf` to local `nginx\conf`
- Sync remote `/mnt/docker-services/nginx/conf_d` to local `nginx\conf_d`
- Do not sync `/mnt/docker-services/nginx/ssl` unless the user explicitly requests it, because it contains certificate material.
- Do not sync logs.

Before overwriting local Nginx config, create a local timestamped backup beside the `nginx` directory.

## Current Known Good State

- Deployment date: `2026-06-23`
- Remote config backup: `/mnt/docker-services/backups/jiedong-cert-20260623100332`
- SSR service: `jiedong-cert`
- SSR URL: `http://115.191.79.224:5000/`
- Nginx HTTP URL: `http://115.191.79.224/`
- Nginx HTTPS URL: `https://115.191.79.224/`
- Local Compose sync backup: `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\docker-compose.backup-20260623101141.yaml`
- Local Nginx sync backup: `E:\ZZY_PROJECT\通用商城模板\common-mall\mall4cloud\doc\中间件docker-compse-生产环境部署包\nginx-local-backup-20260623100706`
