import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if(action.type === 'USER-INPUT'){
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type === 'INPUT-BLUR'){
    return {value: state.value, isValid: state.value.includes('@')};
  }
  return {value:'', isValid:false};
};

const passwordReducer = (state, action) => {
  if(action.type === "USER-INPUT"){
    return {value: action.val, isValid: action.val.trim().length > 6}
  }
  if(action.type === 'INPUT-BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6};
  }
  return {value:'', isValid:false};
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: null});
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value:'', isValid: null});

  // Runs once at the start, if no dependecies are passed 
  // not even "[]", then it runs after each render cycle
  // But if "[]" is passed, then it runs only once.
  // and if dependecy is passed, then it runs after the dependency has changed.
  // It can retrun a cleanup function, which doesn't run the first time it executes, 
  // but every subsquent time when dependency changes.
  // The cleanup function also returns when the dom element is removed.

  // Object destructuring
  // this is giving an alias, not assigning value
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("CHECKING");
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log("CLEANING");
      clearTimeout(identifier);
    };
    
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler =(event) => {
    dispatchEmail({type: 'USER-INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER-INPUT', val: event.target.value});

    // We use useReducer when a state is dependent on some other states. 
    // As the way React schedules it, might not work sometimes.
    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:"INPUT-BLUR"});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT-BLUR'});

  };

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    }else if (!emailIsValid){
      emailInputRef.focus();
    }else{
      passwordInputRef.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref = {emailInputRef}
          isValid={emailIsValid}
          label="E-mail" 
          id="email" 
          type="email" 
          value={emailState.value} 
          onChange={emailChangeHandler} 
          onBlur={validateEmailHandler}>
        </Input>
        <Input 
          ref={passwordInputRef}
          isValid={passwordIsValid} 
          label="Password"
          id="password" 
          type="password" 
          value={passwordState.value} 
          onChange={passwordChangeHandler} 
          onBlur={validatePasswordHandler}>
        </Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
