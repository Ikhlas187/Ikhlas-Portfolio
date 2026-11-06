#!/usr/bin/env bash
# Compile MediPass (C++ + SQLite) en WebAssembly pour l'app Exécution du faux macOS.
# Usage : bash tools/runs/medipass/build.sh <dossier du repo Groupe_15_POO> <base de démo .db>
# Prérequis : Emscripten (emsdk) dans le PATH. Base de démo : python tools/runs/medipass/make_demo_db.py.
# Sortie : public/runs/medipass/ (medipass.mjs, medipass.wasm, medipass.data), chargés seulement au clic sur Exécuter.
set -euo pipefail
SRC="$1"
DEMO_DB="$2"
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../../public/runs/medipass"
WORK="$(mktemp -d)"
mkdir -p "$OUT"
cp "$DEMO_DB" "$WORK/MediPass_DB.db"

# SQLite compilé à part en C : un -x c sur la ligne principale s'appliquerait aussi aux fichiers C++.
emcc -O2 -DSQLITE_OMIT_LOAD_EXTENSION -DSQLITE_THREADSAFE=0 -c "$SRC/sqlite3.c" -o "$WORK/sqlite3.o"

em++ -O2 -sASYNCIFY -sASYNCIFY_STACK_SIZE=65536 -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=createMediPass \
  -sENVIRONMENT=web -sALLOW_MEMORY_GROWTH=1 -sEXIT_RUNTIME=1 \
  -sEXPORTED_RUNTIME_METHODS=lengthBytesUTF8,stringToUTF8,FS -sEXPORTED_FUNCTIONS=_main,_malloc,_free \
  -I "$SRC/include" -I "$SRC" "$SRC"/src/*.cpp "$HERE/web_stdin.cpp" "$WORK/sqlite3.o" \
  --preload-file "$WORK/MediPass_DB.db@/MediPass_DB.db" \
  -o "$OUT/medipass.mjs"

rm -rf "$WORK"
ls -la "$OUT"
