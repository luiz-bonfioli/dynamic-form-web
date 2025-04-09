export interface ResponseData {
    statusCode: string
    data: Form[]
}

export interface ResponseDataSingle {
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

export enum FieldType {
    TEXT = 'text',
    DATETIME = 'datetime',
    NUMBER = 'number',
    RATING = 'rating',
    BOOLEAN = 'boolean'
}