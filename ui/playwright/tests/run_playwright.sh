#!/bin/bash
set -e

npm install

npx playwright test --reporter=html --output=/report

echo "Playwright UI test completed"
