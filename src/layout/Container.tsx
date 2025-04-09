import React from "react";
import styles from './layout.module.css';

// @ts-expect-error Children is generic
export function Container({children}) {
    return (
        <div className={styles.layoutContainer}>
            {children}
        </div>
    )
}

export default Container



