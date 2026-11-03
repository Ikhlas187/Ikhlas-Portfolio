import { describe, expect, it } from 'vitest'
import { fileSizeInBytes, formatFileSize } from '@/logic/macos/fileSize/fileSize'
import type { FsFolder, FsTextFile } from '@/data/macos'

const englishUnits = { bytes: 'bytes', kb: 'KB', mb: 'MB', decimal: '.' }
const frenchUnits = { bytes: 'octets', kb: 'Ko', mb: 'Mo', decimal: ',' }

describe('fileSizeInBytes', () => {
  it('ne donne pas de taille à un dossier', () => {
    const emptyFolder: FsFolder = { kind: 'folder', id: 'skills', name: 'Skills', date: '2026', children: [] }

    expect(fileSizeInBytes(emptyFolder)).toBeNull()
  })

  it('compte les octets UTF-8 d’un fichier texte', () => {
    const accentedText: FsTextFile = { kind: 'text', id: 'about', name: 'À propos.txt', date: '2026', content: 'été' }

    expect(fileSizeInBytes(accentedText)).toBe(5)
  })
})

describe('formatFileSize', () => {
  it('affiche « -- » pour un dossier', () => {
    const folderSize = null

    expect(formatFileSize(folderSize, englishUnits)).toBe('--')
  })

  it('garde les octets sous 1 000', () => {
    const smallSize = 512

    expect(formatFileSize(smallSize, englishUnits)).toBe('512 bytes')
  })

  it('arrondit au kilo-octet décimal', () => {
    const textSize = 1_499

    expect(formatFileSize(textSize, englishUnits)).toBe('1 KB')
  })

  it('affiche les méga-octets avec une décimale et le séparateur de la langue', () => {
    const photoSize = 1_250_000

    expect(formatFileSize(photoSize, frenchUnits)).toBe('1,3 Mo')
  })
})
