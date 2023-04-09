import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.config';
import { errorHandler } from '../firebaseFunctions';

const inputStyles = 'outline-none border-b-lightGray border-b-2 px-4 py-2 w-full bg-transparent'

const Login = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({displayName: "", email : "", password : ""});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      // log user in
      await signInWithEmailAndPassword(auth,email,password);
      navigate("/")
    } catch(error) {errorHandler(setError, error.message)}

  }

  return (
    <section className="bg-white p-[40px] w-full max-w-[430px] rounded-md flex flex-col gap-y-5 items-center">
      <h1 className="text-[1.2rem] sm:text-[1.5rem] text-headingColor font-semibold">
        Cyril Chat App
      </h1>
      <p className="text-lg mb-3">Login</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className={inputStyles}
          placeholder="Your Email..."
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className={inputStyles}
          placeholder="Your password..."
          required
        />
        <button className="bg-primaryColor text-white px-2 py-3 rounded-md my-2 font-bold">
          Login
        </button>
        {error && <p className='bg-red-400 text-white text-center py-1'>{error}</p>}
      </form>
      <p className="text-sm">
        You don't have an account? <Link to="/register" className=' text-blue-400'>Signup </Link>
      </p>
    </section>
  );
}

export default Login