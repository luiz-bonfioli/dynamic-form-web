import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import styles from "../layout/layout.module.css"
import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button"
import {Form} from "../models/FormModels"
import {fetchAll} from "../services/FormsService"

export function Forms() {

    const [forms, setForms] = useState<Form[]>()
    const navigate = useNavigate()

    useEffect(() => {
        fetchAll()
            .then(setForms)
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleBuildClick = (item: Form) => {
        navigate(`/forms/${item.id}/builder`)
    }

    const handleDataClick = (item: Form) => {
        navigate(`/forms/${item.id}/data`)
    }

    const handleFillClick = (item: Form) => {
        navigate(`/forms/${item.id}/fill`)
    }

    const handleNewClick = () => {
        navigate(`/forms/builder`)
    }

    return (
        <Container>
            <div className="card flex justify-end">
                <Button label="New" icon="pi pi-plus" onClick={handleNewClick}/>
            </div>
            {forms ? (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    {forms.map((item, index) => (
                        <div
                            key={index}
                            className={styles.formCard}>

                            <div className={styles.cardTitle}>{item.name}</div>

                            <div className={styles.cardButtons}>
                                <Button icon="pi pi-wrench" severity="secondary" tooltip="Edit your form"
                                        tooltipOptions={{position: 'left'}} rounded
                                        onClick={() => handleBuildClick(item)}/>
                                <Button icon="pi pi-file-plus" severity="secondary" tooltip="Fill out your form"
                                        tooltipOptions={{position: 'top'}} rounded
                                        onClick={() => handleFillClick(item)}/>
                                <Button icon="pi pi-database" severity="secondary" tooltip="See your forms data"
                                        tooltipOptions={{position: 'right'}} rounded
                                        onClick={() => handleDataClick(item)}/>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                'Loading...'
            )}
        </Container>

    )
}



