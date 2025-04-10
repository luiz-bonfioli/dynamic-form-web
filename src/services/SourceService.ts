import {SourceRecord, SourceRecordListResponse} from "../models/FormModels";

// Base URL for all source record-related API calls
const BASE_URL = 'http://127.0.0.1:8080/source'

/**
 * Sends a new source record (user form submission) to the backend
 * @param sourceRecord - The source record object to be saved
 * @returns A promise that resolves to the backend response
 */
export async function createSourceRecord(sourceRecord: SourceRecord) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sourceRecord)
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Create source record error:', error)
        throw error
    }
}

/**
 * Fetches all source records submitted for a specific form ID
 * @param formId - The ID of the form to retrieve submissions for
 * @returns A promise that resolves to a list of source records
 */
export async function fetchByFormId(formId: string) {
    try {
        const response = await fetch(`${BASE_URL}/${formId}`)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const sourceRecordListResponse = await response.json() as SourceRecordListResponse
        return sourceRecordListResponse.data
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}