# Vendure Docker Starter with PostgreSQL

![Vendure Logo](https://vendure.io/logo.svg)

This repository provides a complete Docker Compose setup for quickly deploying a Vendure e-commerce backend (API) with a PostgreSQL database. It's designed for easy launch in both local development environments and can be adapted for production.

---

## **Table of Contents**

1.  [Features](#1-features)
2.  [Prerequisites](#2-prerequisites)
3.  [Getting Started: Initial Setup & File Generation](#3-getting-started-initial-setup--file-generation)
4.  [Configuring Vendure for Docker Compose](#4-configuring-vendure-for-docker-compose)
5.  [Running the Project](#5-running-the-project)
6.  [Accessing Vendure](#6-accessing-vendure)
7.  [Stopping the Project](#7-stopping-the-project)
8.  [Project Structure](#8-project-structure)
9.  [Troubleshooting](#9-troubleshooting)

---

## **1. Features**

* Quick startup of Vendure API (backend) using Docker Compose.
* Utilizes PostgreSQL as the database.
* Automated installation of all Node.js dependencies within the Docker build.
* Automated database migrations and superuser creation.
* Flexible configuration via `.env` file (passwords, DB settings).
* Admin UI accessible via the Vendure server.

---

## **2. Prerequisites**

Before proceeding, ensure your system has the following components installed and configured:

* **Git:** For cloning the repository.
    * `sudo apt update && sudo apt install git`
* **Docker Desktop (for Windows with WSL2)**: Ensure Docker Desktop is installed on your Windows machine and fully integrated with your WSL2 Ubuntu distribution.
    * Verify Docker status in WSL: `docker ps` (should run without errors).
* **Node.js and npm (in your WSL Ubuntu environment):** Necessary for the initial Vendure project file generation.
    * Install NVM (Node Version Manager) if you don't have it:
        `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
        **(After NVM installation, close and re-open your WSL terminal).**
    * Install the latest LTS version of Node.js: `nvm install --lts && nvm use --lts`

---

## **3. Getting Started: Initial Setup & File Generation**

This is the **CRUCIAL** step to get the Vendure project files. We use `npx @vendure/create .` and instruct it to use **SQLite** initially, which reliably generates the project files without external database connection issues.

1.  **Clean up and prepare the project directory:**

    ```bash
    # Go to home directory
    cd ~

    # Remove any previous Vendure project (BE CAREFUL, ensures a clean slate)
    rm -rf vendure-docker-starter

    # Create the root directory for your new Vendure project
    mkdir vendure-docker-starter

    # Navigate into the project directory
    cd vendure-docker-starter

    # Create subdirectory for Vendure source and Dockerfile
    mkdir -p docker/vendure
    ```

2.  **Prepare Docker Desktop (CRITICAL for this step):**
    * **Completely stop Docker Desktop on your Windows machine.** (Right-click Docker icon in system tray -> "Quit Docker Desktop"). This is vital to prevent `npx` from attempting to use Docker for its internal DB.
    * **In a Windows Command Prompt (CMD or PowerShell) execute:** `wsl --shutdown` (This ensures WSL is fully restarted).
    * **Open a NEW WSL (Ubuntu) terminal.**
    * **Verify Docker is not running in WSL:** `docker ps` (it **MUST** output "Cannot connect to the Docker daemon").

3.  **Generate Vendure project files (with SQLite):**
    * Navigate into `docker/vendure`:
        ```bash
        cd docker/vendure
        ```
    * Run `npx @vendure/create .`:
        ```bash
        npx @vendure/create .
        ```
        **ANSWER THE PROMPTS CAREFULLY:**
        * `How should we proceed?` -> Select **`Quick Start`**.
        * `Using port 3000` -> (Wait)
        * `Docker is running` -> (It should now say "Docker is not running" or similar, because you stopped it).
        * `We could not automatically start Docker. How should we proceed?` -> **VERY IMPORTANT:** Select **`Let's use SQLite as the database`**. (This forces it to generate files reliably).
        * (Wait for `Created package.json`, `Successfully installed ... dependencies`, `Generated app scaffold` messages).
        * `Would you like to install the Admin UI?` -> Select **`Yes`**.
        * `Would you like to install a storefront? (recommended)` -> Select **`No`**.
        * **Wait for `npx @vendure/create .` to complete SUCCESSFULLY without any errors.** This means your Vendure project files are now generated in `~/vendure-docker-starter/docker/vendure`.

---

## **4. Configuring Vendure for Docker Compose**

Now that the files are generated, we'll configure them to work with our PostgreSQL Docker Compose setup.

1.  **Restart Docker Desktop:**
    * **Start Docker Desktop on your Windows machine.** Wait for it to fully initialize (green icon).
    * **Open a NEW WSL (Ubuntu) terminal.**
    * **Verify Docker is running in WSL:** `docker ps` (should work without errors now).

2.  **Navigate back to the Vendure project source directory:**
    ```bash
    cd ~/vendure-docker-starter/docker/vendure
    ```

3.  **Create `.dockerignore`:**

    ```bash
    nano .dockerignore
    ```
    Paste the following content exactly:

    ```
    node_modules
    dist
    .git
    .gitignore
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    .DS_Store
    .env
    ```
    * Save file: `Ctrl+O`, `Enter`.
    * Exit editor: `Ctrl+X`.

4.  **Create `Dockerfile.vendure`:**

    ```bash
    nano Dockerfile.vendure
    ```
    Paste the following content exactly:

    ```dockerfile
    FROM node:20 # Use Node.js 20 LTS

    # Install necessary system dependencies for PostgreSQL client and utilities
    RUN apt-get update && \
        apt-get install -y --no-install-recommends \
        openssl \
        git \
        unzip \
        && rm -rf /var/lib/apt/lists/*

    # Set the working directory inside the container
    WORKDIR /app

    # Copy package.json and package-lock.json first to leverage Docker cache
    # This ensures npm install runs only if dependencies change
    COPY package.json ./
    COPY package-lock.json ./

    # Install project dependencies (including those for Vendure itself)
    RUN npm install

    # Install the PostgreSQL client driver for Node.js (explicitly required by TypeORM)
    RUN npm install pg --save

    # Copy the rest of the Vendure project files (source code, assets etc.)
    # These files were generated locally by 'npx @vendure/create .'
    COPY . .

    # Build the Vendure project (TypeScript to JavaScript compilation)
    RUN npm run build

    # Открываем порт, на котором работает Vendure API
    EXPOSE 3000

    # Команда по умолчанию для запуска Vendure API
    CMD ["node", "dist/index.js"]
    ```
    * Save file: `Ctrl+O`, `Enter`.
    * Exit editor: `Ctrl+X`.

5.  **Configure `src/vendure-config.ts` for PostgreSQL:**

    This file tells Vendure how to connect to the database and how its plugins are configured.

    ```bash
    nano src/vendure-config.ts
    ```
    * **At the very top of the file**, add the line: `import 'dotenv/config';`
    * **Locate the `dbConnectionOptions` section** (it will be configured for SQLite) and **COMPLETELY REPLACE IT** with the `PostgreSQL` configuration below.
    * **Locate the `plugins` section** and ensure `AdminUiPlugin` is configured as shown below.

    ```typescript
    import { VendureConfig } from '@vendure/core';
    import { defaultEmailHandlers } from '@vendure/email-plugin';
    import { AssetServerPlugin } from '@vendure/asset-server-plugin';
    import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
    import * as path from 'path'; // Path is used by some plugin configs
    import 'dotenv/config'; // <--- THIS LINE IS CRUCIAL! MUST BE AT THE VERY TOP OF THE FILE

    export const config: VendureConfig = {
        apiOptions: {
            port: 3000,
            adminApiPath: 'admin-api',
            shopApiPath: 'shop-api',
            cors: true, // Enable CORS for local development. For production, set specific origins.
        },
        authOptions: {
            tokenMethod: ['bearer', 'cookie'],
            superadminCredentials: {
                identifier: process.env.SUPERADMIN_USERNAME || 'superadmin@vendure.io',
                password: process.
