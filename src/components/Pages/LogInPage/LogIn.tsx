/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import AuthInput from "../../UI/AuthInput";
import AuthButton from "../../UI/AuthButton";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../icons";
import classes from "../AuthPage.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changePassword, changeUsername } from "../../../app/features/user/userSlice";
import { useAuthUserMutation } from "../../../services/authApi";

const LogIn: React.FC = () => {
    const user = useSelector((state: any) => state.user);
    const [authUser] = useAuthUserMutation();
    const dispatch = useDispatch();
    const [isEye, setIsEye] = useState(true);
    const navigate = useNavigate();

    function onClickEye(value: boolean) {
        setIsEye(value);
    }

    function setEmail(email: string) {
        dispatch(changeUsername(email));
    }

    function setPassword(password: string) {
        dispatch(changePassword(password))
    }

    const authHandler = async () => {
        const visitor = {
            "username":user.username,
            "password": user.password,
        }

        try {
            const result = await authUser(visitor);

            if ('data' in result) {
                const token = result.data;
                localStorage.setItem('token', token?.token);
                localStorage.setItem('login', user.username);
                console.log(token);
                navigate("/generate-test");
                window.location.reload()
            } else {
                // Handle error case
                const error = result.error;
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <form className={classes.form}>
            <AuthInput text='Логин' type='text' value={user.username} setValue={setEmail}>
                <Icons.user classes={user.username ? classes.icon + " " + classes.active : classes.icon} />
            </AuthInput>
            <AuthInput text='Пароль' type={isEye ? "password" : "text"} value={user.password} setValue={setPassword}>
                <Icons.password classes={user.password ? classes.icon + " " + classes.active : classes.icon} />
                {isEye ? (
                    <Icons.eye classes={classes.eye} onClick={() => onClickEye(false)} />
                ) : (
                    <Icons.eyeSlash classes={classes.eye} onClick={() => onClickEye(true)} />
                )}
            </AuthInput>
            <div className={classes.help}>
                <Link to='/reset-password' className={classes.link}>
                    Забыли пароль?
                </Link>
            </div>
            <AuthButton text='Войти' clickHandler={authHandler} />
            <p className={classes.auth_foot}>
                Нету аккаунта?{" "}
                <Link to='/sign-up' className={classes.link}>
                    Регистрация
                </Link>
            </p>
        </form>
    );
};

export default LogIn;
