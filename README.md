# Vendure Docker Starter with PostgreSQL

![Vendure Logo](https://vendure.io/logo.svg)

This repository provides a ready-to-deploy Docker Compose setup for the Vendure e-commerce backend (API) with a PostgreSQL database. It's designed for simple setup on any Linux server with Docker.

---

## **Table of Contents**

1.  [Features](#1-features)
2.  [Server Prerequisites](#2-server-prerequisites)
3.  [Deployment Steps](#3-deployment-steps)
4.  [Accessing Vendure](#4-accessing-vendure)
5.  [Stopping the Project](#5-stopping-the-project)
6.  [Project Structure](#6-project-structure)
7.  [Troubleshooting](#7-troubleshooting)

---

## **1. Features**

* Quick and automated deployment of Vendure API (backend) with Docker Compose.
* Uses PostgreSQL as the database.
* Automated installation of Node.js dependencies within Docker.
* Automatic database migrations and superuser creation upon first run.
* Flexible configuration via `.env` file for credentials.
* Admin UI accessible via the Vendure server.

---

## **2. Prerequisites**

Ensure your server (e.g., Ubuntu, Debian, CentOS) has the following:

* **Git:** `sudo apt update && sudo apt install git`
* **Docker Engine:** [Official Installation Guide](https://docs.docker.com/engine/install/)
    * Make sure your user is in the `docker` group to run Docker commands without `sudo`: `sudo usermod -aG docker $USER` (requires re-login or new terminal session).
* **Docker Compose:** [Official Installation Guide](https://docs.docker.com/compose/install/)
* **Open Ports:** Ensure port `3000` is open in your server's firewall (for Vendure API and Admin UI). For production, ensure ports `80` and `443` are open if you plan to add Nginx/Let's Encrypt later.

---

## **3. Deployment Steps**

Follow these steps to deploy Vendure on your server:

1.  **Clone the Repository:**
    ```bash
    # Go to your desired directory (e.g., home directory)
    cd ~ 

    # Clone the repository
    git clone [https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git](https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git) vendure-instance
    # IMPORTANT: Replace ВАШ_ЛОГИН with your GitHub username.
    # IMPORTANT: Replace ВАШ_РЕПОЗИТОРИЙ with your actual repository name (e.g., my-vendure-starter-docker).
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd vendure-instance
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file based on `.env.example`. This file will store your database and superadmin credentials.
    ```bash
    nano .env
    ```
    Paste the content below into `.env`, replacing the placeholder with a **STRONG, UNIQUE PASSWORD**:
    ```
    # Database password for Vendure and PostgreSQL. Choose a strong, unique password.
    VENDURE_DB_PASSWORD=your_secure_database_password
    ```
    * Save file: `Ctrl+O`, `Enter`.
    * Exit editor: `Ctrl+X`.

4.  **Make the setup script executable:**
    ```bash
    chmod +x start-vendure.sh
    ```

5.  **Run the Deployment Script:**
    This script will build the Vendure Docker image, start the PostgreSQL database and Vendure API containers, perform database migrations, and create the initial superuser.

    ```bash
    ./start-vendure.sh
    ```
    * **Note:** The first run will take significant time as it downloads base images, installs Node.js dependencies, and compiles Vendure.
    * The script will prompt you for the `VENDURE_DB_PASSWORD` (use the same password as in your `.env` file).
    * It will automatically handle waiting for services and running `dev-setup`.
    * If successful, it will output "Vendure setup complete!"

---

## **4. Accessing Vendure**

Once the `start-vendure.sh` script completes successfully:

* **Vendure API (GraphQL Playground):**
    Open your browser and navigate to: `http://YOUR_SERVER_IP_OR_DOMAIN:3000/shop-api`
* **Vendure Admin UI:**
    Open your browser and navigate to: `http://YOUR_SERVER_IP_OR_DOMAIN:3000/admin`
    * **Default Admin Credentials:**
        * Email: `superadmin@vendure.io`
        * Password: `shopsecret`
    *(These credentials are set in `src/vendure-config.ts` and can be customized via environment variables if needed.)*

---

## **5. Stopping the Project**

To stop and remove all running Docker containers, networks, and volumes for this project:

```bash
docker-compose down --volumes
6. Project Structure
my-vendure-starter-docker/
├── .env.example             # Example environment variables
├── docker-compose.yml       # Defines Docker services (Vendure API, PostgreSQL)
├── start-vendure.sh         # Script to automate setup, build, and run
├── docker/
│   └── vendure/             # Contains Vendure source code and Dockerfile
│       ├── .dockerignore        # Files to ignore during Docker build
│       ├── Dockerfile.vendure   # Dockerfile for building Vendure image
│       └── src/                 # Vendure application source code
│           └── vendure-config.ts # Main Vendure configuration file
│           └── ... (other Vendure source files)
7. Troubleshooting
Error: Cannot connect to the Docker daemon: Ensure Docker Engine is running and your user is in the docker group.
Network "..." needs to be recreated: Run docker-compose down --volumes first, then try ./start-vendure.sh again.
Error: Vendure dev-setup (migrations/superuser) failed. in script output:
This typically means Vendure or PostgreSQL were not fully ready. The script has a sleep 90 command. You can increase this value in start-vendure.sh (e.g., sleep 120 or 180).
Check container logs for detailed errors: docker-compose logs vendure.
404 Not Found for Admin UI: Ensure you are accessing http://YOUR_SERVER_IP_OR_DOMAIN:3000/admin. The Admin UI is loaded from a CDN. The Vendure API server is responsible for routing to it.
Connection refused or browser timeout: Ensure port 3000 is open in your server's firewall.
