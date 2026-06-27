#!/bin/bash
#
# entrypoint.sh
# Genera el crontab a partir de BACKUP_CRON_SCHEDULE y deja crond corriendo en foreground.
#

set -e

mkdir -p /backups/logs

SCHEDULE="${BACKUP_CRON_SCHEDULE:-0 3 * * 0}"

echo "${SCHEDULE} /scripts/backup.sh >> /backups/logs/cron.log 2>&1" > /etc/crontabs/root

echo "[entrypoint] Servicio de backup iniciado."
echo "[entrypoint] Programación cron: ${SCHEDULE}"
echo "[entrypoint] Tablas a respaldar: ${BACKUP_TABLES:-usuarios,libros}"

# Útil para pruebas locales: levanta el contenedor y corre un backup ya mismo,
# sin tener que esperar al próximo disparo de cron.
if [ "${BACKUP_RUN_ON_START:-false}" = "true" ]; then
  echo "[entrypoint] BACKUP_RUN_ON_START=true -> ejecutando backup inicial de prueba"
  /scripts/backup.sh
fi

exec crond -f -l 2