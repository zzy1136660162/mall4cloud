#!/bin/bash

# =================================================================
# Mall4Cloud 微服务停止脚本
# =================================================================
# 用法:
#   ./stop.sh              - 停止所有服务
#   ./stop.sh <服务名>      - 停止指定服务
# 示例:
#   ./stop.sh              - 停止所有微服务
#   ./stop.sh AUTH         - 只停止认证服务
#   ./stop.sh GATEWAY      - 只停止网关服务
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

stop_service() {
    local service_key=$1
    local service_config=${SERVICES[${service_key}]}

    if [ -z "${service_config}" ]; then
        print_color "${RED}" "错误: 未找到服务配置 [${service_key}]"
        return 1
    fi

    IFS=':' read -r jar_name port jvm_opts <<< "${service_config}"

    # 获取PID
    local pid=$(get_pid ${service_key})

    # 如果PID文件不存在，尝试通过端口查找
    if [ -z "${pid}" ]; then
        if command -v lsof > /dev/null 2>&1; then
            pid=$(lsof -t -i :${port} 2>/dev/null)
        elif command -v ps > /dev/null 2>&1; then
            pid=$(ps aux | grep "${jar_name}.jar" | grep -v grep | awk '{print $2}' | head -1)
        fi
    fi

    if [ -z "${pid}" ]; then
        print_color "${YELLOW}" "警告: [${service_key}] 未运行"
        rm -f "${PID_DIR}/${service_key}.pid"
        return 0
    fi

    # 检查进程是否真的在运行
    if ! check_pid ${pid}; then
        print_color "${YELLOW}" "警告: [${service_key}] PID文件过期，清理中..."
        rm -f "${PID_DIR}/${service_key}.pid"
        return 0
    fi

    print_color "${BLUE}" "停止 [${service_key}] (PID: ${pid})..."

    # 优雅停止 (SIGTERM)
    kill -15 ${pid} 2>/dev/null

    # 等待进程结束
    local count=0
    local max_wait=${STOP_TIMEOUT}

    while [ $count -lt $max_wait ]; do
        if ! check_pid ${pid}; then
            print_color "${GREEN}" "✓ [${service_key}] 已停止"
            rm -f "${PID_DIR}/${service_key}.pid"
            return 0
        fi
        sleep 1
        ((count++))
    done

    # 超时，强制停止 (SIGKILL)
    print_color "${YELLOW}" "! [${service_key}] 优雅停止超时，强制停止..."
    kill -9 ${pid} 2>/dev/null
    sleep 1

    if ! check_pid ${pid}; then
        print_color "${GREEN}" "✓ [${service_key}] 已强制停止"
    else
        print_color "${RED}" "✗ [${service_key}] 停止失败"
        return 1
    fi

    rm -f "${PID_DIR}/${service_key}.pid"
    return 0
}

stop_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务停止脚本"
    print_color "${BLUE}" "========================================"
    echo ""

    local failed=0

    # 反向顺序停止服务
    for ((i=${#SERVICE_ORDER[@]}-1; i>=0; i--)); do
        service_key=${SERVICE_ORDER[$i]}
        stop_service ${service_key}
        if [ $? -ne 0 ]; then
            ((failed++))
        fi
        sleep 0.5
    done

    echo ""
    if [ $failed -eq 0 ]; then
        print_color "${GREEN}" "✓ 所有服务已停止"
    else
        print_color "${YELLOW}" "! 有 ${failed} 个服务停止失败，请手动处理"
    fi
}

stop_single() {
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
    stop_service ${service_key}
}

main() {
    if [ $# -eq 0 ]; then
        stop_all
    else
        for service in "$@"; do
            stop_single ${service}
        done
    fi
}

main "$@"
