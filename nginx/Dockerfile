FROM nginx:alpine

# Crear certificados autofirmados automáticamente
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/certs && \
    openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/certs/server.key \
    -out /etc/nginx/certs/server.crt -days 365 -nodes \
    -subj "/C=AR/ST=Buenos Aires/L=Buenos Aires/O=Gestion Libreria/CN=localhost" && \
    chmod 644 /etc/nginx/certs/server.crt && \
    chmod 600 /etc/nginx/certs/server.key

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
