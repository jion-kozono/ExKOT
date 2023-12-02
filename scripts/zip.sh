#!/bin/bash

set -eu

if [ -e dist.zip ]; then
  rm -rf dist.zip
fi

# Execute the command `chmod +x scripts/zip.sh` if you catch the permisson error.
zip -r dist.zip dist
