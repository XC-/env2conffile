pipeline {
  agent any
  triggers { pollSCM('* * * * *') }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh '''ls -la
npm run tests
ls -la'''
      }
    }
    stage('"Build"') {
      steps {
        sh '''ls -la
if [ $(shuf -i 1-10 -n 1) -gt "5" ]; then echo "false" && false; fi
echo $RANDOM >> my-dummy-artifact.txt'''
      }
    }
  }
  post {
    always {
      junit 'test-results.xml'
    }
  }
}
