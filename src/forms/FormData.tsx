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

export function FormData({onError}: FormDataProps) {

    const params = useParams<{ id: string }>()
    const [sourceData, setSourceData] = useState<Record<string, string>[]>([])
    const [columns, setColumns] = useState<{ id: string, field: string, header: string }[]>([])
    const [formName, setFormName] = useState("")

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">{formName}</span>
        </div>
    )

    useEffect(() => {
        if (params.id) {
            fetchById(params.id).then((form) => {
                setFormName(form.name)
            }).catch(err => {
                console.log(err)
                onError("Something went wrong. Please try again later.")
            })

            fetchByFormId(params.id)
                .then((item) => {
                        const columnsArray = item[0].sourceData.map((sourceData) => ({
                            id: sourceData.id ? sourceData.id : "",
                            field: sourceData.question,
                            header: sourceData.question
                        }))

                        const sourceDataArray: Record<string, string>[] = []
                        item.forEach(record => {
                            const row: Record<string, string> = {}
                            record.sourceData.forEach(sourceData => {
                                const key = sourceData.question
                                row[key] = sourceData.answer

                            })
                            sourceDataArray.push(row)
                        })
                        setColumns(columnsArray)
                        setSourceData(sourceDataArray)
                    }
                ).catch(err => {
                console.log(err)
                onError("Something went wrong. Please try again later.")
            })
        }
    }, [params])

    return (
        <Container>
            {columns ? (
                <DataTable header={header} value={sourceData} tableStyle={{minWidth: '50rem'}}>
                    {columns.map((col, i) => (
                        <Column key={col.id} field={col.field} header={col.header}/>
                    ))}
                </DataTable>
            ) : ('Loading...')}

        </Container>
    )
}



