#!/bin/bash
#
# backup.sh
# Backup automático de tablas críticas (usuarios, libros) - Sistema de Gestión de Librería
#
# Variables de entorno esperadas:
#   DB_HOST, DB_NAME, DB_USER, DB_PASSWORD   -> conexión a MySQL
#   BACKUP_TABLES                            -> tablas a respaldar, separadas por coma (default: usuarios,libros)
#   BACKUP_DIR                               -> carpeta destino dentro del contenedor (default: /backups)
#   BACKUP_RETENTION_WEEKS                   -> semanas a conservar (default: 4)
#

set -uo pipefail

# ===================== CONFIGURACIÓN =====================
DB_HOST="${DB_HOST:-db}"
DB_NAME="${DB_NAME:-gestion_libreria}"
DB_USER="${DB_USER:-admin}"
DB_PASSWORD="${DB_PASSWORD:-secret}"
BACKUP_TABLES="${BACKUP_TABLES:-usuarios,libros}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_WEEKS="${BACKUP_RETENTION_WEEKS:-4}"

LOG_DIR="${BACKUP_DIR}/logs"
LOG_FILE="${LOG_DIR}/backup.log"
TIMESTAMP="$(date +'%Y-%m-%d_%H-%M-%S')"
DUMP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"
ZIP_FILE="${DUMP_FILE}.zip"

mkdir -p "${BACKUP_DIR}" "${LOG_DIR}"

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

fail() {
  log "❌ ERROR: $1"
  exit 1
}

# ===================== CREDENCIALES TEMPORALES =====================
# Evita exponer la contraseña en la lista de procesos (ps aux)
CNF_FILE="$(mktemp)"
chmod 600 "${CNF_FILE}"
trap 'rm -f "${CNF_FILE}"' EXIT

cat > "${CNF_FILE}" <<EOF
[client]
host=${DB_HOST}
user=${DB_USER}
password=${DB_PASSWORD}
EOF

# "usuarios,libros" -> "usuarios libros" (mysqldump espera las tablas separadas por espacio)
TABLES_ARG="$(echo "${BACKUP_TABLES}" | tr ',' ' ')"

log "==================================================="
log "Iniciando backup de tablas: ${BACKUP_TABLES}"

# ===================== DUMP =====================
mysqldump \
  --defaults-extra-file="${CNF_FILE}" \
  --single-transaction \
  --no-tablespaces \
  --result-file="${DUMP_FILE}" \
  "${DB_NAME}" ${TABLES_ARG}

RC=$?
if [ ${RC} -ne 0 ] || [ ! -s "${DUMP_FILE}" ]; then
  fail "mysqldump falló (código ${RC}) o generó un archivo vacío"
fi

log "Dump generado: ${DUMP_FILE} ($(du -h "${DUMP_FILE}" | cut -f1))"

# ===================== COMPRESIÓN =====================
if ! zip -j "${ZIP_FILE}" "${DUMP_FILE}" >> "${LOG_FILE}" 2>&1; then
  fail "La compresión zip falló"
fi

rm -f "${DUMP_FILE}"
log "✅ Backup comprimido: ${ZIP_FILE} ($(du -h "${ZIP_FILE}" | cut -f1))"

# ===================== LIMPIEZA DE BACKUPS VIEJOS =====================
RETENTION_DAYS=$(( RETENTION_WEEKS * 7 ))
log "Eliminando backups con más de ${RETENTION_WEEKS} semanas (${RETENTION_DAYS} días)..."

DELETED_COUNT=0
while IFS= read -r -d '' old_file; do
  rm -f "${old_file}"
  log "  - Eliminado: $(basename "${old_file}")"
  DELETED_COUNT=$((DELETED_COUNT + 1))
done < <(find "${BACKUP_DIR}" -maxdepth 1 -name "backup_${DB_NAME}_*.zip" -mtime "+${RETENTION_DAYS}" -print0)

log "Backups antiguos eliminados: ${DELETED_COUNT}"
log "Backup finalizado correctamente ✅"
log "==================================================="

exit 0