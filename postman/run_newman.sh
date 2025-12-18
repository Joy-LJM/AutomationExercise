#!/bin/bash
set -e

mkdir -p reports/newman

docker run --rm \
  -v "$PWD/postman:/etc/newman" \
  -v "$PWD/reports/newman:/etc/newman/reports" \
  postman/newman:alpine \
  run AutomationExercise.postman_collection.json \
  -e AutomationExercise_environment.json \
  -r cli,html \
  --reporter-html-export /etc/newman/reports/newman-report.html

echo "âœ?Newman API tests completed"
