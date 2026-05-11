#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"

REMOTE_HOST="${REMOTE_HOST:-115.191.79.224}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_PASSWORD="${REMOTE_PASSWORD:-Jiedongyaoye.}"
REMOTE_DIR="${REMOTE_DIR:-/mnt/web-services/scripts/apps}"
SSH_PORT="${SSH_PORT:-22}"

SSH_OPTS=(
    -p "${SSH_PORT}"
    -o ConnectTimeout=10
    -o StrictHostKeyChecking=accept-new
)

JAR_SEARCH_DIRS=(
    "${SCRIPT_DIR}"
    "${SCRIPT_DIR}/apps"
    "${PROJECT_DIR}"
    "${PROJECT_DIR}/apps"
)

SERVICE_JARS=(
    "mall4cloud-gateway.jar"
    "mall4cloud-auth.jar"
    "mall4cloud-user.jar"
    "mall4cloud-rbac.jar"
    "mall4cloud-product.jar"
    "mall4cloud-order.jar"
    "mall4cloud-payment.jar"
    "mall4cloud-search.jar"
    "mall4cloud-biz.jar"
    "mall4cloud-multishop.jar"
    "mall4cloud-platform.jar"
    "mall4cloud-leaf.jar"
)

RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
NC='\033[0m'

print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

