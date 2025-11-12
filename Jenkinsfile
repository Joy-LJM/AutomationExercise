pipeline {
  agent any

  triggers {
    githubPush()
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Joy-LJM/AutomationExercise.git'
        
        // Ensure tests directory files are present
        sh '''
          echo "=== Git checkout complete ===" 
          ls -la ${WORKSPACE}/tests/ || echo "tests directory not found!"
          git lfs install || true
          git lfs pull || true
        '''
      }
    }

    stage('Run JMeter Test') {
      steps {
        script {
          sh '''
            # Debug: Show everything in workspace
            echo "=== WORKSPACE CONTENTS ==="
            find ${WORKSPACE} -type f -name "*.jmx" 2>/dev/null || echo "No jmx files found in workspace"
            find ${WORKSPACE} -type f -name "*.csv" 2>/dev/null || echo "No csv files found in workspace"
            
            echo ""
            echo "=== JENKINS WORKSPACE DIR ==="
            ls -la "${WORKSPACE}/" | head -15
            
            echo ""
            echo "=== TESTS DIRECTORY ==="
            if [ -d "${WORKSPACE}/tests" ]; then
              ls -la "${WORKSPACE}/tests/"
            else
              echo "ERROR: tests directory does not exist!"
              exit 1
            fi
            
            # Check if test files exist - if not, error out clearly
            if [ ! -f "${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx" ]; then
              echo ""
              echo "======================================"
              echo "ERROR: Test file missing!"
              echo "======================================"
              echo "The file AutomationExercise_Test_Script.jmx was not checked out from Git."
              echo "This likely indicates a Git checkout or workspace issue."
              echo "Workspace location: ${WORKSPACE}"
              echo "Expected file: ${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx"
              exit 1
            fi
            
            echo ""
            echo "Test file found. Proceeding with JMeter test..."
            
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
