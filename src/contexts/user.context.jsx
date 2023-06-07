import { createContext, useState, useEffect, useReducer} from "react";
import {
    onAuthStateChangedListener,
    createUserDocumentFromAuth,
  } from '../utils/firebase/firebase.utils';

// as the actual value you want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

export const USER_ACTION_TYPE = {
  SET_CURRENT_USER: 'SET_CURRENT_USER'
}

function userReducer(state, action){
  console.log('dispatched')
  console.log(action);
  const {type, payload} = action;

  switch (type){
    case (USER_ACTION_TYPE.SET_CURRENT_USER):
      return {
        ...state,
        currentUser: payload,
      }
    default:
      throw new Error (`cannot handle ${type} in userReducer in user.context.jsx in contexts folder`)
    
  }
}

const INITIAL_STATE = { currentUser: null};

export const UserProvider = ({ children }) => {
    // const [currentUser, setCurrentUser] = useState(null);
    const [ {currentUser}, dispatch ] = useReducer(userReducer, INITIAL_STATE);
    console.log(currentUser);
    const setCurrentUser = (user) => {
      dispatch({
        type: USER_ACTION_TYPE.SET_CURRENT_USER,
        payload: user,
      })
    }

    const value = {currentUser, setCurrentUser};

    // signOutUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
          if (user) {
            createUserDocumentFromAuth(user);
          }
          setCurrentUser(user);
        });

        return unsubscribe;
      }, []);

      return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};