#!/bin/bash

# =================================================================
# Mall4Cloud 微服务启动脚本
# =================================================================
# 用法:
#   ./start.sh              - 启动所有服务
#   ./start.sh <服务名>      - 启动指定服务
# 示例:
#   ./start.sh              - 启动所有微服务
#   ./start.sh AUTH         - 只启动认证服务
#   ./start.sh GATEWAY      - 只启动网关服务
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

start_service() {
    local service_key=$1
    local service_config=${SERVICES[${service_key}]}

    if [ -z "${service_config}" ]; then
        print_color "${RED}" "错误: 未找到服务配置 [${service_key}]"
        return 1
    fi

    IFS=':' read -r jar_name port jvm_opts <<< "${service_config}"

    # 检查端口是否被占用
    if check_port ${port}; then
        print_color "${YELLOW}" "警告: 端口 ${port} 已被占用，跳过 [${service_key}]"
        return 0
    fi

    # 检查是否已经运行
    local current_pid=$(get_pid ${service_key})
    if [ -n "${current_pid}" ] && check_pid ${current_pid}; then
        print_color "${YELLOW}" "警告: [${service_key}] 已在运行 (PID: ${current_pid})，跳过"
        return 0
    fi

    # 检查JAR文件是否存在（按优先级查找多个目录）
    local jar_file=""
    local found_dir=""
    for dir in "${JAR_DIRS[@]}"; do
        if [ -f "${dir}/${jar_name}.jar" ]; then
            jar_file="${dir}/${jar_name}.jar"
            found_dir="${dir}"
            break
        fi
    done

    if [ -z "${jar_file}" ]; then
        print_color "${RED}" "错误: JAR文件不存在 [${jar_name}.jar]"
        echo ""
        echo "请将 JAR 文件放在以下目录之一："
        for dir in "${JAR_DIRS[@]}"; do
            echo "  - ${dir}/"
        done
        echo ""
        echo "当前搜索顺序："
        echo "  1. scripts/ 目录"
        echo "  2. scripts/apps/ 目录"
        echo "  3. scripts 的父目录"
        echo "  4. 父目录/apps/ 目录"
        return 1
    fi

    echo "  (找到JAR: ${jar_file})"

    # 创建日志文件
    touch "${LOG_DIR}/${service_key}.log" 2>/dev/null

    # 启动服务
    print_color "${BLUE}" "启动 [${service_key}] (端口: ${port})..."

    nohup java ${JAVA_OPTS} ${jvm_opts} -jar "${jar_file}" \
        --server.port=${port} \
        >> "${LOG_DIR}/${service_key}.log" 2>&1 &
    local new_pid=$!

    # 保存PID
    echo ${new_pid} > "${PID_DIR}/${service_key}.pid"

    # 等待服务启动
    local count=0
    local max_wait=${START_TIMEOUT}
    while [ $count -lt $max_wait ]; do
        # 检查进程是否存在
        if check_pid ${new_pid}; then
            # 检查端口是否开始监听
            if check_port ${port}; then
                print_color "${GREEN}" "✓ [${service_key}] 启动成功 (PID: ${new_pid})"
                return 0
            fi
        else
            print_color "${RED}" "✗ [${service_key}] 启动失败"
            cat "${LOG_DIR}/${service_key}.log" | tail -20
            rm -f "${PID_DIR}/${service_key}.pid"
            return 1
        fi

        sleep 1
        ((count++))
    done

    print_color "${YELLOW}" "! [${service_key}] 启动超时，但进程正在运行 (PID: ${new_pid})"
    return 0
}

start_all() {
    print_color "${BLUE}" "========================================"
    print_color "${BLUE}" "   Mall4Cloud 微服务启动脚本"
    print_color "${BLUE}" "========================================"
    echo ""

    local failed=0

    for service_key in "${SERVICE_ORDER[@]}"; do
        start_service ${service_key}
        if [ $? -ne 0 ]; then
            ((failed++))
        fi
        sleep 1
    done

    echo ""
    if [ $failed -eq 0 ]; then
        print_color "${GREEN}" "✓ 所有服务启动完成！"
        print_color "${BLUE}" "日志目录: ${LOG_DIR}"
    else
        print_color "${YELLOW}" "! 有 ${failed} 个服务启动失败，请检查日志"
    fi
}

start_single() {
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
    start_service ${service_key}
}

main() {
    # 创建必要的目录
    mkdir -p "${LOG_DIR}" "${PID_DIR}"
    # 同时创建可能存放 JAR 的 apps 子目录
    for dir in "${JAR_DIRS[@]}"; do
        if [ ! -d "${dir}" ]; then
            mkdir -p "${dir}" 2>/dev/null
        fi
    done

    if [ $# -eq 0 ]; then
        start_all
    else
        for service in "$@"; do
            start_single ${service}
        done
    fi
}

main "$@"
