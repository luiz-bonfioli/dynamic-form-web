import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import styles from "../layout/layout.module.css"
import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button"
import {Form} from "../models/FormModels"
import {fetchAll} from "../services/FormsService"

type FormsProps = {
    onSuccess: (message: string) => void
    onError: (error: string) => void
}

// This component lists all forms and actions for each one
export function Forms({onError}: FormsProps) {

    const [forms, setForms] = useState<Form[]>()
    const navigate = useNavigate()

    // Fetches all forms from the backend when the component mounts
    useEffect(() => {
        fetchAll()
            .then(setForms)
            .catch(err => {
                onError("Something went wrong. Please try again later.")
            })
    }, [])

    // Navigates to the form builder page (used to edit or clone a form)
    const handleBuildClick = (item: Form) => {
        navigate(`/forms/${item.id}/builder`)
    }

    // Navigates to the form data page (view collected answers)
    const handleDataClick = (item: Form) => {
        navigate(`/forms/${item.id}/data`)
    }

    // Navigates to the form fill page (fill out the form as a user)
    const handleFillClick = (item: Form) => {
        navigate(`/forms/${item.id}/fill`)
    }

    // Navigates to the page to create a new form
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
                                <Button icon="pi pi-clone" severity="secondary"
                                        tooltip="Clone your form. Edit is allowed."
                                        tooltipOptions={{position: 'left'}} rounded
                                        onClick={() => handleBuildClick(item)}/>
                                <Button icon="pi pi-file-plus" severity="secondary" tooltip="Fill out your form."
                                        tooltipOptions={{position: 'top'}} rounded
                                        onClick={() => handleFillClick(item)}/>
                                <Button icon="pi pi-database" tooltip="View your forms data."
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



