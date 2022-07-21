import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import "./sign-up-form.styles.scss";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";

import Button from "../button/button.component";

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const SignUpForm = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

    console.log(formFields);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) =>{
        // similar to signin component
        // we handle all that will happen in the form-> just tell us when the form has been submitted
        event.preventDefault();
        // triggers on onSubmit with form
        // confirm that the password matches with the confirm password
        if (password != confirmPassword){
            // createAuthUserWithEmailAndPassword
            alert('passwords do not match');
            return;
        };

        // pass in email and password to the actual document we are trying to create

        try {
            const {user} = await createAuthUserWithEmailAndPassword(email, password);

            await createUserDocumentFromAuth (user, { displayName });

            resetFormFields();

        } catch(error) {
            if (error.code === 'auth/email-already-in-use'){
                alert('Email is already in use')
            }else{
                console.log(`user creation encountered an error: ${error}`);
            }
        }
        // check if we have authenticated the user with email and password
        // create a user document with what createAuthUserWithEmailAndPassword returns


    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({...formFields, [name]: value});
    };

    return (
      <div className="sign-up-container">

        <h2>Don't have an account?</h2>

        <span>Sign up with your email and password</span>

        <form onSubmit={handleSubmit}>
            <label>Display Name</label>
            <FormInput label="Display Name" type="text" required onChange={handleChange} name="displayName" value={displayName}/>

            <label>Email</label>
            <FormInput label="Email" type="email" required onChange={handleChange} name="email" value={email}/>

            <label>Password</label>
            <FormInput label="Password" type="password" required onChange={handleChange} name="password" value={password}/>

            <label>Confirm Password</label>
            <FormInput label="Confirm Password" type="password" required onChange={handleChange} name="confirmPassword" value={confirmPassword}/>
            <Button buttonType='inverted' type="submit">Sign Up</Button>
        </form>
      </div>
        )
};

export default SignUpForm;