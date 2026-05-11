#!/bin/bash

# ServiceHub Quick Start Script
# This script sets up and runs the ServiceHub marketplace application

echo "🚀 ServiceHub - Quick Start Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "✅ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Using Node.js: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Build Angular application
echo "🔨 Building Angular application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Run development server
echo "🎯 Starting development server..."
echo "   Application will be available at: http://localhost:4200"
echo ""
npm start
