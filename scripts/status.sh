#!/bin/bash

# =================================================================
# Mall4Cloud 微服务状态检查脚本
# =================================================================
# 用法:
#   ./status.sh              - 查看所有服务状态
#   ./status.sh <服务名>       - 查看指定服务状态
# 示例:
#   ./status.sh              - 查看所有微服务状态
#   ./status.sh AUTH         - 查看认证服务状态
#   ./status.sh GATEWAY      - 查看网关服务状态
# =================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/services.conf"

# 颜色定义
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

check_port() {
    local port=$1
    if command -v lsof > /dev/null 2>&1; then
        lsof -i :${port} > /dev/null 2>&1
    elif command -v netstat > /dev/null 2>&1; then
        netstat -tuln | grep ":${port} " > /dev/null 2>&1
    else
        nc -z localhost ${port} > /dev/null 2>&1
    fi
    return $?
}

check_pid() {
    local pid=$1
    if [ -n "${pid}" ]; then
        kill -0 ${pid} 2>/dev/null
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

get_start_time() {
    local pid=$1
    if [ -n "${pid}" ] && command -v ps > /dev/null 2>&1; then
        ps -p ${pid} -o lstart= 2>/dev/null | head -1
    fi
}

get_mem_usage() {
    local pid=$1
    if [ -n "${pid}" ] && command -v ps > /dev/null 2>&1; then
        ps -p ${pid} -o rss= 2>/dev/null | awk '{printf "%.1f MB", $1/1024}'
    fi
}

check_service() {
    local service_key=$1
    local service_config=${SERVICES[${service_key}]}

    if [ -z "${service_config}" ]; then
        return 1
    fi

    IFS=':' read -r jar_name port jvm_opts <<< "${service_config}"

    local pid=$(get_pid ${service_key})
    local status="停止"
    local status_color="${RED}"

    if [ -n "${pid}" ] && check_pid ${pid}; then
        if check_port ${port}; then
            status="运行中"
            status_color="${GREEN}"
        else
            status="启动中"
            status_color="${YELLOW}"
        fi
    else
        # PID文件不存在，尝试通过端口查找
        if check_port ${port}; then
            if command -v lsof > /dev/null 2>&1; then
                pid=$(lsof -t -i :${port} 2>/dev/null)
            fi
            if [ -n "${pid}" ]; then
                status="运行中"
                status_color="${GREEN}"
            fi
        fi

        # 如果还是没有PID，可能文件丢失
        if [ -z "${pid}" ]; then
            pid="-"
        fi
    fi

    local start_time=$(get_start_time ${pid})
    local mem_usage=$(get_mem_usage ${pid})

    printf "| %-12s | %-6s | %-8s | %-20s | %-10s |\n" \
        "${service_key}" \
        "${port}" \
        "${pid}" \
        "${start_time:-未知}" \
        "${mem_usage:-N/A}"

    return 0
}

show_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务状态监控"
    print_color "${BLUE}" "========================================"
    echo ""

    printf "+--------------+--------+----------+----------------------+-------------+\n"
    printf "| %-11s  | %-5s | %-7s | %-19s | %-10s |\n" \
        "服务名" "端口" "PID" "启动时间" "内存使用"
    printf "+--------------+--------+----------+----------------------+-------------+\n"

    for service_key in "${SERVICE_ORDER[@]}"; do
        check_service ${service_key}
    done

    printf "+--------------+--------+----------+----------------------+-------------+\n"
    echo ""

    # 统计信息
    local running=0
    local stopped=0

    for service_key in "${SERVICE_ORDER[@]}"; do
        local service_config=${SERVICES[${service_key}]}
        IFS=':' read -r jar_name port jvm_opts <<< "${service_config}"

        if check_port ${port}; then
            ((running++))
        else
            ((stopped++))
        fi
    done

    print_color "${GREEN}" "运行中: ${running}"
    print_color "${RED}" "   已停止: ${stopped}"
    print_color "${BLUE}" "总服务数: ${#SERVICE_ORDER[@]}"
    echo ""
    print_color "${BLUE}" "日志目录: ${LOG_DIR}"
}

show_single() {
    local service_key=$1
    service_key=$(echo ${service_key} | tr '[:lower:]' '[:upper:]')

    if [ -z "${SERVICES[${service_key}]}" ]; then
        print_color "${RED}" "错误: 未知的服务器名称 [${service_key}]"
        echo ""
        echo "可用的服务列表:"
        for key in "${!SERVICES[@]}"; do
            echo "  - ${key}"
        done
        return 1
    fi

    echo ""
    check_service ${service_key}
}

main() {
    if [ $# -eq 0 ]; then
        show_all
    else
        for service in "$@"; do
            show_single ${service}
        done
    fi
}

main "$@"
