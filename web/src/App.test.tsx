import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App'
import { test, expect } from 'vitest'

describe('App', () => {
  test('renders header', () => {
    render(<App />)
    const linkElement = screen.getByText(/MEMO/i)
    expect(linkElement).toBeInTheDocument()
  })
})
