#!/usr/bin/env bash
# Compile Columinst (Qt Widgets) en WebAssembly pour l'app Exécution du faux macOS.
# Usage : bash tools/runs/columinst/build.sh <dossier Columinst/Columinst du repo>
# Prérequis : Qt 6.10.3 wasm_singlethread (+ qtcharts, qt5compat) et mingw_64 dans C:/Qt (aqtinstall),
# emsdk 4.0.7 dans C:/emsdk-qt (version exigée par ce Qt), cmake et ninja dans C:/Qt/aqt-venv.
# Sortie : public/runs/columinst/ (columinst.js, columinst.wasm, qtloader.js), chargés seulement au clic sur Exécuter.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../../public/runs/columinst"
WORK="$(mktemp -d)"
# Copie du code adaptée au navigateur (Qt 6, emojis, plein écran), le repo d'origine reste intact.
cp -r "$1" "$WORK/src"
python -X utf8 "$HERE/patch_sources.py" "$WORK/src"
SRC="$(cd "$WORK/src" && pwd -W)"
export EMSDK=C:/emsdk-qt EM_CONFIG=C:/emsdk-qt/.emscripten
export PATH="/c/emsdk-qt/upstream/emscripten:/c/emsdk-qt/python/$(ls /c/emsdk-qt/python | head -1):/c/Qt/aqt-venv/Scripts:$PATH"
/c/Qt/6.10.3/wasm_singlethread/bin/qt-cmake.bat -S "$(cd "$HERE" && pwd -W)" -B "$WORK/build" -G Ninja \
  -DCMAKE_BUILD_TYPE=MinSizeRel -DQT_HOST_PATH=C:/Qt/6.10.3/mingw_64 -DCOLUMINST_SRC="$SRC"
cmake --build "$WORK/build"
mkdir -p "$OUT"
cp "$WORK"/build/columinst.js "$WORK"/build/columinst.wasm "$WORK"/build/qtloader.js "$OUT"/
rm -rf "$WORK"
ls -la "$OUT"
