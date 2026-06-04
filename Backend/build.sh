#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Install your backend dependencies
npm install

# 2. Tell Puppeteer to download its local headless Chrome execution engine inside the cloud container
npx puppeteer blobs download