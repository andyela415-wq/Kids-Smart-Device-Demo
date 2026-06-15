#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
NODE_BIN="$ROOT/.tools/node/bin"

if [ ! -x "$NODE_BIN/npm" ]; then
  echo "未找到本地 Node.js，请先运行: bash setup.sh"
  exit 1
fi

export PATH="$NODE_BIN:$PATH"
cd "$ROOT"

if [ ! -d node_modules ]; then
  npm install
fi

npm run dev -- --host 127.0.0.1 --port 5173
