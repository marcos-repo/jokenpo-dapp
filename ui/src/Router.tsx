import {Route, BrowserRouter, Routes, Navigate} from 'react-router-dom';
import type { JSX } from 'react';

import Login from './Login';
import Admin from './Admin';
import App from './App';

function Router() {

    type Props = {
        children: JSX.Element
    }

    function PrivateRoute({children}:Props) {
        const isAuth = localStorage.getItem("loginData") !== null;
        return isAuth ? children : <Navigate to='/' />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/admin' element={
                    <PrivateRoute>
                        <Admin />
                    </PrivateRoute>
                } />
                <Route path='/app' element={
                    <PrivateRoute>
                        <App />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );

}

export default Router;