import React,{Fragment} from 'react';
import {BrowserRouter as Router,Route,Switch, Routes} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import './App.css';
// Redux
import {Provider} from 'react-redux';
import store from './store';
const App=()=> (
  <Provider store={store}> 
<Router> 
<Fragment>
    <Navbar/>   
    
    <Routes> 
    <Route path="/" element={<Landing />} />
    </Routes>
    <section className="container">
    <Alert />
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
    </Routes>


    </section>

    
    </Fragment>
 </Router>
 </Provider>
);

export default App;
