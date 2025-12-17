# AutomationExercise QA Project

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#) [![Test Coverage](https://img.shields.io/badge/coverage-e--commerce%20platform-blue)](#) [![License](https://img.shields.io/badge/license-MIT-green)](#)

A comprehensive **QA automation project** demonstrating full-stack testing practices for e-commerce platforms, including **performance testing**, **UI automation**, **CI/CD integration**, and **QA strategy documentation** for industrial robotics environments.

## 📋 Project Overview

This project showcases key QA skills required for the **Software QA Specialist Intern** position at Lincoln Electric:
- **Automated UI Testing** with Playwright (coded-UI tests for web applications)
- **Performance & Load Testing** with Apache JMeter
- **CI/CD Pipeline** with Jenkins (declarative pipeline, automated reporting)
- **Test Automation** across multiple test levels (functional, performance, regression)
- **QA Strategy & Documentation** for robotics software (hardware-in-the-loop, simulation-based testing)

### What This Demonstrates
✅ **CI/CD & YAML Pipelines** - Jenkins declarative pipeline with automated test execution  
✅ **Coded-UI Tests** - Playwright tests for web application workflows  
✅ **Automated Testing** - JMeter performance tests with parameterized data  
✅ **Test Reporting** - HTML reports, JUnit XML output, automated publishing  
✅ **QA Process Knowledge** - Multi-level testing strategy (unit, integration, HIL, simulation)  
✅ **Domain Expertise** - Hardware-in-the-loop and robotics software testing approaches  

---

## 🏗️ Project Structure

```
AutomationExercise/
├── ci/jenkins/
│   └── Jenkinsfile                      # Complete declarative pipeline
├── jmeter/
│   ├── Performance_Test_Script.jmx      # Load test scenario
│   ├── run_jmeter.sh                    # JMeter execution script
│   └── data/
│       └── test_data.csv                # Parameterized test data
├── ui/playwright/
│   ├── tests/
│   │   └── login.spec.ts                # E2E UI test suite
│   ├── package.json                     # Node dependencies
│   └── playwright.config.ts             # Playwright configuration
├── reports/                             # Generated test reports
├── docker-compose.yml                   # Local environment setup
├── Dockerfile.jenkins                   # Jenkins Docker image
├── QA_STRATEGY.md                       # Hardware QA approach document
└── README.md                            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (for Playwright tests)
- **Java 8+** (for JMeter)
- **Apache JMeter** installed and in PATH
- **Docker & Docker Compose** (optional, for containerized testing)

### Local Setup

#### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Joy-LJM/AutomationExercise.git
cd AutomationExercise
```

#### 2. Run Playwright UI Tests
```bash
cd ui/playwright
npm ci
npx playwright install --with-deps chromium
npm test
```

**Run tests in headed mode (see browser actions):**
```bash
npm run test:headed
```

**View test report:**
```bash
npm run test:report
```

#### 3. Run JMeter Performance Tests
```bash
chmod +x jmeter/run_jmeter.sh
./jmeter/run_jmeter.sh
```

Test results will be generated in:
- `reports/jmeter/html/index.html` - JMeter HTML report
- `reports/jmeter/results.jtl` - Raw test results (JTL format)

#### 4. Run Jenkins Pipeline (Local)
Using Docker Compose:
```bash
docker-compose up --build jenkins
```

Then:
1. Open http://localhost:8080
2. Create a new Pipeline job
3. Point to this repository and `ci/jenkins/Jenkinsfile`
4. Run the pipeline

---

## 📊 Test Suites

### Playwright UI Tests (`ui/playwright/tests/`)
Comprehensive end-to-end tests for the AutomationExercise e-commerce platform:

| Test Name | Scenario | Status |
|-----------|----------|--------|
| Home Page Navigation | Verify page loads and logo displays | ✓ |
| Products Page | Display all products | ✓ |
| Add to Cart | Add product to shopping cart | ✓ |
| View Cart | Verify items in cart | ✓ |
| Checkout Flow | Proceed to checkout | ✓ |
| Product Search | Search for products by name | ✓ |
| Product Details | View detailed product information | ✓ |
| Product Review | Submit product review | ✓ |

**Run specific test:**
```bash
cd ui/playwright
npx playwright test login.spec.ts
```

**Run tests in debug mode:**
```bash
npm run test:debug
```

### JMeter Performance Tests (`jmeter/Performance_Test_Script.jmx`)
Load testing scenario simulating real e-commerce user flows:

- **3 concurrent threads** simulating customer activity
- **CSV-driven test data** with 10-second ramp-up time
- **End-to-end workflow**: Browse → Add to Cart → Checkout
- **Response assertions** validating expected page content
- **Performance metrics**: Response time, latency, throughput, error rate

**Test Scenario Flow:**
```
1. Navigate to Home Page
2. Browse Product Page
3. Add Product to Cart (parameterized from CSV)
4. View Shopping Cart
5. Validate Product in Cart
6. Proceed to Checkout
```

**Generate JMeter report with trends:**
```bash
cd jmeter
chmod +x run_jmeter.sh
./run_jmeter.sh
```

---

## 🔄 CI/CD Pipeline

### Jenkins Pipeline Stages

The `ci/jenkins/Jenkinsfile` implements a complete automated test pipeline:

```
Checkout → Setup → JMeter Tests → Playwright Tests → Archive Artifacts
```

#### Stage Breakdown

| Stage | Purpose | Output |
|-------|---------|--------|
| **Checkout** | Clone repository | Repository code |
| **Setup** | Create report directories | Directory structure |
| **JMeter Performance Tests** | Load & performance testing | JMeter HTML report |
| **Playwright UI Tests** | Functional UI testing | JUnit XML, Playwright HTML |
| **Archive Artifacts** | Publish test results | Jenkins artifacts store |

