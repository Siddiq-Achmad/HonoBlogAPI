import { describe, it, expect } from 'vitest'
import { generateSlug } from './slug.js'

describe('Slug Generator', () => {
  it('should convert text to lowercase', () => {
    expect(generateSlug('HELLO WORLD')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('hello world')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(generateSlug('hello @world!')).toBe('hello-world')
  })

  it('should handle multiple spaces and hyphens', () => {
    expect(generateSlug('hello   --- world')).toBe('hello-world')
  })

  it('should trim leading and trailing hyphens', () => {
    expect(generateSlug('-hello world-')).toBe('hello-world')
  })

  it('should handle Indonesian characters or non-latin safely', () => {
    expect(generateSlug('Cara Membuat API dengan Hono')).toBe('cara-membuat-api-dengan-hono')
  })
})
