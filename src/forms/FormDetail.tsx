import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import {createForm, fetchById} from "../services/FormsService"
import {useNavigate, useParams} from "react-router-dom"
import {InputText} from "primereact/inputtext"
import {Calendar} from "primereact/calendar"
import {InputNumber} from "primereact/inputnumber"
import {Button} from "primereact/button"
import styles from '../layout/layout.module.css'
import {Dialog} from "primereact/dialog"
import {Rating} from "primereact/rating"
import {Checkbox} from "primereact/checkbox"
import {Field, FieldType, Form} from "../models/FormModels"

type FormDetailProps = {
    onSuccess: (message: string) => void
    onError: (error: string) => void
}

export function FormDetail({onSuccess, onError}: FormDetailProps) {

    const params = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [componentDialogVisible, setComponentDialogVisible] = useState(false)

    const [form, setForm] = useState<Form>()
    const [fieldIndex, setFieldIndex] = useState(1)
    const [formName, setFormName] = useState('')
    const [question, setQuestion] = useState<Record<string, any>>({})
    const [required, setRequired] = useState<Record<string, any>>({})


    const headerElement = (
        <span className="layout-menuitem-text">Select the component</span>
    )


    const renderFieldByKey = (key: string, inputElement: React.ReactNode) => {
        return (
            <div key={key} className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                <h3 className="font-bold">Question</h3>
                <InputText
                    className="w-full"
                    value={question[key]}
                    onChange={(e) => onQuestionChanged(key, e.target.value)}
                    placeholder="Please, fill your question"
                />
                <div className="flex gap-3 w-full">
                    {inputElement}
                    <Checkbox
                        checked={required[key]}
                        onChange={(e) => onRequiredChanged(key, !!e.checked)}
                    />
                    <span>Is required?</span>
                </div>
            </div>
        )
    }

    const renderField = (key: string, field: Field) => {
        switch (field.type) {
            case 'text':
                return renderFieldByKey(key, <InputText className="w-3/5" placeholder="Input Text" type="text"/>)
            case 'datetime':
                return renderFieldByKey(key, <Calendar className="w-3/5" placeholder="Datetime" showTime showIcon
                                                       hourFormat="24"/>)
            case 'number':
                return renderFieldByKey(key, <InputNumber className="w-3/5" placeholder="Number" showButtons
                                                          mode="decimal"/>)
            case 'boolean':
                return renderFieldByKey(key, <div className="flex align-items-center">
                    <Checkbox className="w-3/5" checked={true}/>
                    <label className="ml-2">Boolean</label>
                </div>)
            case 'rating':
                return renderFieldByKey(key, <Rating className="w-3/5" cancel={false}/>)
            default:
                return <div key={key}>Unknown Field Type: {key}</div>
        }
    }


    const onQuestionChanged = (key: string, value: string) => {
        setQuestion(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const onRequiredChanged = (key: string, value: boolean) => {
        setRequired(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const save = () => {
        setLoading(true)
        if (form) {
            if (!formName || formName.trim() === "") {
                onError("Please, enter a valid form name.")
                setLoading(false)
                return
            }

            if (Object.keys(form.fields).length === 0) {
                onError("Please, the form should have at least one component.")
                setLoading(false)
                return
            }

            form.name = formName
            Object.entries(question).map(([key, question]) => {
                form.fields[key].question = question
            })

            let isAnyQuestionEmpty = false
            Object.entries(form.fields).forEach(([key, value]) => {
                if (!isAnyQuestionEmpty && form.fields[key].question.trim() === "") {
                    isAnyQuestionEmpty = true
                }
            })
            if (isAnyQuestionEmpty) {
                onError("Please, enter a valid question.")
                setLoading(false)
                return
            }

            Object.entries(required).map(([key, required]) => {
                form.fields[key].required = required
            })

            createForm(form).then(r => {
                setLoading(false)
                onSuccess("Form saved successfully.")
                navigate("/forms/")
            }).catch(err => {
                console.log(err)
                onError("Something went wrong. Please try again later.")
            })
        }
    }

    const addNewComponent = (component: string) => {
        setComponentDialogVisible(false)
        if (form?.fields) {
            form.fields["field-" + fieldIndex] = {
                type: component as FieldType,
                question: "",
                required: false
            }
            setFieldIndex(Object.keys(form.fields).length + 1)
        } else {
            console.warn("Response data or fields are not available.")
        }
    }

    const setNewForm = () => {
        let form = {
            id: "",
            name: "",
            fields: {}
        } as Form
        setForm(form)
        setFormName(form?.name)
        setQuestion({})
    }

    const setLoadedForm = (item: Form) => {
        setFormName(item?.name)
        setFieldIndex(Object.keys(item.fields).length + 1)

        Object.keys(item.fields).map((key) => {
            question[key] = item.fields[key].question
        })

        Object.keys(item.fields).map((key) => {
            required[key] = item.fields[key].required
        })

        setForm(item)
    }

    useEffect(() => {
        if (params.id) {
            fetchById(params.id)
                .then((item) => setLoadedForm(item))
                .catch(err => console.log(err))
        } else {
            setNewForm()
        }

    }, [params])

    return (
        <Container>


            {form ? (
                <div>
                    <div className="flex justify-end">
                        <Button label="Save" icon="pi pi-check" loading={loading} onClick={save}/>
                    </div>
                    <div className="flex flex-col items-start p-3">
                        <h3 className="font-bold">Form name</h3>
                        <InputText value={formName}
                                   onChange={(e) => setFormName(e.target.value)}
                                   className="w-full"
                                   placeholder="Please, fill your form name"></InputText>
                    </div>

                    {Object.entries(form.fields).map(([key, field]) => renderField(key, field as Field))}

                    <div className={styles.dottedGrayBorder} onClick={() => setComponentDialogVisible(true)}>
                        <span><i className="layout-menuitem-icon pi pi-fw pi-plus"></i>Add new component</span>
                    </div>

                    <Dialog visible={componentDialogVisible} modal header={headerElement}
                            style={{width: '50rem'}} onHide={() => {
                        if (!componentDialogVisible) return
                        setComponentDialogVisible(false)
                    }}>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4"
                                 onClick={() => addNewComponent(FieldType.DATETIME)}>
                                <i className="pi pi-fw pi-calendar !text-2xl"></i>
                                <p>Date and time</p>
                            </div>

                            <div className="flex items-center gap-4"
                                 onClick={() => addNewComponent(FieldType.TEXT)}>
                                <i className="pi pi-fw pi-bars !text-2xl"></i>
                                <p>Input Text</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.NUMBER)}>
                                <i className="pi pi-fw pi-sort-numeric-down !text-2xl"></i>
                                <p>Input Number</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.BOOLEAN)}>
                                <i className="pi pi-fw pi-check !text-2xl"></i>
                                <p>Boolean</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.RATING)}>
                                <i className="pi pi-fw pi-star !text-2xl"></i>
                                <p>Rating</p>
                            </div>
                        </div>
                    </Dialog>
                </div>
            ) : ('Loading...')}

        </Container>
    )
}



