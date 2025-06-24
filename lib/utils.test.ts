import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it("returns last class when duplicates", () => {
    expect(cn('p-1', 'p-2')).toBe('p-2')
  })
})
