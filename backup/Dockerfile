FROM alpine:3.20

# mysql-client        -> mysqldump
# mariadb-connector-c -> trae el plugin caching_sha2_password (auth por defecto de MySQL 8),
#                        sin esto mysqldump no puede autenticar contra MySQL 8.0+
# bash                -> nuestros scripts usan bash
# zip                 -> compresión de backups
# tzdata              -> zona horaria correcta en logs y nombres de archivo
RUN apk add --no-cache mysql-client mariadb-connector-c bash zip tzdata

ENV TZ=America/Argentina/Buenos_Aires

WORKDIR /scripts
COPY scripts/backup.sh /scripts/backup.sh
COPY entrypoint.sh /entrypoint.sh

# Normaliza finales de línea (por si el repo trae CRLF desde Windows) y da permisos
RUN sed -i 's/\r$//' /scripts/backup.sh /entrypoint.sh \
    && chmod +x /scripts/backup.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]