import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import {useParams} from "react-router-dom"
import {fetchByFormId} from "../services/SourceService"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {fetchById} from "../services/FormsService"

type FormDataProps = {
    onSuccess: (message: string) => void
    onError: (error: string) => void
}

// This is the component responsible to generate a dynamic table and show the records collected to the form
export function FormData({onError}: FormDataProps) {

    const params = useParams<{ id: string }>()
    const [sourceData, setSourceData] = useState<Record<string, string>[]>([])
    const [columns, setColumns] = useState<{ id: string, field: string, header: string }[]>([])
    const [formName, setFormName] = useState("")

    // Custom table header showing the form name
    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">{formName}</span>
        </div>
    )

    // Fetches the form
    const fetchForm = (formId: string) => {
        // Fetch the form by ID to get its name
        fetchById(formId).then((form) => {
            setFormName(form.name)
        }).catch(err => {
            console.log(err)
            onError("Something went wrong. Please try again later.")
        })
    }

    // Fetches the form records
    const fetchRecords = (formId: string) => {
        fetchByFormId(formId)
            .then((item) => {
                    if (item.length > 0) {
                        // Build table columns based on the questions in the data
                        const columnsArray = item[0].sourceData.map((sourceData) => ({
                            id: sourceData.id ? sourceData.id : "",
                            field: sourceData.question,
                            header: sourceData.question
                        }))

                        // Build table rows where each row maps question -> answer
                        const sourceDataArray: Record<string, string>[] = []
                        item.forEach(record => {
                            const row: Record<string, string> = {}
                            record.sourceData.forEach(sourceData => {
                                const key = sourceData.question
                                row[key] = sourceData.answer

                            })
                            sourceDataArray.push(row)
                        })

                        // Set the column config and data for the DataTable
                        setColumns(columnsArray)
                        setSourceData(sourceDataArray)
                    }
                }
            )
            .catch(err => {
                console.log(err)
                onError("Something went wrong. Please try again later.")
            })
    }

    // Load form info and related data when the component mounts
    useEffect(() => {
        if (params.id) {
            // Fetch the form
            fetchForm(params.id)

            // Fetch the records associated with the form
            fetchRecords(params.id);
        }
    }, [params])

    return (
        <Container>
            {columns ? (
                // Render the dynamic table with data and headers
                <DataTable header={header} value={sourceData} tableStyle={{minWidth: '50rem'}}>
                    {columns.map((col, i) => (
                        <Column key={col.id} field={col.field} header={col.header}/>
                    ))}
                </DataTable>
            ) : ('Loading...')}

        </Container>
    )
}



