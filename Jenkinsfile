pipeline {
    agent {
        docker {
            image 'node:21-alpine'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'true' 
    }
    
    stages{
        stage('Run Docker'){
            steps{
                // sh 'npm install'
                sh 'node --version'
            }
        }
    }
    // stages {
    //      stage('Initialize'){
    //         steps{
    //             def dockerHome = tool 'Docker'
    //             env.PATH = "${dockerHome}/bin:${env.PATH}"
    //         }
    //     }

    //     stage('Build and Start Containers') {
    //         steps {
    //             sh 'docker --version'
    //         }
    //     }
    // }
}

// pipeline {
//     agent any
//     tools {nodejs "node"}
//     stages {
//         stage('Build') { 
//             steps {
//                 sh 'npm install' 
//             }
//         }
//     }
// }