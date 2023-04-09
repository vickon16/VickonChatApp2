import { createContext, useContext, useReducer } from "react";
import { auth } from "../firebase.config";
import { useAuth } from "./AuthContext";

const UserChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const initialState = {chatId : null,user : {}}
  const {currentUser} = useAuth();

  const chatReducer = (state, action) => {
    switch(action.type) {
      case "CHANGE_USER" : 
        return {
          user : action.payload,
          chatId : currentUser?.uid > action.payload.uid
        ? currentUser.uid + "-" + action.payload.uid
        :  action.payload.uid + "-" + currentUser.uid
        }
      default :
        return state;
    }
  }

  return (
    <UserChatContext.Provider value={useReducer(chatReducer, initialState)}>
      {children}
    </UserChatContext.Provider>
  );
};

export const useChat = () => useContext(UserChatContext);
