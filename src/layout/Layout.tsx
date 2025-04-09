import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import styles from "./layout.module.css";
import {Link, Outlet, Route, Routes} from "react-router-dom";
import Container from "./Container";
import {Forms} from "../forms/Forms";
import {FormDetail} from "../forms/FormDetail";


export function Layout() {
    return (
        <>
            <div className={styles.layoutWrapper}>
                <Routes>
                    <Route path='/' element={<Container>Home</Container>}/>
                    <Route path='/forms' element={<Forms/>}/>
                    <Route path='/forms/:id/builder' element={<FormDetail/>}/>
                    <Route path='/forms/builder' element={<FormDetail/>}/>
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
                            <li className="inline-block align-top">
                                <i className="pi pi-fw pi-database m-2"></i>
                                <Link to="/forms/builder">Forms Data</Link>
                            </li>
                            <li className="inline-block align-top">
                                <i className="pi pi-fw pi-file-plus m-2"></i>
                                <Link to="/forms/builder">Forms Input</Link>
                            </li>
                        </ul>
                    </nav>
                </Sidebar>
                <Outlet/>
            </div>
        </>
    )
}