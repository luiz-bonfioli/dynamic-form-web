import React, {useEffect} from "react";
import styles from './layout.module.css';


type TopbarProps = {
    title: string
};

export function Topbar({title}: TopbarProps) {

    useEffect(() => {
        console.log('Topbar component mounted');
    }, []);

    return (
        <div className={styles.layoutTopbar}>
            <span>{title}</span>
            {/*<Button*/}
            {/*    icon="pi pi-plus"*/}
            {/*    className="mr-2"*/}
            {/*    label="Increment"*/}

            {/*></Button>*/}
        </div>
    )
}

export default Topbar



