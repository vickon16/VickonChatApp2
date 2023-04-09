import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";

const UserAuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, user => {
      if (user) {setCurrentUser(user)}
      setLoading(false);
    })
    return () => unSub();
  }, [])
  
  return (<UserAuthContext.Provider value={{currentUser, setCurrentUser}}>
    {!loading ? children : <div className="text-2xl text-dark font-bold w-full mt-[10rem]  text-center justify-center">...Loading...</div>}
  </UserAuthContext.Provider>
  )
}

export const useAuth = () => useContext(UserAuthContext);