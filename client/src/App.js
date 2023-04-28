import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import './App.css';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard'; // Redux
import CreateProfile from './components/profile-forms/CreateProfile';
import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './components/routing/PrivateRoute';
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />

          <Routes>

            <Route path='/' element={<Landing />} />
          </Routes>
          <section className='container'>
            <Alert />
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route exact path='/dashboard' element={<Dashboard />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route exact path='/create-profile' element={<CreateProfile  />} />
              </Route>
              
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
