// lid : 0 fermé, 1 ouvert. zoom : 0 vue d'ensemble, 1 écran cadré. Pilotés par le défilement, lus dans useFrame.
export type MacBookMotion = {
  lid: number
  zoom: number
}

export type MacBookPhase = 'closed' | 'opening' | 'open' | 'closing'

// Valeurs lissées image par image : souris (-1 à 1) et recul de la caméra quand le Mac est éteint en plein écran.
export type StageMotion = {
  pointerX: number
  pointerY: number
  retreat: number
}
