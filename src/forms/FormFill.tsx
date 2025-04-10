import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import {fetchById} from "../services/FormsService"
import {useParams} from "react-router-dom"
import {InputText} from "primereact/inputtext"
import {Calendar} from "primereact/calendar"
import {InputNumber} from "primereact/inputnumber"
import {Button} from "primereact/button"
import styles from '../layout/layout.module.css'
import {Rating} from "primereact/rating"
import {Checkbox} from "primereact/checkbox"
import {Field, Form, SourceData, SourceRecord} from "../models/FormModels";
import {createSourceRecord} from "../services/SourceService";

export function FormFill() {

    const params = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState<Form>()
    const [formName, setFormName] = useState('')
    const [answer, setAnswer] = useState<Record<string, any>>({})
    const [question, setQuestion] = useState<Record<string, any>>({})
    const [required, setRequired] = useState<Record<string, boolean>>({})

    const renderField = (key: string, inputElement: React.ReactNode) => {
        return (
            <div key={key} className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
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
                    <label className="ml-2">Boolean</label>
                </div>)
            case 'rating':
                return renderField(key, <Rating className="w-full"/>)
            default:
                return <div key={key}>Unknown Field Type: {key}</div>
        }
    }

    const onAnswerChanged = (key: string, value: any) => {
        const deepClone = JSON.parse(JSON.stringify(answer))
        deepClone[key] = value
        setAnswer(deepClone)
    }
    const save = () => {
        setLoading(true)
        if (form) {
            const sourceRecord: SourceRecord = {
                formId: form.id,
                sourceData: []
            }

            Object.entries(answer).map(([key, value]) => {
                const sourceData = {answer: value, question: question[key]}
                sourceRecord.sourceData.push(sourceData)
            })
            console.log(sourceRecord)

            createSourceRecord(sourceRecord).then(r => {
                setLoading(false)
            }).finally(() => setLoading(false))
        }
    }


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

    useEffect(() => {
        if (params.id) {
            fetchById(params.id)
                .then((item) => setLoadedForm(item))
                .catch(err => console.log(err))
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



