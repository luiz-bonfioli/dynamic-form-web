import React, {useEffect, useState} from "react";
import Container from "../layout/Container";
import {createForm, fetchById} from "../services/formsService";
import {Field, FieldType, ResponseDataSingle} from "../services/formsModel";
import {useParams} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import styles from '../layout/layout.module.css';
import {Dialog} from "primereact/dialog";
import {Rating} from "primereact/rating";
import {Checkbox} from "primereact/checkbox";

export function FormDetail() {

    const params = useParams<{ id: string }>()
    const [responseData, setResponseData] = useState<ResponseDataSingle>()
    const [datetime24h, setDateTime24h] = useState(null)
    const [loading, setLoading] = useState(false)
    const [fieldIndex, setFieldIndex] = useState(1)
    const [visible, setVisible] = useState(false)
    const [formName, setFormName] = useState('')

    const headerElement = (
        <span className="layout-menuitem-text">Select the component</span>
    )


    const save = () => {
        setLoading(true);
        if (responseData?.data) {
            createForm(responseData?.data).then(r => {
                setLoading(false)
            })
        }
    }

    const addNewComponent = (component: string) => {
        setVisible(false)
        if (responseData?.data?.fields) {
            responseData.data.fields["field-" + fieldIndex] = {
                type: component as FieldType,
                question: "Fill your question",
                required: false
            }
            setFieldIndex(fieldIndex + 1)
            console.log(responseData.data.fields);
        } else {
            console.warn("Response data or fields are not available.");
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchById(params.id)
                .then((data) => {
                    setResponseData(data)
                    setFormName(data?.data?.name)
                    setFieldIndex(Object.keys(data?.data.fields).length + 1)

                })
                .catch(err => {
                    console.log(err);
                })

        } else {
            let data = {
                statusCode: "200",
                data: {
                    id: "form-123",
                    name: "Feedback Form",
                    fields: {}
                }
            }
            setResponseData(data)
        }

    }, [params])

    return (
        <Container>
            {responseData ? (

                <div>
                    <div className="flex justify-end">
                        <Button label="Save" icon="pi pi-check" loading={loading} onClick={save}/>
                    </div>
                    <div className="flex flex-col items-start p-3">
                        <h3 className="font-bold">Form name</h3>
                        <InputText value={formName}
                                   onChange={(e) => setFormName(e.target.value)}
                                   className="w-full"
                                   placeholder="Form title"></InputText>
                    </div>
                    {Object.entries(responseData.data.fields).map(([key, fieldAny]) => {
                        const field = (fieldAny as Field)
                        switch (field.type) {
                            case 'text':
                                return <div key={key}
                                            className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full" value={field.question} placeholder="Question"></InputText>
                                    <InputText className="w-full" placeholder="Input Text" type="text"></InputText>
                                </div>
                            case 'datetime':
                                return <div key={key}
                                             className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full" placeholder={field.question}></InputText>
                                    <Calendar className="w-full" placeholder="Datetime" value={datetime24h} showTime
                                              showIcon hourFormat="24"/>
                                </div>
                            case 'number':
                                return <div key={key}
                                             className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full" placeholder={field.question}></InputText>
                                    <InputNumber className="w-full" placeholder="Number" showButtons
                                                 mode="decimal"></InputNumber>
                                </div>
                            case 'boolean':
                                return <div key={key}
                                             className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full" placeholder={field.question}></InputText>
                                    <div className="flex align-items-center">
                                        <Checkbox checked={true}/>
                                        <label className="ml-2">Boolean</label>
                                    </div>
                                </div>
                            case 'rating':
                                return <div key={key}
                                             className={`${styles.dottedGrayBorder} flex flex-col items-start gap-3`}>
                                    <h3 className="font-bold">Question</h3>
                                    <InputText className="w-full" placeholder={field.question}></InputText>
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



