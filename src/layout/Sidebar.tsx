import React, {useEffect} from "react";
import styles from './layout.module.css';

// @ts-expect-error Children is generic
export function Sidebar({children}) {

    return (
        <div className={styles.layoutSidebar}>
            {children}
        </div>
    )
}

export default Sidebar



