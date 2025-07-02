#!/bin/bash

# Format all TypeScript/React files
echo "Formatting all TypeScript and React files..."
npx prettier --write "**/*.{ts,tsx}" --ignore-path .gitignore

# Add a specific fix for the file with error in check-images route
echo "Adding specific TypeScript error handling to check-images/route.ts..."
sed -i '' 's/error: error\.message/error: error instanceof Error ? error.message : String(error)/g' app/api/check-images/route.ts

# Try building the project
echo "Running build..."
npm run build
