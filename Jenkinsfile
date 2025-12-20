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
        sh 'export WORKSPACE=$(pwd) && docker-compose down -v || true'
        sh 'mkdir -p reports/jmeter reports/newman reports/playwright'
      }
    }

    stage('Run JMeter Performance Tests') {
      steps {
        echo 'Running JMeter performance tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'docker-compose --env-file <(echo WORKSPACE=$WORKSPACE) run --rm jmeter'
        }
      }
    }

    stage('Run Newman API Tests') {
      steps {
        echo 'Running Newman API tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'docker-compose --env-file <(echo WORKSPACE=$WORKSPACE) run --rm newman'
        }
      }
    }

    stage('Run Playwright UI Tests') {
      steps {
        echo 'Running Playwright UI tests...'
        catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
          sh 'docker-compose --env-file <(echo WORKSPACE=$WORKSPACE) run --rm playwright'
        }
      }
    }

    stage('Debug') {
      steps {
        echo 'Debugging environment...'
        sh 'echo WORKSPACE=$WORKSPACE'
        sh 'ls -l $WORKSPACE/jmeter/tests'
        sh 'ls -l $WORKSPACE/postman'
        sh 'ls -l $WORKSPACE/ui/playwright/tests'
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
      sh 'export WORKSPACE=$(pwd) && docker-compose down || true'
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