format_bytes() {
    local bytes=$1
    local units=("B" "KB" "MB" "GB" "TB")
    local index=0
    local value="${bytes}"

    while [ "${value}" -ge 1024 ] && [ "${index}" -lt $((${#units[@]} - 1)) ]; do
        value=$((value / 1024))
        index=$((index + 1))
    done

    if [ "${index}" -eq 0 ]; then
        echo "${bytes}${units[${index}]}"
    else
        awk -v b="${bytes}" -v i="${index}" -v unit="${units[${index}]}" 'BEGIN {
            value=b
            for (n = 0; n < i; n++) value = value / 1024
            printf "%.2f%s", value, unit
        }'
    fi
}

format_duration() {
    local seconds=$1
    if [ "${seconds}" -lt 60 ]; then
        printf "%ss" "${seconds}"
    elif [ "${seconds}" -lt 3600 ]; then
        printf "%sm %ss" "$((seconds / 60))" "$((seconds % 60))"
    else
        printf "%sh %sm %ss" "$((seconds / 3600))" "$(((seconds % 3600) / 60))" "$((seconds % 60))"
    fi
}

have_command() {
    command -v "$1" >/dev/null 2>&1
}

ssh_prefix() {
    if have_command sshpass; then
        printf "sshpass -p %q " "${REMOTE_PASSWORD}"
    fi
}

FORCE_UPLOAD=0
if [ "${1:-}" = "--force" ]; then
    FORCE_UPLOAD=1
    shift
fi

ssh_remote() {
    if have_command sshpass; then
        sshpass -p "${REMOTE_PASSWORD}" ssh "${SSH_OPTS[@]}" "${REMOTE_USER}@${REMOTE_HOST}" "$@"
    else
        ssh "${SSH_OPTS[@]}" "${REMOTE_USER}@${REMOTE_HOST}" "$@"
    fi
}

ensure_remote_dir() {
    ssh_remote "mkdir -p '${REMOTE_DIR}'"
}

find_local_jar() {
    local jar_name=$1
    local dir=""
    local found=""

    for dir in "${JAR_SEARCH_DIRS[@]}"; do
        if [ -f "${dir}/${jar_name}" ]; then
            echo "${dir}/${jar_name}"
            return 0
        fi
    done

    found="$(find "${PROJECT_DIR}" -maxdepth 3 -type f \( -name "${jar_name}" -o -name "${jar_name%.jar}-*.jar" \) \
        ! -name "original-*" ! -name "*-sources.jar" ! -name "*-javadoc.jar" \
        | sort | tail -n 1 || true)"

    if [ -n "${found}" ]; then
        echo "${found}"
        return 0
    fi

    return 1
}

detect_transfer_tool() {
    if have_command rsync; then
        echo "rsync"
    elif have_command scp; then
        echo "scp"
    else
        print_color "${RED}" "ERROR: neither rsync nor scp is installed locally."
        exit 1
    fi
}

sha256_local() {
    local file=$1
    if have_command sha256sum; then
        sha256sum "${file}" | awk '{print $1}'
    elif have_command shasum; then
        shasum -a 256 "${file}" | awk '{print $1}'
    else
        print_color "${RED}" "ERROR: sha256sum or shasum is required locally."
        exit 1
    fi
}

sha256_remote() {
    local jar_name=$1
    ssh_remote "if [ -f '${REMOTE_DIR}/${jar_name}' ]; then sha256sum '${REMOTE_DIR}/${jar_name}' | awk '{print \$1}'; else echo MISSING; fi"
}

print_list() {
    local title=$1
    shift
    local items=("$@")

    print_color "${BLUE}" "${title}"
    if [ "${#items[@]}" -eq 0 ]; then
        echo "  (none)"
        return
    fi

    local item
    for item in "${items[@]}"; do
        echo "  - ${item}"
    done
}

upload_with_rsync() {
    local local_file=$1
    local remote_file=$2
    if have_command sshpass; then
        rsync -ah --partial --info=progress2 --rsh="sshpass -p ${REMOTE_PASSWORD} ssh ${SSH_OPTS[*]}" "${local_file}" "${REMOTE_USER}@${REMOTE_HOST}:${remote_file}"
    else
        rsync -ah --partial --info=progress2 --rsh="ssh ${SSH_OPTS[*]}" "${local_file}" "${REMOTE_USER}@${REMOTE_HOST}:${remote_file}"
    fi
}

upload_with_scp() {
    local local_file=$1
    local remote_file=$2
    if have_command sshpass; then
        sshpass -p "${REMOTE_PASSWORD}" scp "${SSH_OPTS[@]}" "${local_file}" "${REMOTE_USER}@${REMOTE_HOST}:${remote_file}"
    else
        scp "${SSH_OPTS[@]}" "${local_file}" "${REMOTE_USER}@${REMOTE_HOST}:${remote_file}"
    fi
}

main() {
    local transfer_tool
    transfer_tool="$(detect_transfer_tool)"

    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud JAR Upload"
    print_color "${BLUE}" "========================================"
    echo "Remote target: ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}"
    echo "Transfer tool: ${transfer_tool}"
    echo "Compare mode: sha256"
    echo "Force upload: ${FORCE_UPLOAD}"
    echo ""

    ensure_remote_dir

    declare -a missing_local=()
    declare -a skipped_remote=()
    declare -a upload_names=()
    declare -a upload_paths=()
    declare -a upload_sizes=()
    declare -a upload_hashes=()

    local jar_name=""
    local local_file=""
    local local_size=0
    local local_hash=""
    local remote_hash=""

    for jar_name in "${SERVICE_JARS[@]}"; do
        if ! local_file="$(find_local_jar "${jar_name}")"; then
            missing_local+=("${jar_name}")
            continue
        fi

        local_size="$(stat -c%s "${local_file}")"
        local_hash="$(sha256_local "${local_file}")"

        if [ "${FORCE_UPLOAD}" -eq 0 ]; then
            remote_hash="$(sha256_remote "${jar_name}")"
            if [ "${remote_hash}" != "MISSING" ] && [ "${remote_hash}" = "${local_hash}" ]; then
                skipped_remote+=("${jar_name} ($(format_bytes "${local_size}"))")
                continue
            fi
        fi

        upload_names+=("${jar_name}")
        upload_paths+=("${local_file}")
        upload_sizes+=("${local_size}")
        upload_hashes+=("${local_hash}")
    done

    print_list "JAR files missing locally" "${missing_local[@]}"
    echo ""
    print_list "JAR files already present remotely and skipped" "${skipped_remote[@]}"
    echo ""

    if [ "${#upload_names[@]}" -eq 0 ]; then
        print_color "${GREEN}" "No JAR files need to be uploaded."
        exit 0
    fi

    local total_bytes=0
    local size=0
    for size in "${upload_sizes[@]}"; do
        total_bytes=$((total_bytes + size))
    done

    print_color "${BLUE}" "JAR files queued for upload"
    local i=0
    for ((i = 0; i < ${#upload_names[@]}; i++)); do
        echo "  - ${upload_names[${i}]} ($(format_bytes "${upload_sizes[${i}]}")) <- ${upload_paths[${i}]}"
    done
    echo ""

    local uploaded_bytes=0
    local start_ts
    start_ts="$(date +%s)"

    for ((i = 0; i < ${#upload_names[@]}; i++)); do
        local current_name="${upload_names[${i}]}"
        local current_path="${upload_paths[${i}]}"
        local current_size="${upload_sizes[${i}]}"
        local remote_target="${REMOTE_DIR}/${current_name}"

        echo ""
        print_color "${YELLOW}" "[$((i + 1))/${#upload_names[@]}] Uploading: ${current_name}"
        echo "Local file: ${current_path}"
        echo "File size: $(format_bytes "${current_size}")"
        echo "Overall progress: $(format_bytes "${uploaded_bytes}") / $(format_bytes "${total_bytes}")"

        if [ "${transfer_tool}" = "rsync" ]; then
            upload_with_rsync "${current_path}" "${remote_target}"
        else
            upload_with_scp "${current_path}" "${remote_target}"
        fi

        uploaded_bytes=$((uploaded_bytes + current_size))

        local now_ts
        local elapsed
        local remaining_bytes
        local eta_text="unknown"

        now_ts="$(date +%s)"
        elapsed=$((now_ts - start_ts))
        remaining_bytes=$((total_bytes - uploaded_bytes))

        if [ "${uploaded_bytes}" -gt 0 ] && [ "${elapsed}" -gt 0 ] && [ "${remaining_bytes}" -gt 0 ]; then
            local eta_seconds
            eta_seconds="$(awk -v uploaded="${uploaded_bytes}" -v elapsed="${elapsed}" -v remaining="${remaining_bytes}" 'BEGIN {
                printf "%.0f", (remaining / (uploaded / elapsed))
            }')"
            eta_text="$(format_duration "${eta_seconds}")"
        elif [ "${remaining_bytes}" -eq 0 ]; then
            eta_text="0s"
        fi

        print_color "${GREEN}" "Done: ${current_name}"
        echo "Uploaded: $(format_bytes "${uploaded_bytes}") / $(format_bytes "${total_bytes}")"
        echo "Estimated remaining: ${eta_text}"
    done

    echo ""
    print_color "${GREEN}" "Upload complete."
    echo "Uploaded successfully: ${#upload_names[@]}"
    echo "Skipped (already present): ${#skipped_remote[@]}"
    echo "Missing locally: ${#missing_local[@]}"
}

main "$@"
