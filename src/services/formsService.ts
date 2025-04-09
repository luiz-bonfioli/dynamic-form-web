import {Form, FormListResponse, FormResponse} from "./formsModel"

const BASE_URL = 'http://127.0.0.1:8080/form'

export async function fetchAll() {
    try {
        const response = await fetch(`${BASE_URL}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const formResponse = await response.json() as FormListResponse
        return formResponse.data
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}

export async function fetchById(id: string) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const formResponse = await response.json() as FormResponse
        return formResponse.data
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}

export async function createForm(form: Form) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Create form error:', error)
        throw error
    }
}