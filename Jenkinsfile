pipeline {
  agent any
  triggers {
    githubPush()
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
            # Ensure wget and tar exist
            apt-get update && apt-get install -y wget tar
            
            # Download JMeter if not exists
            if [ ! -d "apache-jmeter-5.6.2" ]; then
              echo "Downloading JMeter..."
              wget -q https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.2.tgz
              tar -xzf apache-jmeter-5.6.2.tgz
              rm apache-jmeter-5.6.2.tgz
            fi

            mkdir -p tests/report

            echo "Starting JMeter test..."
            ./apache-jmeter-5.6.2/bin/jmeter -n -t tests/AutomationExercise_Test_Script.jmx -l tests/result.jtl -e -o tests/report
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
  
  post {
    always {
      script {
        // Always show test results
        sh 'ls -la tests/ || true'
      }
    }
  }
}