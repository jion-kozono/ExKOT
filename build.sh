#!/bin/bash

set -eu

rm -rf dist

sed -i '' '/APP_ENV/d' src/ts/const.ts
if [ "${APP_ENV}" == "dev" ]; then
    echo 'export const APP_ENV: "dev" | "prod" = "dev";' >> src/ts/const.ts
else
    echo 'export const APP_ENV: "dev" | "prod" = "prod";' >> src/ts/const.ts
fi


webpack

cp -r src/entry dist
cp -r src/html dist
cp -r src/static dist
cp manifest.json dist/manifest.json

# 戻す。
sed -i '' '/APP_ENV/d' src/ts/const.ts
echo 'export const APP_ENV: "dev" | "prod" = "dev";' >> src/ts/const.ts
