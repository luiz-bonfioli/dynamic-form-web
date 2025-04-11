import React from "react"
import {render, screen} from "@testing-library/react"
import Container from "../src/layout/Container";
import "@testing-library/jest-dom"

describe("Container component", () => {
    test("renders children inside a div with layoutContainer class", () => {
        render(<Container><p data-testid="child">Hello</p></Container>)

        const child = screen.getByTestId("child")
        expect(child).toBeInTheDocument()
        expect(child).toHaveTextContent("Hello")
    })
})
