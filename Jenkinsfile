pipeline {

     agent any

    tools {nodejs "nodejs"}
    
    stages {
        stage('Build') {
            steps {
               dir('/backend') {
                    // Run npm install to install dependencies
                    sh 'npm install'
                    // Execute any backend-specific build steps here
                }
            }
        }
    }
}
