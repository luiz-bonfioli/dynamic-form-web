import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import {fetchById} from "../services/FormsService"
import {useNavigate, useParams} from "react-router-dom"
import {InputText} from "primereact/inputtext"
import {Calendar} from "primereact/calendar"
import {InputNumber} from "primereact/inputnumber"
import {Button} from "primereact/button"
import styles from '../layout/layout.module.css'
import {Rating} from "primereact/rating"
import {Checkbox} from "primereact/checkbox"
import {Field, Form, SourceRecord} from "../models/FormModels"
import {createSourceRecord} from "../services/SourceService"

type FormFillProps = {
    onSuccess: (message: string) => void
    onError: (error: string) => void
}

// This is the component responsible to render a dynamic form and allow users to fill in the fields
export function FormFill({onSuccess, onError}: FormFillProps) {

    const params = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // State declarations
    const [form, setForm] = useState<Form>()
    const [formName, setFormName] = useState('')
    const [answer, setAnswer] = useState<Record<string, any>>({})
    const [question, setQuestion] = useState<Record<string, any>>({})
    const [required, setRequired] = useState<Record<string, boolean>>({})

    // Helper to render a labeled field
    const renderField = (key: string, inputElement: React.ReactNode) => {
        return (
            <div key={key} className={`${styles.question} flex flex-col items-start gap-3`}>
                <h3 className="font-bold">
                    {question[key]}
                    {required[key] && <span> *</span>}
                </h3>
                <div className="flex gap-3 w-full">
                    {inputElement}
                </div>
            </div>
        )
    }

    // Render input component based on field type
    const renderFieldByType = (key: string, field: Field) => {
        switch (field.type) {
            case 'text':
                return renderField(key, <InputText className="w-full" placeholder="Input Text" type="text"
                                                   value={answer[key]}
                                                   onChange={(e) => onAnswerChanged(key, e.target.value)}/>)
            case 'datetime':
                return renderField(key, <Calendar className="w-full" placeholder="Datetime" showTime showIcon
                                                  hourFormat="24"
                                                  value={answer[key]}
                                                  onChange={(e) => onAnswerChanged(key, e.value)}/>)
            case 'number':
                return renderField(key, <InputNumber className="w-full" placeholder="Number" showButtons
                                                     mode="decimal"
                                                     value={answer[key]}
                                                     onChange={(e) => onAnswerChanged(key, e.value)}/>)
            case 'boolean':
                return renderField(key, <div className="flex align-items-center">
                    <Checkbox className="w-full"
                              checked={answer[key]}
                              onChange={(e) => onAnswerChanged(key, e.checked)}/>
                </div>)
            case 'rating':
                return renderField(key, <Rating className="w-full" cancel={false}
                                                value={answer[key]}
                                                onChange={(e) => onAnswerChanged(key, e.value)}/>)
            default:
                return <div key={key}>Unknown Field Type: {key}</div>
        }
    }

    // Handle answer input changes
    const onAnswerChanged = (key: string, value: any) => {
        setAnswer(prev => ({
            ...prev,
            [key]: value
        }))
    }

    // Save form record
    const save = () => {
        setLoading(true)
        if (form) {
            const sourceRecord: SourceRecord = {
                formId: form.id,
                sourceData: []
            }

            let requiredAnswers: string[] = []

            // Validate required fields and build sourceData
            Object.entries(answer).map(([key, value]) => {

                if (form.fields[key].required && (value === undefined || value === null || value === "")) {
                    requiredAnswers.push(question[key])
                }

                const sourceData = {answer: typeConverter(value), question: question[key]}
                sourceRecord.sourceData.push(sourceData)
            })

            // Show error if required answers are missing
            if (requiredAnswers.length > 0) {
                onError(`Please, enter valid answers for: ${requiredAnswers.join(", ")}`)
                setLoading(false)
                return
            }

            // Send data to API
            createSourceRecord(sourceRecord).then(r => {
                setLoading(false)
                onSuccess("Record saved successfully.")
                navigate(`/forms/${form.id}/data`)
            }).catch(err => {
                console.log(err)
                onError("Something went wrong. Please try again later.")
            }).finally(() => setLoading(false))
        }
    }

    // Converts values to string format before saving
    const typeConverter = (value: any) => {
        let answer: string

        if (typeof value === 'string') {
            answer = value
        } else if (value instanceof Date) {
            answer = value.toISOString()
        } else if (typeof value === 'number') {
            answer = String(value)
        } else if (typeof value === 'boolean') {
            answer = value ? "Yes" : "No"
        } else {
            answer = JSON.stringify(value)
        }
        return answer
    }

    // Prepare and load form data from backend
    const setLoadedForm = (item: Form) => {
        setFormName(item?.name)

        const newQuestion: Record<string, any> = {}
        const newRequired: Record<string, boolean> = {}

        Object.keys(item.fields).map((key) => {
            newQuestion[key] = item.fields[key].question
            newRequired[key] = item.fields[key].required
            answer[key] = ""
        })
        setQuestion(newQuestion)
        setRequired(newRequired)
        setForm(item)
    }

    // Load form from API when component mounts
    useEffect(() => {
        if (params.id) {
            fetchById(params.id)
                .then((item) => setLoadedForm(item))
                .catch(err => {
                    console.log(err)
                    onError("Something went wrong. Please try again later.")
                })
        }
    }, [params])

    return (
        <Container>
            {form ? (
                <div>
                    <div className="flex flex-col items-start p-3">
                        <h3 className="font-bold">{formName}</h3>
                    </div>

                    {Object.entries(form.fields).map(([key, field]) => renderFieldByType(key, field as Field))}

                    <div className="flex justify-end">
                        <Button label="Save" icon="pi pi-check" loading={loading} onClick={save}/>
                    </div>
                </div>
            ) : ('Loading...')}

        </Container>
    )
}



