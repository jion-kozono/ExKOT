#!/bin/bash

set -eu

# Execute the command `chmod +x scripts/zip.sh` if you catch the permisson error.
zip -r dist.zip dist
