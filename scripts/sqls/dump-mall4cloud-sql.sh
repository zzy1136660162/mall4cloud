#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_ROOT="${SCRIPT_DIR}/dumps"

MYSQL_HOST="${MYSQL_HOST:-192.168.0.101}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-Gesoft9919.}"
DB_PATTERN="${DB_PATTERN:-mall4cloud\_%}"
MYSQL_CONNECT_TIMEOUT="${MYSQL_CONNECT_TIMEOUT:-5}"
EXCLUDED_DATABASES=("mall4cloud_seata" "mall4cloud_nacos")

MODE="full"
COMPRESS=0
SINGLE_DB=""
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTPUT_DIR="${OUTPUT_ROOT}/${TIMESTAMP}"

RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
NC='\033[0m'

MYSQL_CMD=""
MYSQLDUMP_CMD=""

print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

usage() {
    cat <<'EOF'
Usage:
  ./dump-mall4cloud-sql.sh
  ./dump-mall4cloud-sql.sh --db mall4cloud_user
  ./dump-mall4cloud-sql.sh --pattern 'mall4cloud\_%'
  ./dump-mall4cloud-sql.sh --schema-only
  ./dump-mall4cloud-sql.sh --data-only
  ./dump-mall4cloud-sql.sh --compress

Options:
  --db <name>          Dump a single database.
  --pattern <pattern>  Dump databases matching SQL LIKE pattern.
  --schema-only        Dump schema only.
  --data-only          Dump data only.
  --compress           Gzip output files after dump.
  -h, --help           Show this help message.

Environment overrides:
  MYSQL_HOST
  MYSQL_PORT
  MYSQL_USER
  MYSQL_PASSWORD
  DB_PATTERN
EOF
}

require_command() {
    local cmd=$1
    if ! command -v "${cmd}" >/dev/null 2>&1; then
        print_color "${RED}" "ERROR: required command not found: ${cmd}"
        exit 1
    fi
}

resolve_mysql_tools() {
    if command -v mysql >/dev/null 2>&1; then
        MYSQL_CMD="mysql"
    elif command -v mariadb >/dev/null 2>&1; then
        MYSQL_CMD="mariadb"
    else
        print_color "${RED}" "ERROR: mysql client not found. Install mysql-client or mariadb-client."
        exit 1
    fi

    if command -v mysqldump >/dev/null 2>&1; then
        MYSQLDUMP_CMD="mysqldump"
    elif command -v mariadb-dump >/dev/null 2>&1; then
        MYSQLDUMP_CMD="mariadb-dump"
    else
        print_color "${RED}" "ERROR: mysqldump not found. Install mysql-client or mariadb-client."
        exit 1
    fi
}

mysql_base_cmd() {
    "${MYSQL_CMD}" \
        --protocol=TCP \
        --host="${MYSQL_HOST}" \
        --port="${MYSQL_PORT}" \
        --user="${MYSQL_USER}" \
        --password="${MYSQL_PASSWORD}" \
        --connect-timeout="${MYSQL_CONNECT_TIMEOUT}" \
        --default-character-set=utf8mb4 \
        --batch \
        --skip-column-names \
        "$@"
}

mysqldump_base_cmd() {
    "${MYSQLDUMP_CMD}" \
        --protocol=TCP \
        --host="${MYSQL_HOST}" \
        --port="${MYSQL_PORT}" \
        --user="${MYSQL_USER}" \
        --password="${MYSQL_PASSWORD}" \
        --default-character-set=utf8mb4 \
        --single-transaction \
        --set-gtid-purged=OFF \
        --routines \
        --triggers \
        --events \
        --hex-blob \
        --skip-comments \
        "$@"
}

parse_args() {
    while [ $# -gt 0 ]; do
        case "$1" in
            --db)
                SINGLE_DB="${2:-}"
                shift 2
                ;;
            --pattern)
                DB_PATTERN="${2:-}"
                shift 2
                ;;
            --schema-only)
                MODE="schema"
                shift
                ;;
            --data-only)
                MODE="data"
                shift
                ;;
            --compress)
                COMPRESS=1
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                print_color "${RED}" "ERROR: unknown argument: $1"
                usage
                exit 1
                ;;
        esac
    done
}

