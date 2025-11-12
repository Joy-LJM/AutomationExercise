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
            
            # Ensure proper permissions on host files
            echo "Setting up permissions..."
            chmod -R 777 "${WORKSPACE}/tests/"
            
            # Create report and temp directories  
            mkdir -p "${WORKSPACE}/tests/report" "${WORKSPACE}/tests/temp"
            chmod -R 777 "${WORKSPACE}/tests/report" "${WORKSPACE}/tests/temp"
            
            # Run JMeter with properly mounted volume using --mount syntax
            echo "Running JMeter test..."
            docker run --rm \
              --mount type=bind,source=${WORKSPACE}/tests,target=/tests \
              --entrypoint sh \
              -e JMETER_TEMP=/tests/temp \
              jmeter-runner:latest \
              -c "
                echo 'Files in /tests:'
                ls -la /tests/
                echo ''
                echo 'Running JMeter...'
                cd /tests
                mkdir -p report temp
                jmeter -j - -L INFO -n -t AutomationExercise_Test_Script.jmx -l result.jtl -e -o report
              "
            
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
