pipeline {
  agent any

  triggers {
    githubPush()
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Joy-LJM/AutomationExercise.git'
      }
    }

    stage('Run JMeter Test') {
      steps {
        script {
          sh '''
            docker run --rm -v ${WORKSPACE}/tests:/tests jmeter-runner:latest \
              -n -t /tests/AutomationExercise_Test_Script.jmx \
              -l /tests/result.jtl \
              -e -o /tests/report
          '''
        }
      }
    }

    stage('Publish Report') {
      steps {
        publishHTML(target: [
          allowMissing: false,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'tests/report',
          reportFiles: 'index.html',
          reportName: 'JMeter Report'
        ])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'tests/report/**', allowEmptyArchive: true
    }
  }
}
