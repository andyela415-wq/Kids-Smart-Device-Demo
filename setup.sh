#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$ROOT/.tools"
NODE_DIR="$TOOLS/node"
ARCH="$(uname -m)"
NODE_VERSION="v22.16.0"

case "$ARCH" in
  arm64) NODE_PKG="node-${NODE_VERSION}-darwin-arm64" ;;
  x86_64) NODE_PKG="node-${NODE_VERSION}-darwin-x64" ;;
  *) echo "不支持的架构: $ARCH"; exit 1 ;;
esac

mkdir -p "$TOOLS"
cd "$TOOLS"

if [ ! -x "$NODE_DIR/bin/npm" ]; then
  echo "正在下载 Node.js ${NODE_VERSION}..."
  curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/${NODE_PKG}.tar.gz" -o node.tar.gz
  tar -xzf node.tar.gz
  rm -f node.tar.gz
  rm -rf node
  mv "$NODE_PKG" node
fi

export PATH="$NODE_DIR/bin:$PATH"
cd "$ROOT"
npm install

echo ""
echo "安装完成。启动开发服务器请运行:"
echo "  bash dev.sh"
echo ""
echo "浏览器打开: http://127.0.0.1:5173/"
