pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 1, unit: 'HOURS')
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out code...'
        checkout scm
      }
    }

    stage('Setup') {
      steps {
        echo 'Setting up environment...'
        sh 'WORKSPACE=${WORKSPACE:-.} docker-compose down -v || true'
        sh 'mkdir -p reports/jmeter reports/newman reports/playwright'
      }
    }

    stage('Run JMeter Performance Tests') {
      steps {
        echo 'Running JMeter performance tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'WORKSPACE=${WORKSPACE:-.} docker-compose run --rm jmeter'
        }
      }
    }

    stage('Run Newman API Tests') {
      steps {
        echo 'Running Newman API tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'WORKSPACE=${WORKSPACE:-.} docker-compose run --rm newman'
        }
      }
    }

    stage('Run Playwright UI Tests') {
      steps {
        echo 'Running Playwright UI tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'WORKSPACE=${WORKSPACE:-.} docker-compose run --rm playwright'
        }
      }
    }

    stage('Archive Reports') {
      steps {
        echo 'Archiving test reports...'
        archiveArtifacts artifacts: 'reports/**/*', 
                         allowEmptyArchive: true,
                         fingerprint: true
      }
    }
  }

  post {
    always {
      echo 'Cleaning up containers...'
      sh 'WORKSPACE=${WORKSPACE:-.} docker-compose down || true'
    }

    success {
      echo 'All tests passed!'
    }

    unstable {
      echo 'Some tests failed or were unstable'
    }

    failure {
      echo 'Pipeline failed!'
    }
  }
}
