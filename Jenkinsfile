pipeline {
  agent any
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh '''ls -la
npm run tests'''
      }
    }
    stage('"Build"') {
      steps {
        sh '''#!/bin/bash
if [[ "$RANDOM % 10" -gt "5" ]]; then echo "false" && false; fi
echo $RANDOM >> my-dummy-artifact.txt'''
      }
    }
  }
}