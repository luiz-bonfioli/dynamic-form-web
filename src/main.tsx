import React from "react";
import ReactDOM from "react-dom/client";
import {PrimeReactProvider} from "primereact/api";
import App from "./App";
// tailwind css
import "./index.css";
// primreact css
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import {BrowserRouter} from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <PrimeReactProvider value={{unstyled: false}}>
                <App/>
            </PrimeReactProvider>
        </BrowserRouter>
    </React.StrictMode>
);
