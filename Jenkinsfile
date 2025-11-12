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
            # Debug: Show everything in workspace
            echo "=== WORKSPACE CONTENTS ==="
            find ${WORKSPACE} -type f -name "*.jmx" -o -name "*.csv" | head -20
            
            echo ""
            echo "=== JENKINS HOME CONTENTS ==="
            ls -la /var/jenkins_home/workspace/
            
            echo ""
            echo "=== WORKSPACE/TESTS CONTENTS ==="
            ls -la "${WORKSPACE}/tests/" 2>/dev/null || echo "tests directory not found!"
            
            # Verify test file exists in Jenkins workspace
            echo ""
            echo "Checking for JMeter test file in workspace..."
            
            if [ ! -f "${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx" ]; then
              echo "ERROR: JMeter test file NOT found at ${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx"
              exit 1
            fi
            
            # Build or rebuild the JMeter Docker image
            echo "Building JMeter Docker image..."
            docker build -f ${WORKSPACE}/Dockerfile.jmeter -t jmeter-runner:latest ${WORKSPACE}
            
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
            
            # Debug: List files in mounted volume before running JMeter
            echo "Files in the mounted volume directory:"
            docker run --rm -v ${WORKSPACE}/tests:/tests alpine:latest ls -la /tests/
            
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
