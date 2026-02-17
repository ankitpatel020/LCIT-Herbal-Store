# Deployment Guide

This repository is configured for automated deployment to an EC2 instance running Kubernetes via GitHub Actions.

## Prerequisites

1.  **EC2 Instance**: An Ubuntu 22.04 or similar instance is recommended.
2.  **Docker Hub Account**: You need a Docker Hub account to store your container images.
3.  **GitHub Secrets**: Set the following secrets in your repository settings (Settings -> Secrets and variables -> Actions):

    | Secret Name | Description | Example |
    | :--- | :--- | :--- |
    | `DOCKER_USERNAME` | Your Docker Hub username | `ankitpatel020` |
    | `DOCKER_PASSWORD` | Your Docker Hub password or access token | `dckr_pat_...` |
    | `EC2_HOST` | Public IP or DNS of your EC2 instance | `1.2.3.4` |
    | `EC2_USER` | SSH username for EC2 (usually `ubuntu`) | `ubuntu` |
    | `EC2_SSH_KEY` | Private SSH key for EC2 (contents of `.pem` file) | `-----BEGIN RSA PRIVATE KEY-----...` |

## Setup Steps

### 1. Preparing the EC2 Instance

Connect to your EC2 instance and run the setup script to install Docker, K3s (Kubernetes), and Nginx Ingress Controller.

```bash
# Copy script to server (or git clone if repo is private/public)
scp -i path/to/key.pem scripts/setup-ec2.sh ubuntu@your-ec2-ip:~/

# SSH into server
ssh -i path/to/key.pem ubuntu@your-ec2-ip

# Run the setup script
chmod +x setup-ec2.sh
./setup-ec2.sh
```

### 2. Configure Secrets on Kubernetes

Modify `k8s/secrets.yaml` with your real production secrets (e.g., MongoDB password) and apply it manually on the server once, OR ensure you have a secure way to manage secrets.

**Important:** The `k8s/secrets.yaml` file in this repo contains a placeholder password. **Do not use this in production.**

To update secrets on the server:

```bash
# On the EC2 instance
nano ~/app/k8s/secrets.yaml
# Edit the base64 encoded values or use stringData as provided
kubectl apply -f ~/app/k8s/secrets.yaml
```

### 3. Deploy

Push your changes to the `main` branch. GitHub Actions will automatically:

1.  Build Docker images for Frontend and Backend.
2.  Push them to Docker Hub.
3.  Connect to your EC2 instance.
4.  Apply the Kubernetes manifests in `k8s/` folder.
5.  Restart deployments to pull new images.

## Troubleshooting

-   **Check Pod Status:** `kubectl get pods`
-   **Check Logs:** `kubectl logs -f <pod-name>`
-   **Check Ingress:** `kubectl get ingress`
-   **Access Mongo Express:** Navigate to `http://your-ec2-ip/mongo-express` (if Ingress is configured correctly for that path).
