// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const initial = { user: null, token: null, loading: true };

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case "LOGOUT":
      return { user: null, token: null, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // On app load restore token + user
  useEffect(() => {
    const token=localStorage.getItem("token");
    if(!token){
      dispatch({type:"LOGOUT"});
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE}/auth/me`,{
      header:{Authorization:`Bearer ${token}`},
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.success){
        dispatch({type:"LOGIN", payload:{user:data.data.user,token}});
      }else{
        logout();
      }
    })
    .catch(()=>logout());
  
  }, []);
  

  // login helper: save to storage + context
  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return <AuthContext.Provider value={{ ...state, login, logout}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
