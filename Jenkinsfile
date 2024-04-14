pipeline {

    agent any

    tools{ nodejs 'node'}
    // agent {
    //     docker {
    //         image 'node:21-alpine'
    //         args '-p 3000:3000'
    //     }
        
    // }
    environment {
        CI = 'true' 
    }
    
    stages{
        // stage('Run Docker'){
        //     steps{
        //         // sh 'npm install'
        //         sh 'node --version'
        //     }
        // }
        stage('Build Node'){
            steps{
                sh 'npm install'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        // Define Docker build command
                        def dockerBuildCmd = "docker build -t devops-backend ."
                        // Execute Docker build
                        sh dockerBuildCmd
                    }
                }
            }
        }

        stage('Push Backend Docker Image to DockerHub'){
            steps{
                script{
                withCredentials([string(credentialsId: 'madihaabid', variable: 'dockerhubpwd')]) {
                   sh 'docker login -u madihaabid -p ${dockerhubpwd}'
                    }
                   sh 'docker push devops-backend'
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