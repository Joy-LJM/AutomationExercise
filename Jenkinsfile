pipeline {
  agent any
  triggers {
    githubPush()  // Triggered automatically by GitHub webhook
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url:'https://github.com/Joy-LJM/AutomationExercise.git'
      }
    }

    stage('Run Jmeter Test') {
      steps {
        script {
          sh '''
            echo "Current workspace: $WORKSPACE"
            echo "Files in tests directory:"
            ls -la $WORKSPACE/tests/
            
            # Use official Apache JMeter image
            docker run --rm \
              -v "$WORKSPACE/tests:/tests" \
              apache/jmeter:5.6.2 \
              -n -t /tests/AutomationExercise_Test_Script.jmx \
              -l /tests/result.jtl \
              -e -o /tests/report
          '''
        }
      }
    }
    stage('Archive Results') {
      steps {
        archiveArtifacts artifacts: 'tests/report/**', allowEmptyArchive: true
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
}
