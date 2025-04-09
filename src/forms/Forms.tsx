import React, {useEffect, useState} from "react";
import Container from "../layout/Container";
import {fetchAll} from "../services/formsService";
import {Form, ResponseData} from "../services/formsModel";
import styles from "../layout/layout.module.css";
import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";


export function Forms() {

    const [responseData, setResponseData] = useState<ResponseData>();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAll()
            .then(setResponseData)
            .catch(err => {
                console.log(err);
            })
    }, [])

    const handleClick = (item: Form) => {
        navigate(`/forms/${item.id}/builder`);
        console.log('Clicked item:', item);
    };

    const handleNewClick = () => {
        navigate(`/forms/builder`);
    };

    return (
        <Container>
            <div className="card flex justify-end">
                <Button label="New" icon="pi pi-plus" onClick={handleNewClick}/>
            </div>
            {responseData ? (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    {responseData.data.map((item, index) => (
                        <div
                            key={index}
                            className={styles.card}
                            onClick={() => handleClick(item)}>
                            {item.name}
                        </div>
                    ))}
                </div>
            ) : (
                'Loading...'
            )}
        </Container>

    )
}



