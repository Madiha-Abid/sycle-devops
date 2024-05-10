pipeline {

    agent any

    tools{ nodejs 'node'}

    environment {
        CI = 'true' 
    }
    
    stages{
        stage('Build Node'){
            steps{
                sh 'npm install'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        def dockerBuildCmd = "docker build -t madihaabid/devops-backend ."
                        sh dockerBuildCmd
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        def dockerBuildCmd = "docker build -t madihaabid/devops-frontend ."
                        sh dockerBuildCmd
                    }
                }
            }
        }

        stage('Test') {
            // steps {
            //     sh './jenkins/scripts/test.sh'
            // }
            dir('jenkins') {
                    script {
                        def runTest = './scripts/test.sh'
                        sh runTest
                    }
                }
        }

        stage('Push Backend Docker Image to DockerHub'){
            steps{
                script{
                withCredentials([string(credentialsId: 'madihaabid', variable: 'dockerhubpwd')]) {
                   sh 'docker login -u madihaabid -p ${dockerhubpwd}'
                    }
                   sh 'docker push madihaabid/devops-backend'
                }
            }
        }

        stage('Push Frontend Docker Image to DockerHub'){
            steps{
                script{
                withCredentials([string(credentialsId: 'madihaabid', variable: 'dockerhubpwd')]) {
                   sh 'docker login -u madihaabid -p ${dockerhubpwd}'
                    }
                   sh 'docker push madihaabid/devops-frontend'
                }
            }
        }

        stage('Deploy to k8s'){
            steps{
                script{
                    kubernetesDeploy (configs: 'deploymentservice.yaml',kubeconfigId: 'k8configpwd')
                }
            }
        }

    }
}
