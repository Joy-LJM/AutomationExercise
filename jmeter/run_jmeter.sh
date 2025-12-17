#!/bin/bash
set -e

mkdir -p reports/jmeter

# Run JMeter
jmeter -n -t jmeter/Performance_Test_Script.jmx -l reports/jmeter/results.jtl -e -o reports/jmeter/html

# Fail build if any of the assertions failed (check for success="false" in JTL)
errors=$(grep -o 'success="false"' reports/jmeter/results.jtl | wc -l)
if [ "$errors" -gt 0 ]; then
  echo "JMeter test failed with $errors assertion errors"
  exit 1
fi

echo "JMeter test passed"
