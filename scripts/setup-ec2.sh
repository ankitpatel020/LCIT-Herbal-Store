#!/bin/bash
set -e

echo "Updating system..."
sudo apt-get update -y
sudo apt-get install -y curl wget git

# Install K3s (disable Traefik)
if ! command -v k3s &> /dev/null; then
    echo "Installing K3s..."
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -
fi

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

echo "Installing Helm..."
if ! command -v helm &> /dev/null; then
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi

# Install Nginx Ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx || true
helm repo update

kubectl create namespace ingress-nginx --dry-run=client -o yaml | kubectl apply -f -

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

# Install cert-manager
helm repo add jetstack https://charts.jetstack.io || true
helm repo update

kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

if ! helm list -n cert-manager | grep -q cert-manager; then
    helm install cert-manager jetstack/cert-manager \
      --namespace cert-manager \
      --set installCRDs=true
fi

echo "Waiting for cert-manager..."
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/instance=cert-manager \
  --timeout=300s

echo "✅ Cluster setup complete."
echo "⚠️ Ensure ports 80 and 443 are open in EC2 security group."