import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";


const Message = ({message}) => {
  const {currentUser} = useAuth();
  const [state] = useChat();
  const owner = message?.senderId === currentUser?.uid;
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior : "smooth"})
  }, [message])

  return (
    <article ref={ref} className={`flex gap-[20px] ${owner ? "flex-row-reverse" : ""} min-h-[70px]`}>
      <div className="message-info flex flex-col gap-1">
        <img
          src={message?.senderId === currentUser?.uid ? currentUser?.photoURL : state?.user.photoURL}
          className="w-10 h-10 rounded-full object-cover"
          alt="dummy"
        />
        <span className="text-gray-300 font-extralight text-[11px]">Just now</span>
      </div>
      <div className={`message-content max-w-[50%] flex flex-col gap-[10px] ${owner ? "items-end" : ""}`}>
        <p
          className={`${
            owner
              ? "bg-secondaryColor text-white rounded-lg rounded-tr-none"
              : "bg-white rounded-lg rounded-tl-none"
          } px-3 py-2 text-sm max-w-fit`}>{message?.text}
        </p>
       {message?.img && <img src={message?.img} className="w-[50%]" alt="dummy" />}
      </div>
    </article>
  );
}

export default Message