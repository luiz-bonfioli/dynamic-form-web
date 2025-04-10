export interface FormListResponse {
    statusCode: string
    data: Form[]
}

export interface SourceRecordListResponse {
    statusCode: string
    data: SourceRecord[]
}

export interface FormResponse {
    statusCode: string
    data: Form
}

export interface Form {
    id: string
    name: string
    fields: any
}

export interface Field {
    type: FieldType
    question: string
    required: boolean
}

export interface SourceData {
    id?: string
    question: string
    answer: string
}

export interface SourceRecord {
    id?: string
    formId: string
    sourceData: SourceData[]
}

export enum FieldType {
    TEXT = 'text',
    DATETIME = 'datetime',
    NUMBER = 'number',
    RATING = 'rating',
    BOOLEAN = 'boolean'
}