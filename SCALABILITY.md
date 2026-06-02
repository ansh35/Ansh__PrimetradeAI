# 📈 Scalability Notes — TaskFlow API

### 🔗 Public Access
- **Production URL**: **[TaskFlow Live](https://anshprimetradeai-production.up.railway.app)**
- **API Endpoint**: **[TaskFlow API](https://content-quietude-production.up.railway.app/api)**

## Current Architecture
TaskFlow is built as a monolithic Express + MongoDB application — ideal for rapid development and current scale. The architecture is designed to evolve gracefully into a distributed system as demand grows.

---

## 🔥 Horizontal Scaling

### Load Balancing
- Deploy multiple Node.js instances behind a **NGINX** or **AWS ALB** load balancer
- Use **PM2 cluster mode** (`pm2 start index.js -i max`) locally to utilize all CPU cores
- All instances are stateless (JWT-based auth, no server-side sessions) — ready for horizontal scaling out of the box

### Containerization
- Each service can be Dockerized and orchestrated with **Kubernetes (K8s)**
- `docker-compose` setup can spin up server + MongoDB + Redis in one command

---

## ⚡ Caching Strategy

### Redis Integration (Recommended Next Step)
- Cache dashboard stats (`GET /api/v1/dashboard`) with a 60-second TTL — this is the most read-heavy endpoint
- Cache user role lookups to reduce DB round-trips on every protected route
- Session blacklisting for JWT logout support (currently logout is client-side only)

```
GET /api/v1/dashboard → Redis HIT → return cached (< 5ms)
                       → Redis MISS → MongoDB query → store in Redis → return
```

---

## 🏗️ Microservices Migration Path

When traffic justifies it, the monolith splits cleanly along existing module boundaries:

| Service | Responsibility |
|---|---|
| `auth-service` | `/api/v1/auth` — registration, login, JWT |
| `project-service` | `/api/v1/projects` — CRUD, membership |
| `task-service` | `/api/v1/tasks` — CRUD, filtering |
| `team-service` | `/api/v1/teams` — team management |
| `notification-service` | Email/push alerts on task assignment |

Inter-service communication via **gRPC** or **RabbitMQ** message queue.

---

## 🗄️ Database Scaling

- **MongoDB Atlas** supports auto-sharding for horizontal scaling
- Add indexes on hot query fields: `Task.status`, `Task.project`, `Task.assignedTo`, `Project.members`
- Use **read replicas** for dashboard/analytics queries to offload the primary node

```js
// Recommended indexes (add to models)
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
projectSchema.index({ members: 1 });
```

---

## 📊 Observability

- **Logging**: Morgan (HTTP) + Winston (app-level) already integrated via `server.log`
- **Monitoring**: Integrate **Datadog** or **New Relic** APM for distributed tracing
- **Health Check**: Add `GET /health` endpoint for load balancer heartbeat checks

---

## 🛡️ Security at Scale

- **Rate Limiting**: Already implemented (100 req/15min per IP via `express-rate-limit`)
- Upgrade to **Redis-backed rate limiting** (`rate-limit-redis`) when running multiple instances so limits are shared across nodes
- **API Gateway** (Kong / AWS API Gateway) for centralized auth, throttling, and routing in a microservices setup

---

## 🚀 Deployment Targets

| Stage | Platform |
|---|---|
| Development | Local Node.js + MongoDB Atlas |
| Staging | Railway / Render (single container) |
| Production | AWS ECS + DocumentDB or Atlas, CloudFront CDN |