#### Jenkins Features
- ✅ Parallel-safe test execution
- ✅ Automatic retry on transient failures (2 retries in CI)
- ✅ HTML & JUnit report publishing
- ✅ Artifact archival for audit trail
- ✅ Build status notifications on success/failure

### Running the Pipeline

**Option A: Docker Compose (Local)**
```bash
docker-compose up --build jenkins
# Access at http://localhost:8080
# Create pipeline job, link to Jenkinsfile, run
```

**Option B: Existing Jenkins Server**
1. Create new **Pipeline** job in Jenkins
2. Configure to pull from this Git repository
3. Set pipeline script path: `ci/jenkins/Jenkinsfile`
4. Trigger manually or via webhook on commit

---

## 🎯 Key QA Concepts Demonstrated

### 1. **Test Pyramid**
- **Unit Tests**: API endpoint validation (JMeter assertions)
- **Integration Tests**: Multi-component flows (e-commerce workflow)
- **End-to-End Tests**: Full user journeys (Playwright)

### 2. **Test Levels**
- **Smoke Testing**: Quick sanity checks (page loads, links accessible)
- **Functional Testing**: Feature verification (add to cart works)
- **Regression Testing**: Automated suite runs on every commit
- **Performance Testing**: Load & stress testing (JMeter)

### 3. **Test Data Management**
Parameterized test data in `jmeter/data/test_data.csv`:
```csv
product_id,product_name,email,password
1,Blue Top,test@example.com,password123
5,White Shirt,user@test.com,Test@1234
```

### 4. **Continuous Integration**
- Tests run automatically on code changes
- Failures block deployment
- Reports archived for compliance/audit
- Metrics tracked over time

### 5. **Hardware QA Strategy** *(for robotics focus)*
See [QA_STRATEGY.md](./QA_STRATEGY.md) for comprehensive coverage of:
- **Hardware-in-the-Loop (HIL)** testing approach
- **Simulation-based** testing with digital twins
- **Safety validation** for industrial robots (ABB, Fanuc)
- **Real-time performance** metrics for robot control
- **Test automation** for robotics environments

---

## 📈 Test Reports

### Accessing Reports

**After running Playwright tests:**
```bash
cd ui/playwright
npm run test:report
```
Opens interactive Playwright test report in browser.

**After running JMeter tests:**
```
reports/jmeter/html/index.html
```
Contains detailed graphs and statistics.

**Jenkins Build Reports:**
1. Navigate to Jenkins job
2. Click on specific build
3. View "JMeter Performance Report" and "Playwright HTML Report" links

### Report Contents
- Test execution timeline
- Pass/fail status per test
- Response time graphs
- Error screenshots (on failures)
- Performance percentiles (p50, p90, p95, p99)

---

## 🔧 Configuration

### Playwright Config (`ui/playwright/playwright.config.ts`)
- **Base URL**: https://automationexercise.com
- **Browser**: Chromium
- **Reporters**: List, JUnit, HTML
- **Retries**: 2 (in CI), 0 (local)
- **Workers**: 1 (in CI), parallel (local)
- **Screenshots**: On failure only
- **Traces**: On first retry (for debugging)

### JMeter Config (`jmeter/Performance_Test_Script.jmx`)
- **Threads**: 3 concurrent users
- **Ramp-up**: 10 seconds
- **Domain**: automationexercise.com (HTTPS)
- **Assertions**: Response content validation
- **Metrics**: Response time, latency, throughput

### Jenkins Config (`ci/jenkins/Jenkinsfile`)
- **Agent**: Any (adapt to your setup)
- **Timeout**: None (configure as needed)
- **Retry**: Unstable builds retry stages
- **Post Actions**: Always run post blocks

---

## 🐳 Docker Setup

Build and run Jenkins with test environment:

```bash
# Start Jenkins service
docker-compose up -d jenkins

# View logs
docker-compose logs -f jenkins

# Stop services
docker-compose down
```

Access Jenkins at: http://localhost:8080

**Initial admin password:**
```bash
docker-compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 📝 Test Data

### CSV Format for JMeter (`jmeter/data/test_data.csv`)
```csv
product_id,product_name,email,password
1,Blue Top,test1@example.com,password123
5,White Shirt,test2@example.com,password456
...
```

Add new test data rows to expand the test scenarios. JMeter will iterate through all rows with concurrent threads.

---

## 🐛 Troubleshooting

### Issue: JMeter test fails with "connection refused"
**Solution**: Ensure automationexercise.com is accessible from your network
```bash
ping automationexercise.com
```

### Issue: Playwright tests timeout
**Solution**: Increase timeout in `playwright.config.ts`:
```typescript
use: {
  navigationTimeout: 30000,  // Increase from default
  actionTimeout: 10000,
}
```

### Issue: Jenkins job can't find Node.js
**Solution**: Install Node on Jenkins agent or use Docker agent:
```groovy
agent {
  docker { image 'node:18-alpine' }
}
```

### Issue: Reports not archiving in Jenkins
**Solution**: Verify report paths in `Jenkinsfile` match actual output locations:
```bash
ls -la reports/jmeter/
ls -la reports/playwright/
```

---


## 📄 License

MIT

## 👤 Author

Developed by: **Joy-LJM**  
Repository: [AutomationExercise](https://github.com/Joy-LJM/AutomationExercise)

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [QA_STRATEGY.md](./QA_STRATEGY.md) for QA concepts
3. Open an issue on GitHub

---

**Last Updated**: December 2025  
**Status**: ✅ Production Ready
