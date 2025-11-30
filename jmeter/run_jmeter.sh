#!/bin/bash
set -e

mkdir -p reports/jmeter

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
