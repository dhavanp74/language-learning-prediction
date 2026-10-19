FROM node:22-bookworm-slim AS dependencies

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder

WORKDIR /app/frontend
COPY --from=dependencies /app/frontend/node_modules ./node_modules
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
WORKDIR /app/frontend

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-venv \
    && python3 -m venv /opt/venv \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/venv/bin:$PATH"

COPY frontend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=node:node --from=builder /app/frontend/.next/standalone ./
COPY --chown=node:node --from=builder /app/frontend/.next/static ./.next/static
COPY --chown=node:node frontend/scripts/ ./scripts/
COPY --chown=node:node models/ /app/models/

USER node

EXPOSE 3000

CMD ["node", "server.js"]
