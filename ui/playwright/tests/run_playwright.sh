#!/bin/bash
set -e

mkdir -p reports/playwright

docker run --rm -v "$PWD/ui/playwright:/work" -w /work \
  mcr.microsoft.com/playwright:v1.45.1-jammy \
  bash -c "npm install && npx playwright test --reporter=html --output=../../reports/playwright"

echo "✅ Playwright UI test completed"
