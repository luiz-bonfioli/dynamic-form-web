import React, {useEffect, useState} from "react"
import Container from "../layout/Container"
import {useParams} from "react-router-dom"
import {fetchByFormId} from "../services/SourceService"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"

export function FormData() {

    const params = useParams<{ id: string }>()
    const [sourceData, setSourceData] = useState<Record<string, string>[]>([])
    const [columns, setColumns] = useState<{ id: string, field: string, header: string }[]>([])

    useEffect(() => {
        if (params.id) {
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
                ).catch(err => console.log(err))
        }
    }, [params])

    return (
        <Container>
            {columns ? (
                <DataTable value={sourceData} tableStyle={{minWidth: '50rem'}}>
                    {columns.map((col, i) => (
                        <Column key={col.id} field={col.field} header={col.header}/>
                    ))}
                </DataTable>
            ) : ('Loading...')}

        </Container>
    )
}



