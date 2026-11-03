export type BrowserBookmark = { title: string; address: string }

export function isBookmarked(bookmarks: BrowserBookmark[], address: string) {
  return bookmarks.some((bookmark) => bookmark.address === address)
}

// Comme la référence : l'étoile ajoute la page à la fin de la barre des signets, jamais en double, jamais la page d'accueil.
export function addBookmark(bookmarks: BrowserBookmark[], bookmark: BrowserBookmark): BrowserBookmark[] {
  if (bookmark.address === '' || isBookmarked(bookmarks, bookmark.address)) return bookmarks
  return [...bookmarks, bookmark]
}
