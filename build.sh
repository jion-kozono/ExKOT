#!/bin/bash

set -eu

# Set APP_ENV in src/ts/const.ts
sed -i '' '/APP_ENV/d' src/ts/const.ts
if [ "${APP_ENV}" == "dev" ]; then
    echo 'export const APP_ENV: "dev" | "prod" = "dev";' >> src/ts/const.ts
else
    echo 'export const APP_ENV: "dev" | "prod" = "prod";' >> src/ts/const.ts
fi

vite build

# Reset
sed -i '' '/APP_ENV/d' src/ts/const.ts
echo 'export const APP_ENV: "dev" | "prod" = "dev";' >> src/ts/const.ts
