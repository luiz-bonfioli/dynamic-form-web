import React, {useEffect, useState} from "react";
import Container from "../layout/Container";
import {createForm, fetchById} from "../services/formsService";
import {Field, FieldType, Form} from "../services/formsModel";
import {useParams} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import styles from '../layout/layout.module.css';
import {Dialog} from "primereact/dialog";
import {Rating} from "primereact/rating";
import {Checkbox} from "primereact/checkbox";
import {ZIndexUtils} from "primereact/utils";
import set = ZIndexUtils.set;


export function FormDetail() {

    const params = useParams<{ id: string }>()
    const [form, setForm] = useState<Form>()
    const [datetime24h, setDateTime24h] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fieldIndex, setFieldIndex] = useState(1)
    const [visible, setVisible] = useState(false)
    const [formName, setFormName] = useState('')
    const [question, setQuestion] = useState<Record<string, any>>({})


    function onQuestionChanged(key: string, value: string) {
        const deepClone = JSON.parse(JSON.stringify(question));
        deepClone[key] = value
        setQuestion(deepClone)
    }

    const headerElement = (
        <span className="layout-menuitem-text">Select the component</span>
    )

    const save = () => {
        setLoading(true);
        if (form) {
            form.name = formName

            Object.entries(question).map(([key, question]) => {
                form.fields[key].question = question
            })

            createForm(form).then(r => {
                setLoading(false)
            })
        }
    }

    const addNewComponent = (component: string) => {
        setVisible(false)
        if (form?.fields) {
            form.fields["field-" + fieldIndex] = {
                type: component as FieldType,
                question: "",
                required: false
            }
            setFieldIndex(Object.keys(form.fields).length + 1)
        } else {
            console.warn("Response data or fields are not available.");
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchById(params.id)
                .then((item) => {
                    console.log(item);

                    setFormName(item?.name)
                    setFieldIndex(Object.keys(item.fields).length + 1)

                    Object.entries(item.fields).map(([key, fieldAny]) => {
                        question[key] = item.fields[key].question
                    })

                    setForm(item)
                    console.log("xxx" + question)

                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            let form = {
                id: "",
                name: "",
                fields: {}
            } as Form
            setForm(form)
            setFormName(form?.name)
            setQuestion({})
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
                    {Object.entries(form.fields).map(([key, fieldAny]) => {
                        const field = (fieldAny as Field)
                        switch (field.type) {
                            case 'text':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full"
                                               value={question[key]}
                                               onChange={(e) => onQuestionChanged(key, e.target.value)}
                                               placeholder="Please, fill your question"></InputText>
                                    <div className="flex gap-3 w-full">
                                        <InputText className="w-3/5" placeholder="Input Text" type="text"></InputText>
                                        {/*<Checkbox checked={field.required} onChange={(e) => field.required = !!e.checked}/> <span>Is required?</span>*/}
                                    </div>

                                </div>
                            case 'datetime':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full"
                                               value={question[key]}
                                               onChange={(e) => onQuestionChanged(key, e.target.value)}
                                               placeholder="Please, fill your question"></InputText>
                                    <Calendar className="w-full" placeholder="Datetime" value={datetime24h} showTime
                                              showIcon hourFormat="24"/>
                                </div>
                            case 'number':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full"
                                               value={question[key]}
                                               onChange={(e) => onQuestionChanged(key, e.target.value)}
                                               placeholder="Please, fill your question"></InputText>
                                    <InputNumber className="w-full" placeholder="Number" showButtons
                                                 mode="decimal"></InputNumber>
                                </div>
                            case 'boolean':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full"
                                               value={question[key]}
                                               onChange={(e) => onQuestionChanged(key, e.target.value)}
                                               placeholder="Please, fill your question"></InputText>
                                    <div className="flex align-items-center">
                                        <Checkbox checked={true}/>
                                        <label className="ml-2">Boolean</label>
                                    </div>
                                </div>
                            case 'rating':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full"
                                               value={question[key]}
                                               onChange={(e) => onQuestionChanged(key, e.target.value)}
                                               placeholder="Please, fill your question"></InputText>
                                    <Rating className="w-full"/>
                                </div>

                            default:
                                return <div key={key}>Unknown Field Type: {key}</div>;
                        }
                    })}

                    <div className={styles.dottedGrayBorder} onClick={() => setVisible(true)}>
                        <span><i className="layout-menuitem-icon pi pi-fw pi-plus"></i>Add new component</span>
                    </div>

                    <Dialog visible={visible} modal header={headerElement}
                            style={{width: '50rem'}} onHide={() => {
                        if (!visible) return;
                        setVisible(false);
                    }}>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4"
                                 onClick={() => addNewComponent(FieldType.DATETIME)}>
                                <i className="pi pi-fw pi-calendar !text-3xl"></i>
                                <p>Date and time</p>
                            </div>

                            <div className="flex items-center gap-4"
                                 onClick={() => addNewComponent(FieldType.TEXT)}>
                                <i className="pi pi-fw pi-bars !text-3xl"></i>
                                <p>Input Text</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.NUMBER)}>
                                <i className="pi pi-fw pi-sort-numeric-down !text-3xl"></i>
                                <p>Input Number</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.BOOLEAN)}>
                                <i className="pi pi-fw pi-check !text-3xl"></i>
                                <p>Boolean</p>
                            </div>

                            <div className="flex items-center gap-4" onClick={() => addNewComponent(FieldType.RATING)}>
                                <i className="pi pi-fw pi-star !text-3xl"></i>
                                <p>Rating</p>
                            </div>
                        </div>
                    </Dialog>
                </div>
            ) : ('Loading...')}


        </Container>

    )
}



