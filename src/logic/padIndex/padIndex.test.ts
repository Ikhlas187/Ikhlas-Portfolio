import { describe, expect, test } from 'vitest'
import { padIndex } from '@/logic/padIndex/padIndex'

describe('padIndex', () => {
  test.each([
    { value: 1, paddedIndex: '01' },
    { value: 9, paddedIndex: '09' },
    { value: 10, paddedIndex: '10' },
    { value: 123, paddedIndex: '123' },
  ])('écrit $value sous la forme « $paddedIndex »', ({ value, paddedIndex }) => {
    expect(padIndex(value)).toBe(paddedIndex)
  })
})
