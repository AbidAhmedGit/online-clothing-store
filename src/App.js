import { Routes, Route, Outlet} from 'react-router-dom';

import Home from "./routes/home/home.component";
import Authentication from "./routes/authentication/authentication.component"
import Navigation from './routes/navigation/navigation.component';

const Shop = () => {
  return <h1>I am the shop page</h1>;
}

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Navigation />}>

          <Route index element={<Home /> } />
          <Route path='shop' element={<Shop /> } />
          <Route path='auth' element={<Authentication /> } />

        </Route>

    </Routes>
  );
};

export default App;