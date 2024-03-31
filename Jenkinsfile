pipeline {
    agent {
        docker {
            // Use a Node.js-based Docker image with npm installed
            image 'node:latest'
        }
    }
    stages {
        stage('Install Dependencies') {
            steps {
                // Execute npm install
                sh 'npm install'
            }
        }
        // Add additional stages as needed
    }
}
