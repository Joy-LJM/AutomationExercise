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
            echo "Workspace contents:"
            ls -la "${WORKSPACE}/"
            echo ""
            echo "Tests directory contents:"
            ls -la "${WORKSPACE}/tests/" || echo "Tests directory does not exist!"
            echo ""
            
            if [ ! -f "${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx" ]; then
              echo "Error: JMeter test file not found at ${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx"
              echo "This file must be committed to the Git repository."
              exit 1
            fi
            
            # Ensure proper permissions on mounted volume
            echo "Setting up permissions for mounted volume..."
            chmod -R 777 "${WORKSPACE}/tests/"
            
            # Create report directory before running JMeter
            echo "Creating report directory..."
            mkdir -p "${WORKSPACE}/tests/report"
            chmod 777 "${WORKSPACE}/tests/report"
            
            # Create temp directory for JMeter with proper permissions
            echo "Creating temp directory for JMeter..."
            mkdir -p "${WORKSPACE}/tests/temp"
            chmod 777 "${WORKSPACE}/tests/temp"
            
            # Run JMeter test with explicit temp directory
            echo "Running JMeter test..."
            docker run --rm \
              -v ${WORKSPACE}/tests:/tests \
              -e JMETER_TEMP=/tests/temp \
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
