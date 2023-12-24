import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import auth from "../../firebase/firebase.config";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";




const Register = () => {
    const [registerError, setRegisterError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);



    const handleRegister = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const accepted = e.target.terms.checked;
        console.log(name, email, password, accepted);

        if (password.length < 6) {
            setRegisterError('Password should be at least 6 characters (auth/weak-password')
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setRegisterError('your password should have at least one upper case characters')
            return;
        }

        else if (!accepted) {
            setRegisterError('Please accept our terms and condition')
            return;
        }

        //reset error
        setRegisterError('')
        setSuccess('');


        //create user
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                console.log(result.user)
                if (result.user.emailVerified) {
                    setSuccess('User created successfully')


                    // update your profile
                    // updateProfile(result.user, {
                    //     displayName: name,
                    //     photoURL: "https://example.com/jane-q-user/profile.jpg"
                    // })
                    updateProfile(result.user, {
                        displayName: name,
                        photoURL: "https://example.com/jane-q-user/profile.jpg"

                    })
                        .then(() => {
                            console.log('profile updated')
                        })
                        .catch()


                }
                else {
                    alert('plase verify your email')
                }

                //send verification email
                sendEmailVerification(result.user)
                    .then(() => {
                        alert('please check your email and verify your email')
                    })

            })
            .catch(error => {
                console.error(error)
                setRegisterError(error.message)
            })
    }
    return (
        <div className="">
            <div className="mx-auto md:w-1/2">
                <h2 className="text-3xl mb-4 ">This is Register</h2>
                <form onSubmit={handleRegister}>
                    <input className="mb-4 w-full px-4 py-2" placeholder="Your name" required type="text" name="name" id="" />
                    <input className="mb-4 w-full px-4 py-2" placeholder="Your Email Address" required type="email" name="email" id="" />
                    <br />
                    <div className="relative mb-2">
                        <input
                            className=" w-full px-4 py-2"
                            placeholder="password"
                            type={showPassword ? "text" : "password"}
                            required name="password" id="" />
                        <span className="absolute top-3 right-2" onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>
                            }
                        </span>
                    </div>
                    <br />
                    <div className="mb-2">
                        <input type="checkbox" name="terms" id="terms" />
                        <label className="ml-2" htmlFor="terms">Accept out <a href="">Terms and Condition</a></label>
                    </div>
                    <br />
                    <input className="btn btn-secondary mb-4 w-full " type="submit" value="register" />
                </form>
                {
                    registerError && <p className="text-red-600">{registerError}</p>
                }
                {
                    success && <p className="text-green-700">{success}</p>
                }
                <p>Already have an account <Link to='/login'>Login</Link></p>
            </div>
        </div>
    );
};

export default Register;