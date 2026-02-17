#!/bin/bash
set -e

echo "Updating system..."
sudo apt-get update -y

echo "Installing dependencies..."
sudo apt-get install -y curl wget git

# Install K3s (disable Traefik)
if ! command -v k3s &> /dev/null
then
    echo "Installing K3s..."
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -

    mkdir -p ~/.kube
    sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
    sudo chown $USER:$USER ~/.kube/config
    chmod 600 ~/.kube/config

    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
else
    echo "K3s already installed."
fi

# Install Helm
if ! command -v helm &> /dev/null
then
    echo "Installing Helm..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
else
    echo "Helm already installed."
fi

# Install Nginx Ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

kubectl create namespace ingress-nginx || true

if ! helm list -n ingress-nginx | grep -q ingress-nginx; then
    helm install ingress-nginx ingress-nginx/ingress-nginx \
      --namespace ingress-nginx \
      --set controller.service.type=LoadBalancer \
      --set controller.publishService.enabled=true
fi

echo "Waiting for ingress..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=ingress-nginx \
  --timeout=300s

echo "Setup complete."
