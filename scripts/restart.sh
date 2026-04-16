#!/bin/bash

# =================================================================
# Mall4Cloud 微服务重启脚本（支持并行执行）
# =================================================================
# 用法:
#   ./restart.sh              - 重启所有服务（串行）
#   ./restart.sh --parallel   - 并行重启所有服务
#   ./restart.sh <服务名>     - 重启指定服务
# 示例:
#   ./restart.sh              - 重启所有微服务（串行）
#   ./restart.sh --parallel   - 并行重启所有微服务
#   ./restart.sh AUTH         - 重启认证服务
#   ./restart.sh GATEWAY     - 重启网关服务
# =================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/services.conf"

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

parallel_stop() {
    print_color "${YELLOW}" "并行停止所有服务..."

    local pids=()
    for service in "${SERVICE_ORDER[@]}"; do
        "${SCRIPT_DIR}/stop.sh" ${service} > /dev/null 2>&1 &
        pids+=($!)
    done

    for pid in "${pids[@]}"; do
        wait ${pid}
    done

    print_color "${GREEN}" "✓ 所有服务已停止"
}

parallel_start() {
    print_color "${YELLOW}" "按批次并行启动服务..."
    echo ""

    local batch1=("LEAF" "USER" "RBAC")
    local batch2=("AUTH" "PRODUCT")
    local batch3=("ORDER" "PAYMENT" "SEARCH")
    local batch4=("BIZ" "MULTISHOP" "PLATFORM")
    local batch5=("GATEWAY")

    local batch_num=1

    for batch in "${batch1[@]}" "${batch2[@]}" "${batch3[@]}" "${batch4[@]}" "${batch5[@]}"; do
        print_color "${BLUE}" "启动批次 ${batch_num}: ${batch[*]}"
        local pids=()

        for service in "${batch[@]}"; do
            "${SCRIPT_DIR}/start.sh" ${service} > /dev/null 2>&1 &
            pids+=($!)
        done

        for pid in "${pids[@]}"; do
            wait ${pid}
        done

        echo ""
        ((batch_num++))
        sleep 1
    done
}

restart_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务重启脚本（串行）"
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

restart_parallel() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务重启脚本（并行）"
    print_color "${BLUE}" "========================================"
    echo ""

    print_color "${YELLOW}" "Step 1: 并行停止所有服务..."
    parallel_stop

    echo ""
    sleep 2

    print_color "${YELLOW}" "Step 2: 按批次并行启动服务..."
    echo ""
    parallel_start

    echo ""
    print_color "${GREEN}" "✓ 所有服务重启完成"
    print_color "${BLUE}" "请使用 ./status.sh 查看服务状态"
}

main() {
    if [ $# -eq 0 ]; then
        restart_all
    elif [ "$1" = "--parallel" ]; then
        restart_parallel
    else
        for service in "$@"; do
            restart_single ${service}
            echo ""
        done
    fi
}

main "$@"