test_connection() {
    print_color "${BLUE}" "Checking MySQL connection..."
    if ! "${MYSQL_CMD}" \
        --protocol=TCP \
        --host="${MYSQL_HOST}" \
        --port="${MYSQL_PORT}" \
        --user="${MYSQL_USER}" \
        --password="${MYSQL_PASSWORD}" \
        --connect-timeout="${MYSQL_CONNECT_TIMEOUT}" \
        --default-character-set=utf8mb4 \
        --batch \
        --skip-column-names \
        -e "SELECT 1;" >/dev/null 2>&1; then
        print_color "${RED}" "ERROR: failed to connect to MySQL ${MYSQL_HOST}:${MYSQL_PORT}"
        echo "Hint: check network reachability, firewall, and whether ${MYSQL_HOST}:${MYSQL_PORT} accepts TCP connections."
        exit 1
    fi
}

collect_databases() {
    if [ -n "${SINGLE_DB}" ]; then
        printf '%s\n' "${SINGLE_DB}"
        return 0
    fi

    mysql_base_cmd -e "SHOW DATABASES LIKE '${DB_PATTERN}';" | while IFS= read -r db_name; do
        local excluded=0
        local exclude_name=""
        for exclude_name in "${EXCLUDED_DATABASES[@]}"; do
            if [ "${db_name}" = "${exclude_name}" ]; then
                excluded=1
                break
            fi
        done

        if [ "${excluded}" -eq 0 ]; then
            printf '%s\n' "${db_name}"
        fi
    done
}

dump_one_db() {
    local db_name=$1
    local output_file="${OUTPUT_DIR}/${db_name}.sql"
    local -a dump_args=()

    case "${MODE}" in
        schema)
            dump_args+=(--no-data)
            ;;
        data)
            dump_args+=(--no-create-info)
            ;;
    esac

    print_color "${BLUE}" "Dumping ${db_name} -> ${output_file}" >&2
    mysqldump_base_cmd "${dump_args[@]}" --databases "${db_name}" > "${output_file}"

    if [ "${COMPRESS}" -eq 1 ]; then
        gzip -f "${output_file}"
        output_file="${output_file}.gz"
    fi

    echo "${output_file}"
}

main() {
    parse_args "$@"
    resolve_mysql_tools
    test_connection

    mapfile -t databases < <(collect_databases)

    if [ "${#databases[@]}" -eq 0 ]; then
        print_color "${YELLOW}" "No databases matched."
        exit 0
    fi

    mkdir -p "${OUTPUT_DIR}"

    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud SQL Dump"
    print_color "${BLUE}" "========================================"
    echo "Host: ${MYSQL_HOST}:${MYSQL_PORT}"
    echo "User: ${MYSQL_USER}"
    echo "Mode: ${MODE}"
    echo "Compress: ${COMPRESS}"
    echo "Output: ${OUTPUT_DIR}"
    echo ""
    print_color "${BLUE}" "Databases to dump:"
    printf '  - %s\n' "${databases[@]}"
    echo ""

    declare -a success_files=()
    declare -a failed_dbs=()

    local db_name=""
    for db_name in "${databases[@]}"; do
        if dumped_file="$(dump_one_db "${db_name}")"; then
            success_files+=("${dumped_file}")
        else
            failed_dbs+=("${db_name}")
        fi
    done

    echo ""
    if [ "${#success_files[@]}" -gt 0 ]; then
        print_color "${GREEN}" "Dump completed:"
        printf '  - %s\n' "${success_files[@]}"
    fi

    if [ "${#failed_dbs[@]}" -gt 0 ]; then
        echo ""
        print_color "${YELLOW}" "Failed databases:"
        printf '  - %s\n' "${failed_dbs[@]}"
        exit 1
    fi
}

main "$@"
