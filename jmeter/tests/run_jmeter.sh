#!/bin/bash
set -e

mkdir -p reports/jmeter

# 检查是否在容器内运行
if [ -f /.dockerenv ]; then
  echo "🐳 检测到容器环境，使用主机 Docker"
  # 获取主机 Docker 套接字路径（通常为 /var/run/docker.sock）
  DOCKER_HOST_SOCKET=$(find / -name docker.sock 2>/dev/null | head -n 1)
  if [ -z "$DOCKER_HOST_SOCKET" ]; then
    echo "❌ 错误：无法找到 Docker 套接字，请确保主机 Docker 正在运行"
    exit 1
  fi
  export DOCKER_HOST="unix://$DOCKER_HOST_SOCKET"
fi

docker run --rm -v "$PWD:/tests" \
  justb4/jmeter:5.6.2 \
  -n -t /tests/jmeter/tests/performance_test.jmx \
  -l /tests/reports/jmeter/results.jtl \
  -e -o /tests/reports/jmeter/html

# Fail if any failures exist
errors=$(grep -o 'success="false"' reports/jmeter/results.jtl | wc -l)
if [ "$errors" -gt 0 ]; then
  echo "❌ JMeter test failed with $errors errors"
  exit 1
fi

echo "✅ JMeter test completed"
