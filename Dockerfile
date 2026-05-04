# Stage 1 - builder
FROM node:22-alpine3.20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json first (layer cache)
COPY package.json package-lock.json ./

# Run npm ci
RUN npm ci

# Copy remaining source files
COPY . .

# Run npm run build (outputs to /app/dist)
RUN npm run build

# Stage 2 - production
FROM nginx:stable-alpine

# Copy custom nginx.conf that handles client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy /app/dist from builder to /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Run as non-root: create nginx user if not present, set file ownership
RUN id -u nginx &>/dev/null || adduser -D -H -s /sbin/nologin nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

CMD ["nginx", "-g", "daemon off;"]
