pipeline {
  agent { dockerfile { dir 'backend' } }
  stages {
    stage('Build') {
        steps {
           sh 'npm install'
        }
    }
  }
}
