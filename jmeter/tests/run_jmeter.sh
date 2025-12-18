#!/bin/bash
set -e

cd /tests

# Run JMeter test script
jmeter -n -t /tests/Performance_Test_Script.jmx \
  -l /reports/results.jtl \
  -e -o /reports/html

# Check for failures
if [ -f /reports/results.jtl ]; then
  errors=$(grep -o 'success="false"' /reports/results.jtl | wc -l)
  if [ "$errors" -gt 0 ]; then
    echo "JMeter test failed with $errors errors"
    exit 1
  fi
fi

echo "JMeter test completed"
