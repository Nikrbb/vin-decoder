import { Routes, Route } from "react-router-dom"

import VinDecoderPage from "../../routes/VinDecoderPage";
import AllVariablesPage from "../../routes/AllVariablesPage"
import VariablePage from "../../routes/VariablePage";
import Page404 from "../../routes/404";

const NavRoutes = () => {
    return <div>
        <Routes>
            <Route path='/decoder' element={ <VinDecoderPage/> } />
            <Route path='/variables' element={ <AllVariablesPage/> } />
            <Route path='/variables/:slug' element={ <VariablePage/> } />
            <Route path='*' element={ <Page404/> } />
        </Routes>
    </div>

}

export default NavRoutes;
