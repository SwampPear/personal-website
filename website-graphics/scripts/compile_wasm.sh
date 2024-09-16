#!/bin/bash

set -euo pipefail

TARGET=wasm32-unknown-unknown
BINARY=target/$TARGET/release/website_graphics.wasm

cargo build --target $TARGET --release
cp $BINARY ../static/wasm