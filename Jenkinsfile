pipeline {
  agent any

  stages {
    stage('Run JMeter') {
      steps {
        sh "docker compose run --rm jmeter"
      }
    }

    stage('Run Newman API Tests') {
      steps {
        sh "docker compose run --rm newman"
      }
    }

    stage('Run Playwright UI Tests') {
      steps {
        sh "docker compose run --rm playwright"
      }
    }

    stage('Archive Reports') {
      steps {
        archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
      }
    }
  }
}
