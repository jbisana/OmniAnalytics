#!/usr/bin/env bash
set -euo pipefail

echo "Setting up OmniAnalytics project..."

# 1. Install dependencies
echo "Installing npm dependencies..."
npm install

# 2. Check for .env file
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Please update .env with your actual Gemini API key (GEMINI_API_KEY) before running the app locally."
else
  echo ".env file already exists, skipping creation."
fi

echo "Setup complete! You can now run the app with 'npm run dev'"
