# Vendure Docker Starter with PostgreSQL

![Vendure Logo](https://vendure.io/logo.svg)
![Vendure Admin UI](https://github.com/radiksen/my-vendure-starter-docker/blob/main/Screenshot%202025-06-18%20095857.png?raw=true)

This repository provides a ready-to-deploy Docker Compose setup for the Vendure e-commerce backend (API) with a PostgreSQL database. It's designed for simple setup on any Linux server with Docker.

---

## Table of Contents

1. Features  
2. Server Prerequisites  
3. Deployment Steps  
4. Accessing Vendure  
5. Stopping the Project  
6. Project Structure  
7. Troubleshooting  

---

## 1. Features

* Quick and automated deployment of Vendure API (backend) with Docker Compose.  
* Uses PostgreSQL as the database.  
* Automated installation of Node.js dependencies within Docker.  
* Automatic database migrations and superuser creation upon first run.  
* Flexible configuration via `.env` file for credentials.  
* Admin UI accessible via the Vendure server.  

---

## 2. Server Prerequisites

Ensure your server (e.g., Ubuntu, Debian, CentOS) has the following:

* **Git:**  
  ```bash
  sudo apt update && sudo apt install git
  ```
* **Docker Engine:**  
  [Official Installation Guide](https://docs.docker.com/engine/install/)  
  Make sure your user is in the `docker` group to run Docker commands without `sudo`:  
  ```bash
  sudo usermod -aG docker $USER
  ```  
  (requires re-login or new terminal session).  
* **Docker Compose:**  
  [Official Installation Guide](https://docs.docker.com/compose/install/)  
* **Open Ports:** Ensure port `3000` is open in your server's firewall (for Vendure API and Admin UI). For production, ensure ports `80` and `443` are open if you plan to add Nginx/Let's Encrypt later.  

---

## 3. Deployment Steps

Follow these steps to deploy Vendure on your server:

1. **Clone the Repository:**  
    ```bash
    cd ~ 
    git clone https://github.com/ВАШ_ЛОГИН/ВАШ_РЕПОЗИТОРИЙ.git vendure-instance
    ```  
    *Replace placeholders with your info.*

2. **Navigate to the project directory:**  
    ```bash
    cd vendure-instance
    ```

3. **Configure Environment Variables:**  
    Create a `.env` file based on `.env.example`.  
    ```bash
    nano .env
    ```  
    Paste and edit password:  
    ```
    VENDURE_DB_PASSWORD=your_secure_database_password
    ```  
    Save and exit editor (`Ctrl+O`, `Enter`, then `Ctrl+X`).

4. **Make the setup script executable:**  
    ```bash
    chmod +x start-vendure.sh
    ```

5. **Run the Deployment Script:**  
    ```bash
    ./start-vendure.sh
    ```  
    *Note:* First run takes time; script prompts for `VENDURE_DB_PASSWORD`.

---

## 4. Accessing Vendure

Once the setup script completes successfully:

* Vendure API (GraphQL Playground):  
  `http://YOUR_SERVER_IP_OR_DOMAIN:3000/shop-api`  
* Vendure Admin UI:  
  `http://YOUR_SERVER_IP_OR_DOMAIN:3000/admin`  
  * Default admin email: `superadmin@vendure.io`  
  * Password: `shopsecret`  

---

## 5. Stopping the Project

To stop and remove containers, networks, and volumes:  
```bash
docker-compose down --volumes
```

---

## 6. Project Structure

```
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
```

---

## 7. Troubleshooting

- **Error: Cannot connect to the Docker daemon:**  
  Ensure Docker Engine is running and your user is in the docker group.

- **Network needs recreation:**  
  Run `docker-compose down --volumes` first, then try `./start-vendure.sh` again.

- **Vendure dev-setup failures:**  
  Increase sleep time in `start-vendure.sh` (e.g., from 90 to 120 seconds).

- **Check container logs:**  
  ```bash
  docker-compose logs vendure
  ```

- **404 Not Found Admin UI:**  
  Ensure correct URL and port 3000 is open.

- **Connection refused or timeout:**  
  Check firewall ports.

---
