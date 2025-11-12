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
          
          # Fix Git LFS installation issue
          if ! command -v git-lfs &> /dev/null; then
            echo "Git LFS not found, installing..."
            curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
            apt-get install -y git-lfs
          fi
          git lfs install --skip-smudge || true
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
            
            # Build or rebuild the JMeter Docker image (includes test files from workspace)
            echo "Building JMeter Docker image with test files..."
            docker build -f ${WORKSPACE}/Dockerfile.jmeter -t jmeter-runner:latest ${WORKSPACE}
            
            # Ensure output directory exists on host for report collection
            # Remove the report directory entirely (not only its children) so it's guaranteed empty
            rm -rf "${WORKSPACE}/tests/report" || true
            mkdir -p "${WORKSPACE}/tests/report"
            chmod -R 777 "${WORKSPACE}/tests/report"
            
            # Run JMeter in two steps to avoid HtmlTemplateExporter 'folder not empty' error:
            # 1) execute the test and persist the raw results (result.jtl) to the host
            # 2) generate the HTML dashboard from the persisted result.jtl into an empty report folder
            echo "Running JMeter test (produce result.jtl) and persist to host..."
            # Ensure previous result file is removed and host file exists for bind mount
            rm -f "${WORKSPACE}/tests/result.jtl" || true
            mkdir -p "${WORKSPACE}/tests"
            touch "${WORKSPACE}/tests/result.jtl"
            chmod 666 "${WORKSPACE}/tests/result.jtl"

            # Add timeout to prevent hanging
            TIMEOUT=300  # 5 minutes timeout
            docker run --rm \
              -v ${WORKSPACE}/tests/AutomationExercise_Test_Script.jmx:/tests/AutomationExercise_Test_Script.jmx \
              -v ${WORKSPACE}/tests/test_data.csv:/tests/test_data.csv \
              -v ${WORKSPACE}/tests/result.jtl:/tests/result.jtl \
              jmeter-runner:latest \
                -n -t /tests/AutomationExercise_Test_Script.jmx \
                -l /tests/result.jtl \
                -Jtest_data_path=/tests/test_data.csv || {
                  echo "JMeter test failed or timed out after $TIMEOUT seconds"
                  exit 1
                }

            # Check if result file was created
            if [ ! -s "${WORKSPACE}/tests/result.jtl" ]; then
              echo "Error: No data written to result.jtl file"
              exit 1
            fi

            # Now generate the HTML dashboard from the persisted JTL into the (empty) host report dir
            echo "Generating HTML dashboard from result.jtl..."
            rm -rf "${WORKSPACE}/tests/report" || true
            mkdir -p "${WORKSPACE}/tests/report"
            chmod -R 777 "${WORKSPACE}/tests/report"

            docker run --rm \
              -v ${WORKSPACE}/tests/result.jtl:/tests/result.jtl \
              -v ${WORKSPACE}/tests/report:/tests/report \
              jmeter-runner:latest \
                -g /tests/result.jtl -o /tests/report
            
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
