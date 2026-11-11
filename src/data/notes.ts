import type { Localized } from '@/data/locale'
import type { NoteColor, PinnedNote } from '@/types/note'

type NotesSection = {
  kicker: string
  title: string
  intro: string
  noteLabel: string
  notePlaceholder: string
  nameLabel: string
  namePlaceholder: string
  colorGroupLabel: string
  colorNames: Record<NoteColor, string>
  pinLabel: string
  pinnedStatus: string
  emptyStatus: string
  // Refus du contrôle des notes ou du serveur.
  rejectedStatus: Record<'tooLong' | 'blockedWord' | 'link' | 'tooMany' | 'alreadyPinned' | 'notFound' | 'unavailable', string>
  // Retrait de sa propre note (bouton sur la note du visiteur).
  removeLabel: string
  seeMoreLabel: string
  anonymous: string
  boardLabel: string
}

export const NOTES_SECTION: Localized<NotesSection> = {
  en: {
    kicker: 'Leave a trace before you go',
    title: 'Pin a note',
    intro: 'A word, a question or some feedback on my work: write it down, pick a colour and pin it to the board.',
    noteLabel: 'Your note',
    notePlaceholder: 'Write your note…',
    nameLabel: 'Your name (optional)',
    namePlaceholder: 'Your name',
    colorGroupLabel: 'Note colour',
    colorNames: { pink: 'Pink', yellow: 'Yellow', orange: 'Orange', green: 'Green', blue: 'Blue' },
    pinLabel: 'Pin note',
    pinnedStatus: 'Your note is on the board. Thank you!',
    emptyStatus: 'Write a few words first.',
    rejectedStatus: {
      tooLong: 'Keep it to 100 characters.',
      blockedWord: 'Some words aren’t allowed here. Please rephrase.',
      link: 'Links aren’t allowed on the board.',
      tooMany: 'You’ve pinned a lot in a short time. Try again in a minute.',
      unavailable: 'The board can’t be reached right now. Try again in a moment.',
      alreadyPinned: 'You already have a note on the board. Remove it to pin a new one.',
      notFound: 'This note is no longer on the board.',
    },
    removeLabel: 'Remove my note',
    seeMoreLabel: 'See more notes',
    anonymous: 'Anonymous',
    boardLabel: 'Pinned notes',
  },
  fr: {
    kicker: 'Laissez une trace avant de partir',
    title: 'Épinglez une note',
    intro: 'Un mot, une question ou un retour sur mon travail : écrivez-le, choisissez une couleur et épinglez-le au tableau.',
    noteLabel: 'Votre note',
    notePlaceholder: 'Écrivez votre note…',
    nameLabel: 'Votre prénom (facultatif)',
    namePlaceholder: 'Votre prénom',
    colorGroupLabel: 'Couleur de la note',
    colorNames: { pink: 'Rose', yellow: 'Jaune', orange: 'Orange', green: 'Vert', blue: 'Bleu' },
    pinLabel: 'Épingler',
    pinnedStatus: 'Votre note est au tableau. Merci !',
    emptyStatus: 'Écrivez quelques mots d’abord.',
    rejectedStatus: {
      tooLong: '100 caractères au maximum.',
      blockedWord: 'Certains mots ne sont pas acceptés ici. Reformulez, s’il vous plaît.',
      link: 'Les liens ne sont pas acceptés sur le tableau.',
      tooMany: 'Vous avez épinglé beaucoup de notes d’affilée. Réessayez dans une minute.',
      unavailable: 'Le tableau est injoignable pour le moment. Réessayez dans un instant.',
      alreadyPinned: 'Vous avez déjà une note au tableau. Retirez-la pour en épingler une autre.',
      notFound: 'Cette note n’est plus au tableau.',
    },
    removeLabel: 'Retirer ma note',
    seeMoreLabel: 'Voir plus de notes',
    anonymous: 'Anonyme',
    boardLabel: 'Notes épinglées',
  },
}

// Mots d'accueil d'Ikhlas : seules notes présentes au départ, jamais de faux visiteurs.
export const WELCOME_NOTES: Localized<PinnedNote[]> = {
  en: [
    {
      id: 'welcome-1',
      text: 'Thanks for scrolling all the way down! Leave me a word, I read every note.',
      author: 'Ikhlas',
      color: 'orange',
      createdAt: '2026-11-02T00:00:00.000Z',
    },
    {
      id: 'welcome-2',
      text: 'Got a project in mind? Pin it here, or just say hi.',
      author: 'Ikhlas',
      color: 'blue',
      createdAt: '2026-11-02T00:00:00.000Z',
    },
  ],
  fr: [
    {
      id: 'welcome-1',
      text: 'Merci d’avoir défilé jusqu’ici ! Laissez-moi un mot, je lis chaque note.',
      author: 'Ikhlas',
      color: 'orange',
      createdAt: '2026-11-02T00:00:00.000Z',
    },
    {
      id: 'welcome-2',
      text: 'Un projet en tête ? Épinglez-le ici, ou dites simplement bonjour.',
      author: 'Ikhlas',
      color: 'blue',
      createdAt: '2026-11-02T00:00:00.000Z',
    },
  ],
}
