# Online Ticketing Platform - Microservices, Typescript, NATS, Docker, Kubernetes, Redis, CI-CD, Jest

This project is a comprehensive online ticketing platform built for learning purposes. 

It showcases a variety of modern technologies and best practices in software development, including Microservices architecture, Typescript, NATS messaging, Docker, Kubernetes, Redis, Continuous Integration and Continuous Deployment (CI/CD) configured to work with a Digital Ocean Kubernetes cluster, Jest for automated testing, and more.

## Project Overview

- **Microservices Architecture**: The project is designed using a microservices architecture to promote modularity and scalability, making it easier to manage different components of the system independently.

- **Kubernetes Orchestration**: Kubernetes is employed to deploy and manage the microservices, enhancing scalability, fault tolerance, and providing efficient load balancing using ingress-nginx.

- **Shared npm Package**: A shared npm package, `@bookmyseat/common`, has been created to centralize common code across services, improving maintainability and code reusability.

- **Jest for Testing**: Extensive automated testing is implemented using Jest, and tests are integrated into the CI/CD pipeline. This ensures high code quality and supports test-driven development practices.

- **Typescript for Strong Typing**: Typescript is used for strict typing, contributing to robust and maintainable code.

- **Docker Containers**: All services are containerized with Docker to ensure consistent environments and easy scalability across development, testing, and production environments.

- **Custom Error Handling**: Custom error handling mechanisms are incorporated to enhance the user experience by gracefully managing and reporting exceptions.

- **Version Control with Git**: Git is used for version control, enabling collaborative development and efficient code management.

## Kubernetes Cluster Configuration and Ingress-Nginx Setup

Before deploying this application, you need to configure your Kubernetes cluster and set up Ingress-Nginx for routing. Follow the steps below:

### Configure Kubernetes Cluster

1. Ensure you have a Kubernetes cluster set up and configured. If you're using Digital Ocean, you can follow the official documentation for creating a cluster: [Digital Ocean Kubernetes](https://try.digitalocean.com/kubernetes-in-minutes/).

### Install Ingress-Nginx

1. Install Ingress-Nginx by applying the following configuration file using the `kubectl` command:

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/do/deploy.yaml

2. This will set up Ingress-Nginx, which is crucial for routing and load balancing in your Kubernetes cluster. More details can be found in the [official Ingress-Nginx deployment documentation](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean).

3. By following these steps, you'll have your Kubernetes cluster ready and Ingress-Nginx set up for proper routing and load balancing.

### Secrets Configuration
Before deploying this application to your Kubernetes cluster, you need to set up the following secrets:

**JWT Secret:**

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=Your_JWTSecret
```

Replace Your_JWTSecret with your actual JWT secret key.

**Stripe Secret:**

```bash
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=Your_STRIPESecret
```

Replace Your_STRIPESecret with your actual Stripe secret key.

Make sure to set up these secrets to ensure the proper functioning of the application.

### GitHub Actions Setup for CI/CD
To enable CI/CD for this project using GitHub Actions, you need to define the following action secrets in your GitHub repository:

```bash
DIGITALOCEAN_ACCESS_TOKEN: Your Digital Ocean access token.

DIGITALOCEAN_CLUSTER_ID: The ID of your Digital Ocean Kubernetes cluster.

DOCKER_USERNAME: Your Docker Hub username.

DOCKER_PASSWORD: Your Docker Hub password.
``````
These secrets are essential for the CI/CD pipeline to work seamlessly with GitHub Actions. 

To add secrets to your repository:
1. Navigate to your repository on GitHub.
2. Go to the "Settings" tab, and select "Secrets" in the left sidebar. 
3. Add these secrets with their respective values.

## Getting Started
To run this project locally or deploy it in your environment, follow these steps:

Clone the repository: 
```bash
git clone https://github.com/alwinsimon/BookMySeat.git
```

1. Navigate to the project root directory.
2. Set up Kubernetes and Docker in your local environment.
3. Configure environment variables and secrets for services, including NATS, Redis, and other dependencies.
4. Deploy the services using Kubernetes manifests provided in the project.
5. Access the application via the defined ingress routes.

## Contributing
If you'd like to contribute to this project, feel free to create a pull request or open an issue. Your contributions are welcome, and together, we can improve this project further.

## License
This project is for learning purposes and does not carry any specific license. 

It is meant to be an educational resource and a demonstration of best practices in modern software development.

![GitHub](https://img.shields.io/badge/Visit%20on-GitHub-brightgreen)

[https://github.com/alwinsimon/BookMySeat](https://github.com/alwinsimon/BookMySeat)


***Happy coding !!!*** 🚀