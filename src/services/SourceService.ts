import {SourceRecord, SourceRecordListResponse} from "../models/FormModels";

const BASE_URL = 'http://127.0.0.1:8080/source'

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