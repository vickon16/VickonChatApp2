import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, userCollectionRef, userChatCollectionRef, storage } from '../firebase.config';
import { errorHandler} from '../firebaseFunctions';

const inputStyles = 'outline-none border-b-lightGray border-b-2 px-4 py-2 w-full bg-transparent'

const Register = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({displayName: "", email : "", password : ""});
  const [file, setFiles] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name] : value}))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {displayName, email, password } = formData;
    if (!file)  {
      errorHandler(setError ,"Please, Add an Avatar Image");
      return;
    };

    try {
      // create user
      const resp = await createUserWithEmailAndPassword(auth, email, password)

      // upload user image
      const storageRef = ref(storage, `${displayName}--${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress)
    }, 
    (error) => {errorHandler(setError, "Failed to upload Image")}, 
    () => {getDownloadURL(uploadTask.snapshot.ref)
      .then(async (downloadURL) => {
        // update user profile with name and imageURL
        await updateProfile(resp.user, {displayName, photoURL : downloadURL})
        // create a database with the authenticated user id
        await setDoc(doc(userCollectionRef, resp.user.uid), {
          uid: resp.user.uid, displayName, email, photoURL : downloadURL
        }, {merge : true});
        // create a user chat collection
        await setDoc(doc(userChatCollectionRef, resp.user.uid), {})

        navigate("/")
      });
    })
    } catch(error) {errorHandler(setError, error.message)}
  };

  
  return (
    <section className="bg-white p-[40px] w-full max-w-[430px] rounded-md flex flex-col gap-y-5 items-center">
      <h1 className="text-[1.2rem] sm:text-[1.5rem] text-headingColor font-semibold">
        Cyril Chat App
      </h1>
      <p className="text-lg mb-3">Register</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          className={inputStyles}
          placeholder="Your Name..."
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          className={inputStyles}
          placeholder="Your Email..."
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          className={inputStyles}
          placeholder="Your password..."
          onChange={handleChange}
          required
        />
        <label htmlFor="file" className='flex items-center gap-x-2 cursor-pointer w-full'>
          <img src={file ? URL.createObjectURL(file) : "img/addAvatar.png"} className='w-8 h-8' alt="choose file" />
          <span>Add an Avatar</span>
        </label>
        <input 
          type="file" id='file' 
          accept='image/*' 
          onChange={(e) => setFiles(e.target.files[0])} 
          className={inputStyles + " hidden"} 
        /> 
        <button className='bg-primaryColor text-white px-2 py-3 rounded-md my-2 font-bold'>Sign up</button>
        {progress > 0 && <p className='text-center w-full'>Upload is <span className='text-emerald-400 text-lg'>{progress.toFixed(1)}</span>% done</p>}
        {error && <p className='bg-red-400 text-white text-center py-1'>{error}</p>}
      </form>
      <p className='text-sm'>Do you have an account? <Link to="/login" className=' text-blue-400' >Login </Link></p>
    </section>
  );
}

export default Register