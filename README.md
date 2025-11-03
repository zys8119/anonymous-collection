# vue 匿名集合

## docker 部署

```
docker buildx build \                                                                                                                                  git:(main|✚1 
  --platform linux/amd64,linux/arm64 \
  -t zys8119/anonymous-collection:latest \
  --push .
```

## docker compose 部署

```yml
version: '3.9'

services:
  app:
    build: .
    container_name: anonymous-collection
    environment:
      - VITE_API_URL=http://localhost:81
      # 服务端口
      - SERVE_PORT=81
      # ===============数据库连接配置
      # 数据库主机
      - DB_HOST=127.0.0.1
      # 数据库端口
      - DB_PORT=3306
      # 数据库用户名
      - DB_USER=root
      # 数据库密码
      - DB_PASSWORD=12345
      # 数据库名称
      - DB_DATABASE=api
      # 数据库连接池最大连接数
      - DB_CONNECTION_LIMIT=10
    ports:
      - "5173:5173"
      - "81:81"

```