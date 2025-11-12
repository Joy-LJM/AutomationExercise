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
            # Verify test file exists in Jenkins workspace
            echo "Checking for JMeter test file in workspace..."
            if [ ! -f "${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx" ]; then
              echo "Error: JMeter test file not found at ${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx"
              ls -la "${WORKSPACE}/tests/"
              exit 1
            fi
            
            # Fix permissions before running test
            echo "Fixing file permissions..."
            chown -R jenkins:jenkins "${WORKSPACE}/tests/"
            chmod -R 755 "${WORKSPACE}/tests/"
            
            # Run JMeter test with user and group mapping
            echo "Running JMeter test with explicit user mapping..."
            docker run --rm \
              -v ${WORKSPACE}/tests:/tests \
              -u $(id -u jenkins):$(id -g jenkins) \
              jmeter-runner:latest \
                -n -t /tests/AutomationExercise_Test_Script.jmx \
                -l /tests/result.jtl \
                -e -o /tests/report
            
            # Verify report was generated
            if [ ! -d "${WORKSPACE}/tests/report" ]; then
              echo "Error: JMeter report not generated"
              exit 1
            fi
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
