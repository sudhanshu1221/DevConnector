import {v4 as uuid} from 'uuid';
import {SET_ALERT,REMOVE_ALERT} from './types';


export const setAlert=(msg,alertType,timeout=5000)=>dispatch=>{
  //gives random id
    const id=uuid();
    //coz each state need a id in react
    dispatch({
        type:SET_ALERT,
        payload:{msg,alertType,id}
    });
    // removes the alert
    setTimeout(()=> dispatch({type:REMOVE_ALERT,payload:id}),timeout);
};

