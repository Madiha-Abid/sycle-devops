pipeline {
  agent { dockerfile { dir 'backend' } }
  stages {
    stage('Build') {
        steps {
           RUN 'npm install'
        }
    }
  }
}
