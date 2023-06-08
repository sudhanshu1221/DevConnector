import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';
//get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('./api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//create or update an profile
export const createProfile = (formData, navigate, edit) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/profile', formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    if (!edit) {
      navigate('/dashboard');
    }
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put('/api/profile/experience', formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Experience Added', 'success'));

    // const navigate = useNavigate();

    navigate('/dashboard');
    // dispatch(navigate('/dashboard', { replace: true }));
  } catch (err) {
    console.log(err.response);
    const errors = err.response.data.error; // was giving us null values not
    console.log(errors);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// ADD Education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log('upper');
    const res = await axios.put('/api/profile/education', formData, config);
    console.log('lower');

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert('Education Added', 'success'));

    // const navigate = useNavigate();
    // I have to fix it later on..

    // history.push('/dashboard');
    navigate('/dashboard');
    // dispatch(navigate('/dashboard', { replace: true }));
  } catch (err) {
    console.log(err.response);
    const errors = err.response.data.error; // was giving us null values not
    console.log(errors);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
