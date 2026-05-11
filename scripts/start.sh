#!/bin/bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/services.conf"

RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
NC='\033[0m'

JAVA_BIN=""

print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

resolve_java() {
    if [ -n "${JAVA_HOME:-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then
        JAVA_BIN="${JAVA_HOME}/bin/java"
    elif command -v java >/dev/null 2>&1; then
        JAVA_BIN="$(command -v java)"
    else
        print_color "${RED}" "错误: 未找到 Java 运行环境"
        echo "请先安装 JDK 17，或设置 JAVA_HOME。"
        echo "当前 PATH: ${PATH}"
        return 1
    fi
}

check_port() {
    local port=$1
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :"${port}" >/dev/null 2>&1
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tuln | grep -q ":${port} "
    else
        nc -z localhost "${port}" >/dev/null 2>&1
    fi
}

check_pid() {
    local pid=$1
    if [ -n "${pid}" ]; then
        kill -0 "${pid}" 2>/dev/null
        return $?
    fi
    return 1
}

get_pid() {
    local service_name=$1
    local pid_file="${PID_DIR}/${service_name}.pid"
    if [ -f "${pid_file}" ]; then
        cat "${pid_file}"
    fi
}

find_jar_file() {
    local jar_name=$1
    local dir
    for dir in "${JAR_DIRS[@]}"; do
        if [ -f "${dir}/${jar_name}.jar" ]; then
            echo "${dir}/${jar_name}.jar"
            return 0
        fi
    done
    return 1
}

start_service() {
    local service_key=$1
    local service_config="${SERVICES[${service_key}]:-}"

    if [ -z "${service_config}" ]; then
        print_color "${RED}" "错误: 未找到服务配置 [${service_key}]"
        return 1
    fi

    IFS=':' read -r jar_name port jvm_opts <<< "${service_config}"

    if check_port "${port}"; then
        print_color "${YELLOW}" "警告: 端口 ${port} 已被占用，跳过 [${service_key}]"
        return 0
    fi

    local current_pid
    current_pid="$(get_pid "${service_key}")"
    if [ -n "${current_pid}" ] && check_pid "${current_pid}"; then
        print_color "${YELLOW}" "警告: [${service_key}] 已在运行 (PID: ${current_pid})，跳过"
        return 0
    fi

    local jar_file
    if ! jar_file="$(find_jar_file "${jar_name}")"; then
        print_color "${RED}" "错误: JAR 文件不存在 [${jar_name}.jar]"
        echo "请将 JAR 文件放在以下目录之一："
        local dir
        for dir in "${JAR_DIRS[@]}"; do
            echo "  - ${dir}/"
        done
        return 1
    fi

    echo "  (找到JAR: ${jar_file})"
    touch "${LOG_DIR}/${service_key}.log" 2>/dev/null

    print_color "${BLUE}" "启动 [${service_key}] (端口: ${port})..."

    nohup "${JAVA_BIN}" ${JAVA_OPTS} ${jvm_opts} -jar "${jar_file}" \
        --server.port="${port}" \
        >> "${LOG_DIR}/${service_key}.log" 2>&1 &
    local new_pid=$!
    echo "${new_pid}" > "${PID_DIR}/${service_key}.pid"

    local count=0
    while [ "${count}" -lt "${START_TIMEOUT}" ]; do
        if check_pid "${new_pid}"; then
            if check_port "${port}"; then
                print_color "${GREEN}" "✓ [${service_key}] 启动成功 (PID: ${new_pid})"
                return 0
            fi
        else
            print_color "${RED}" "✗ [${service_key}] 启动失败"
            tail -20 "${LOG_DIR}/${service_key}.log"
            rm -f "${PID_DIR}/${service_key}.pid"
            return 1
        fi

        sleep 1
        count=$((count + 1))
    done

    print_color "${YELLOW}" "! [${service_key}] 启动超时，但进程仍在运行 (PID: ${new_pid})"
    return 0
}

start_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务启动脚本"
    print_color "${BLUE}" "========================================"
    echo

    local failed=0
    local service_key
    for service_key in "${SERVICE_ORDER[@]}"; do
        start_service "${service_key}"
        if [ $? -ne 0 ]; then
            failed=$((failed + 1))
        fi
        sleep 1
    done

    echo
    if [ "${failed}" -eq 0 ]; then
        print_color "${GREEN}" "✓ 所有服务启动完成"
        print_color "${BLUE}" "日志目录: ${LOG_DIR}"
    else
        print_color "${YELLOW}" "! 有 ${failed} 个服务启动失败，请检查日志"
    fi
}

start_single() {
    local service_key
    service_key="$(echo "$1" | tr '[:lower:]' '[:upper:]')"

    if [ -z "${SERVICES[${service_key}]:-}" ]; then
        print_color "${RED}" "错误: 未知的服务名称 [${service_key}]"
        echo "可用服务列表:"
        local key
        for key in "${!SERVICES[@]}"; do
            echo "  - ${key}"
        done
        return 1
    fi

    echo
    start_service "${service_key}"
}

main() {
    resolve_java || return 1
    mkdir -p "${LOG_DIR}" "${PID_DIR}"

    local dir
    for dir in "${JAR_DIRS[@]}"; do
        if [ ! -d "${dir}" ]; then
            mkdir -p "${dir}" 2>/dev/null
        fi
    done

    if [ $# -eq 0 ]; then
        start_all
    else
        local service
        for service in "$@"; do
            start_single "${service}"
        done
    fi
}

main "$@"
