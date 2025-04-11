import React from 'react'
import App from "../src/App";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'


// Mock the Layout component
jest.mock('../src/layout/Layout', () => ({
    Layout: () => <div data-testid="layout">Mocked Layout</div>
}))

describe('App', () => {
    it('renders the Layout component', () => {
        render(<App/>)
        const layoutElement = screen.getByTestId('layout')
        expect(layoutElement).toBeInTheDocument()
    })
})
