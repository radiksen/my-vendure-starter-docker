#!/bin/bash

echo "--- Setting up and starting Vendure with Docker Compose ---"

# --- 1. Prompt for user variables ---
read -p "Enter a strong password for the Vendure database (VENDURE_DB_PASSWORD): " VENDURE_DB_PASSWORD

# Basic validation for empty values
if [ -z "$VENDURE_DB_PASSWORD" ]; then
  echo "Error: Database password is required. Please try again."
  exit 1
fi

# --- 2. Create the .env file ---
echo "Creating .env file with your settings..."
echo "VENDURE_DB_PASSWORD=${VENDURE_DB_PASSWORD}" > .env
echo ".env file created. It will be automatically used by Docker Compose."

# --- 3. Start Docker Compose (build image and launch all services) ---
echo "Starting Docker Compose. This might take some time for the initial Vendure image build (npm install, npm run build)."
docker-compose up -d --build

# --- 4. Run Vendure Database Migrations and create Superuser ---
echo "Waiting for Vendure API and Database to be ready..."
sleep 12500000 # Give Vendure API and DB enough time to start up and listen

echo "Running Vendure database migrations and creating initial superuser..."
# This command executes 'npm run dev-setup' inside the running Vendure container.
# This script handles database schema creation, migrations, and superuser setup.
# It will use the database credentials passed via environment variables from docker-compose.yml.
docker-compose exec vendure_app npm run dev-setup

if [ $? -ne 0 ]; then
    echo "-------------------------------------------------------------------"
    echo "Error: Vendure dev-setup (migrations/superuser) failed."
    echo "Please check the logs of the 'vendure_app' container for details:"
    echo "  docker-compose logs vendure_app"
    echo "Common issues: Database connection details in .env or docker-compose.yml are incorrect,"
    echo "               or the 'npm run dev-setup' command in Vendure's code is not working."
    echo "-------------------------------------------------------------------"
    exit 1
fi

echo "--- Vendure setup complete! ---"
echo "Your Vendure API should be accessible at: http://localhost:3000/shop-api"
echo "Your Vendure Admin UI (loaded from CDN) should be accessible at: http://localhost:3000/admin"
echo "Default Admin credentials: Email: superadmin@vendure.io, Password: shopsecret"
echo ""
echo "To stop Vendure, use: docker-compose down"
