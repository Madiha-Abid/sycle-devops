pipeline {
    agent {
        docker {
            image 'test:test'
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

        stage('Build Docker Image') {
            steps {
                script {
                    // Define the Dockerfile directory
                    def dockerfilePath = "backend"
                    // Define Docker build command
                    def dockerBuildCmd = "docker build -t devops-backend:${BUILD_NUMBER} ${dockerfilePath}"
                    // Execute Docker build
                    sh dockerBuildCmd
                }
            }
        }
        

        // stage('Build Docker Images') {
        //     steps {
        //         script {
        //             // Define Docker Compose command to build images
        //             def dockerComposeBuild = "docker-compose build"
        //             // Execute Docker Compose build
        //             sh dockerComposeBuild
        //         }
        //     }
        // }

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