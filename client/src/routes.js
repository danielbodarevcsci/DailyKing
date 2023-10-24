import Home from './pages/Home/Home.js'
import {Routes, Route} from 'react-router-dom';

const AllRoutes = () => {
    return (
        <Routes>
            <Route exact path='/' element={<Home/>} />
        </Routes>
    );
};

export default AllRoutes;