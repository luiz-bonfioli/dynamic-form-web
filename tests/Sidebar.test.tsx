import React from "react"
import {render, screen} from "@testing-library/react"
import Sidebar from "../src/layout/Sidebar";
import "@testing-library/jest-dom"


describe("Container component", () => {
    test("renders children inside a div with layoutContainer class", () => {
        render(<Sidebar>
            <nav>
                <ul className="flex flex-col gap-1 text-start">
                    <li className="inline-block align-top">
                        <i className="pi pi-fw pi-home m-2"></i>
                        <span data-testid="home">Home</span>
                    </li>
                    <li className="inline-block align-top">
                        <i className="pi pi-fw pi-file  m-2"></i>
                        <span data-testid="list">Forms List</span>
                    </li>
                    <li className="inline-block align-top">
                        <i className="pi pi-fw pi-wrench m-2"></i>
                        <span data-testid="builder">Forms Builder</span>
                    </li>
                </ul>
            </nav>
        </Sidebar>)

        const home = screen.getByTestId("home")
        expect(home).toBeInTheDocument()
        expect(home).toHaveTextContent("Home")

        const list = screen.getByTestId("list")
        expect(list).toBeInTheDocument()
        expect(list).toHaveTextContent("Forms List")

        const builder = screen.getByTestId("builder")
        expect(builder).toBeInTheDocument()
        expect(builder).toHaveTextContent("Forms Builder")
    })
})
