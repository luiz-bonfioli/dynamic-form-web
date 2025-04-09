import React, {useEffect} from "react";
import styles from './layout.module.css';

// @ts-expect-error Children is generic
export function Sidebar({children}) {

    useEffect(() => {
        console.log('Sidebar component mounted');
    }, []);

    return (
        <div className={styles.layoutSidebar}>
            {children}
        </div>
    )
}

export default Sidebar



