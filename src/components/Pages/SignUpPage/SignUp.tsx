/* eslint-disable react/jsx-pascal-case */
import React, { useRef, useState } from "react";
import AuthInput from "../../UI/AuthInput";
import Icons from "../../icons";
// import AuthButton from "../../UI/AuthButton";
import { Link, useNavigate } from "react-router-dom";
import classes from "../AuthPage.module.css";
import { useRegistrationUserMutation } from "../../../services/authApi";
import AuthButton from "../../UI/AuthButton";
// import { ReactComponent as EmailIcon } from "../../../svgs/email.svg";

const SignUp: React.FC = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [registrUser] = useRegistrationUserMutation();

    const [isEye, setIsEye] = useState(true);
    const [isEyeRepeat, setIsEyeRepeat] = useState(true);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    const errorRef = useRef<HTMLSpanElement>(null);

    function onClickEye(value: boolean) {
        setIsEye(value);
    }

    const registrHandler = async () => {
        const visitor = {
            "username": name,
            "password": password,
            "confirmPassword": repeatPassword,
            "email": email,
        }

        try {
            const result = await registrUser(visitor);
                
            if ('error' in result) {
                if ('status' in  result.error && 'data' in result.error) {
                    if (result.error.status === 400 && errorRef.current) {
                        if (email.length === 0) {
                            errorRef.current.innerText = 'Поле почты не должно быть пустым'
                        }

                        if (name.length < 5 || name.length > 30) {
                            errorRef.current.innerText = 'Имя должно быть от 5 до 30 символов'
                        }
                        
                        if (password.length < 10 || password.length > 50) {
                            errorRef.current.innerText = 'Пароль должен быть от 10 до 50 символов';
                        }

                        if (password !== repeatPassword) {
                            errorRef.current.innerText = 'Пароли должны совподать'
                        }
                        setIsError(true);
                        return;
                    }
                    if (result.error.status === 404 && errorRef.current) {
                        errorRef.current.innerText = 'Человека с такой почтой нет'
                        setIsError(true);
                        return;
                    }
                    if (result.error.status === 500 && errorRef.current) {
                        errorRef.current.innerText = 'Проблема с сервером'
                        setIsError(true);
                        return;
                    }
                }
            } 

            navigate('/log-in')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className={classes.form}>
            <AuthInput text='Имя' type='text' value={name} setValue={setName}>
                <Icons.user classes={name ? classes.icon + " " + classes.active : classes.icon} />
            </AuthInput>
            <AuthInput text='Почта' type='text' value={email} setValue={setEmail}>
                <Icons.email classes={email ? classes.icon + " " + classes.active : classes.icon} />
            </AuthInput>
            <AuthInput text='Пароль' type={isEye ? "password" : "text"} value={password} setValue={setPassword}>
                <Icons.password classes={password ? classes.icon + " " + classes.active : classes.icon} />
                {isEye ? (
                    <Icons.eye classes={classes.eye} onClick={() => onClickEye(false)} />
                ) : (
                    <Icons.eyeSlash classes={classes.eye} onClick={() => onClickEye(true)} />
                )}
            </AuthInput>
            <AuthInput text='Повторите пароль' type={isEyeRepeat ? "password" : "text"} value={repeatPassword} setValue={setRepeatPassword}>
                <Icons.password classes={password ? classes.icon + " " + classes.active : classes.icon} />
                {isEyeRepeat ? (
                    <Icons.eye classes={classes.eye} onClick={() => setIsEyeRepeat(false)} />
                ) : (
                    <Icons.eyeSlash classes={classes.eye} onClick={() => setIsEyeRepeat(true)} />
                )}
            </AuthInput>
            <span ref={errorRef} className={`${classes.error} ${isError ? classes.active : ''}`}></span>
            <AuthButton text='Регистрация' clickHandler={registrHandler}/>
            <p className={classes.auth_foot}>
                Уже имеете аккаунт?{" "}
                <Link to='/log-in' className={classes.link}>
                    Войти
                </Link>
            </p>
        </form>
    );
};

export default SignUp;
