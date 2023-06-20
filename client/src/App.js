import {React,Fragment,useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import setAuthToken from './utilts/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './actions/auth';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
if(localStorage.token){
  // if localStorege token exits we will set it in global header
  setAuthToken(localStorage.token);
}
const App = () =>{
  // useEffect keep running untill we have some value.. so by giving [] we are running useEffect only once.
  // it means component didmount..
  // mounting ,unmounting,udating.
  useEffect(()=>{
    store.dispatch(loadUser());
  },[])
  return (
    <Provider store = {store }>
  <Router>
    <Fragment>
      <Navbar />
     

    {/*we have to wrap everything in the routes and react.fragment.*/}
    <Routes>
        <Route exact path = '/' element={<Landing/>} />
    </Routes>
    <section className='container'>
    <Alert />
      <Routes>
      <Route element = {<PrivateRoute />}>
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/create-profile' element = {<CreateProfile />} />
          <Route exact path='/edit-profile' element = {<EditProfile />} />
          <Route exact path='/add-experience' element = {<AddExperience />} />
          <Route exact path='/add-education' element = {<AddEducation />} />
          <Route exact path='/posts' element = {<Posts />} />
          <Route exact path='/post/:id' element= {<Post />} />

      </Route>
        <Route exact path='/login' element= {<Login/>} />
        <Route exact path='/profile/:id' element = {<Profile />} />
        <Route exact path='/register' element= {<Register/>} />
        <Route exact path='/profiles' element= {<Profiles />} />

      </Routes>
      
    </section>
    </Fragment>
  </Router>
  </Provider>
  );
}

export default App;
