import React, {useRef} from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import styles from "./layout.module.css";
import {Link, Outlet, Route, Routes} from "react-router-dom";
import Container from "./Container";
import {Forms} from "../forms/Forms";
import {FormDetail} from "../forms/FormDetail";
import {FormFill} from "../forms/FormFill";
import {FormData} from "../forms/FormData";
import {Toast} from "primereact/toast";


export function Layout() {

    const toast = useRef(null);

    const showSuccess = (message: string) => {
        // @ts-ignore
        toast.current.show({severity: 'success', summary: 'Success', detail: message, life: 3000});
    }

    const showError = (message: string) => {
        // @ts-ignore
        toast.current.show({severity: 'error', summary: 'Error', detail: message, life: 3000});
    }

    return (
        <>
            <Toast ref={toast}/>
            <div className={styles.layoutWrapper}>
                <Routes>
                    <Route path='/' element={<Container>Welcome to Dynamic Forms</Container>}/>
                    <Route path='/forms' element={<Forms/>}/>
                    <Route path='/forms/:id/builder'
                           element={<FormDetail onSuccess={showSuccess} onError={showError}/>}/>
                    <Route path='/forms/builder' element={<FormDetail onSuccess={showSuccess} onError={showError}/>}/>
                    <Route path='/forms/:id/fill' element={<FormFill onSuccess={showSuccess} onError={showError}/>}/>
                    <Route path='/forms/:id/data' element={<FormData/>}/>
                </Routes>
                <Topbar title="Dynamic Forms"/>
                <Sidebar>
                    <nav>
                        <ul className="flex flex-col gap-1 text-start">
                            <li className="inline-block align-top">
                                <i className="pi pi-fw pi-home m-2"></i>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="inline-block align-top">
                                <i className="pi pi-fw pi-file  m-2"></i>
                                <Link to="/forms">Forms List</Link>
                            </li>
                            <li className="inline-block align-top">
                                <i className="pi pi-fw pi-wrench m-2"></i>
                                <Link to="/forms/builder">Forms Builder</Link>
                            </li>
                        </ul>
                    </nav>
                </Sidebar>
                <Outlet/>
            </div>
        </>
    )
}