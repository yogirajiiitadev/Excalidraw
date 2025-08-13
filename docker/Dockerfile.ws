FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app

# Copy root-level files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy full source (so prisma/schema.prisma exists)
COPY packages ./packages
COPY apps/web-socket-backend ./apps/web-socket-backend

# Install all dependencies
RUN pnpm install

# Explicitly generate Prisma client in @repo/db
RUN cd packages/db && pnpm prisma generate

EXPOSE 8080
WORKDIR /app/apps/web-socket-backend
CMD ["pnpm", "run", "dev"]

# docker build -t web-socket-backend -f docker/Dockerfile.ws .
# docker run -p 8080:8080 web-socket-backend
