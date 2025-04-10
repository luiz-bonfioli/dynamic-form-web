import {Form, FormListResponse, FormResponse} from "../models/FormModels";

// Base URL for all form-related API calls
const BASE_URL = 'http://127.0.0.1:8080/form'

/**
 * Fetches all forms from the backend
 * @returns A promise that resolves to a list of forms
 */
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

/**
 * Fetches a specific form by its ID
 * @param id - The ID of the form to retrieve
 * @returns A promise that resolves to a single form
 */
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

/**
 * Creates a new form in the backend
 * @param form - The form object to be saved
 * @returns A promise that resolves to the response from the backend
 */
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