#!/bin/bash
set -e

cd /tests

npm install

npx playwright test --reporter=html --output=/report

echo "Playwright UI test completed"
