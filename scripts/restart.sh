#!/bin/bash

# =================================================================
# Mall4Cloud 微服务重启脚本
# =================================================================
# 用法:
#   ./restart.sh              - 重启所有服务
#   ./restart.sh <服务名>       - 重启指定服务
# 示例:
#   ./restart.sh              - 重启所有微服务
#   ./restart.sh AUTH         - 重启认证服务
#   ./restart.sh GATEWAY      - 重启网关服务
# =================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

restart_single() {
    local service=$1
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   重启服务: ${service}"
    print_color "${BLUE}" "========================================"
    echo ""

    print_color "${YELLOW}" "Step 1: 停止服务..."
    "${SCRIPT_DIR}/stop.sh" ${service}

    echo ""
    print_color "${YELLOW}" "Step 2: 启动服务..."
    "${SCRIPT_DIR}/start.sh" ${service}

    echo ""
    print_color "${GREEN}" "✓ ${service} 重启完成"
}

restart_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务重启脚本"
    print_color "${BLUE}" "========================================"
    echo ""

    print_color "${YELLOW}" "Step 1: 停止所有服务..."
    "${SCRIPT_DIR}/stop.sh"

    echo ""
    sleep 2

    print_color "${YELLOW}" "Step 2: 启动所有服务..."
    "${SCRIPT_DIR}/start.sh"

    echo ""
    print_color "${GREEN}" "✓ 所有服务重启完成"
    print_color "${BLUE}" "请使用 ./status.sh 查看服务状态"
}

main() {
    if [ $# -eq 0 ]; then
        restart_all
    else
        for service in "$@"; do
            restart_single ${service}
            echo ""
        done
    fi
}

main "$@"
