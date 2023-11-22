#!/bin/bash

set -eu

rm -rf dist
webpack

cp -r src/entry dist
cp -r src/html dist
cp -r src/static dist
cp manifest.json dist/manifest.json
