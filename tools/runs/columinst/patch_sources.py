"""Adapte une copie du code de Columinst au navigateur. Le repo d'origine n'est jamais modifié.
Usage : python -X utf8 patch_sources.py <copie du dossier Columinst/Columinst>"""
import pathlib
import re
import sys

ROOT = pathlib.Path(sys.argv[1])
# Qt n'a pas de police emoji dans le navigateur : les emojis s'afficheraient en carrés vides.
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️] ?')

# Tournures Qt 5 absentes de Qt 6, et fenêtre principale qui remplit l'écran de la fenêtre du Mac.
REPLACEMENTS = {
    'statswidget.h': [('QT_CHARTS_USE_NAMESPACE', '')],
    'statswidget.cpp': [('QString::SkipEmptyParts', 'Qt::SkipEmptyParts')],
    'translationmanager.cpp': [('#include <QRegExp>', '#include <QRegularExpression>'), ('QRegExp(', 'QRegularExpression(')],
    'tableau.cpp': [('out.setCodec("UTF-8");', 'out.setEncoding(QStringConverter::Utf8);')],
    'main.cpp': [('w.show();', 'w.setWindowFlag(Qt::FramelessWindowHint);\n    w.showMaximized();')],
}

for path in [*ROOT.glob('*.cpp'), *ROOT.glob('*.h'), *ROOT.glob('*.ui')]:
    text = path.read_text(encoding='utf-8')
    for old, new in REPLACEMENTS.get(path.name, []):
        assert old in text, (path.name, old)
        text = text.replace(old, new)
    path.write_text(EMOJI.sub('', text), encoding='utf-8', newline='\n')
