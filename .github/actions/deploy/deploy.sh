#!/bin/bash

set -e

# Configure git
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# Clone the gh-pages branch
git clone --depth=1 --branch=gh-pages https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git gh-pages

# Copy the build output to the gh-pages branch
rsync -av --delete ${PUBLISH_DIR}/ gh-pages/

# Commit and push the changes
cd gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages