pipline{
  agent any
  triggers {
        githubPush()  // Triggered automatically by GitHub webhook
    }
  environment {
        JMETER_HOME = "/usr/share/jmeter"
  }
  stages{
    stage('Checkout'){
      steps{
        git branch: 'main', url:'https://github.com/Joy-LJM/AutomationExercise.git'
      }
    }
    stage('Run Jmeter Test'){
      steps{
        script{
          sh '''
            docker run --rm -v $PWD:/tests justb4/jmeter \
            -n -t /tests/AutomationExercise_Test_Script.jmx -l /tests/result.jtl -e -o /tests/report
          '''
        }
      }
    }
    stage('Archive Results'){
      steps {
                archiveArtifacts artifacts: 'report/**', allowEmptyArchive: true
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'report',
                    reportFiles: 'index.html',
                    reportName: 'JMeter Report'
                ])
            }
    }
  }
}