import React, {useEffect} from "react";
import styles from './layout.module.css';
import {Button} from "primereact/button";


type TopbarProps = {
    title: string
};

export function Topbar({title}: TopbarProps) {

    return (
        <div className={styles.layoutTopbar}>
            <i className="pi pi-fw pi-file m-2 !text-3xl"></i>
            <span>{title}</span>
        </div>
    )
}

export default Topbar



