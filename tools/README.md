# tools · chaîne de fabrication des planches manga

Sert à produire le fond du footer depuis des photos brutes. Rien ici n'est
importé par l'application : c'est de l'outillage hors build.

## 1. Photos → planches manga

`manga.py` convertit une photo en planche noir et blanc. La chaîne, dans
l'ordre où elle compte visuellement :

1. **trait encré** par différence de gaussiennes étendue (XDoG), binarisé puis
   légèrement épaissi
2. **grandes zones de blanc papier** : les hautes lumières restent vides
3. **trame de points à 45°** sur 2 bandes de gris seulement, pas partout
4. **noirs pleins** dans les ombres profondes

Le point clé : l'image est d'abord **simplifiée** (médiane + lissage préservant
les contours) avant d'être tramée. Tramer directement une photo donne une
photocopie, pas une planche.

Tout est calculé à 2x la résolution de sortie pour que les points restent nets
quand la caméra zoome dedans.

```bash
pip install pillow numpy scipy
python tools/manga.py tools/sources <dossier-sortie>
```

Les photos sources vivent dans `tools/sources/`, ignoré par git. Les planches retenues vont dans `src/assets/` sous le nom `footer-plate-<sujet>.webp`.

Les 3 appels en bas du fichier sont réglés pour les photos d'Ikhlas. Pour
d'autres photos, les paramètres à toucher en premier :

| Paramètre | Effet |
|---|---|
| `bands` | seuils noir plein / trame dense / trame légère / blanc |
| `coverage` | densité d'encre des 2 trames (0.5 = dense, 0.22 = légère) |
| `cells` | taille des points. **Ne pas descendre sous ~12** : des points fins deviennent du bruit et explosent le poids si tu encodes en vidéo |
| `gamma` | < 1 éclaircit un sujet sombre, > 1 assombrit |
| `rounds`, `sigma` | force de la simplification. Baisser pour garder du détail (visages) |
| `thicken`, `phi` | épaisseur et franchise du trait |

## 2. Planches → mp4 (optionnel)

Le footer anime les planches **en CSS**, pas en vidéo. Mesuré sur ce plan :

| | Poids | Netteté |
|---|---|---|
| 3 planches WebP 1600px | 1,17 Mo | intacte |
| même plan en mp4 h264 720p 12 s | 6,5 Mo | trame écrasée par le codec |

Une trame de points est du contenu haute fréquence : h264 la gère très mal. La
version CSS est 5,7x plus légère et reste nette. Le mp4 n'est utile que si tu
veux un fichier réutilisable ailleurs.

```bash
cd tools/video
pnpm install
pnpm exec remotion render src/index.jsx MangaLoopLight out/footer-manga.mp4 \
  --codec=h264 --crf=28 \
  --browser-executable="C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"
```

`MangaLoop` est la variante inversée (encre blanche sur noir). Essayée puis
écartée : elle ne lit plus comme du manga mais comme un négatif de photocopie.

Le cadence est à **12 images/seconde**, comme l'animation japonaise
traditionnelle (« sur deux »), ce qui divise aussi le débit par 2.

## 3. Boucle sans raccord

Les images-clés CSS comme la composition Remotion sont **périodiques** : l'état
à 100 % du cycle est identique à celui à 0 %. Chaque plan avance pendant sa
propre fenêtre de visibilité et revient à son point de départ pendant qu'il est
invisible. Il n'y a donc aucun saut au bouclage.
