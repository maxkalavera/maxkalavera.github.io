#! /bin/bash

export NODE_ENV=production

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

npm install
npm run build
npm run serve