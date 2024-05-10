terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "~> 2.14.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "sycle" {
  metadata {
    name = "example-namespace"
  }
}

resource "kubernetes_deployment" "spring_boot_k8s_deployment" {
  metadata {
    name      = "spring-boot-k8s-deployment-devops"
    namespace = kubernetes_namespace.sycle.metadata[0].name
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "spring-boot-k8s"
      }
    }

    template {
      metadata {
        labels = {
          app = "spring-boot-k8s"
        }
      }

      spec {
        container {
          name  = "spring-boot-k8s-backend"
          image = "madihaabid/devops-backend"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 3005
          }
        }

        container {
          name  = "spring-boot-k8s-frontend"
          image = "madihaabid/devops-frontend"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 5173
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "spring_boot_k8s_service" {
  metadata {
    name      = "springboot-k8ssvc"
    namespace = kubernetes_namespace.sycle.metadata[0].name
  }

  spec {
    selector = {
      app = "spring-boot-k8s"
    }

    port {
      name       = "backend-port"
      protocol   = "TCP"
      port       = 3005
      target_port = 3005
    }

    port {
      name       = "frontend-port"
      protocol   = "TCP"
      port       = 5173
      target_port = 5173
    }

    type = "NodePort"
  }
}
