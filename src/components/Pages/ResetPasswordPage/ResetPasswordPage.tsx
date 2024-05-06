/* eslint-disable react/jsx-pascal-case */
import React, { useRef, useState } from "react";
import classes from "../AuthPage.module.css";
import AuthInput from "../../UI/AuthInput";
import { Link } from "react-router-dom";
import AuthButton from "../../UI/AuthButton";
import Icons from "../../icons";
import { useRestorePasswordMutation } from "../../../services/authApi";

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);

    const [restorePassword] = useRestorePasswordMutation();

    const errorRef = useRef<HTMLSpanElement>(null)

    const clickHandler = async () => {
        setIsError(false);

        const data = {
            email: email
        }

        try {
            const res = await restorePassword(data);
            console.log(res);
            if ('error' in res) {
                if ('status' in  res.error && 'data' in res.error) {
                    if (res.error.status === 400 && errorRef.current) {
                        errorRef.current.innerText = 'Почта должна быть от 1 до 120 символов'
                        setIsError(true);
                        return;
                    }
                    if (res.error.status === 404 && errorRef.current) {
                        errorRef.current.innerText = 'Человека с такой почтой нет'
                        setIsError(true);
                        return;
                    }
                    if (res.error.status === 500 && errorRef.current) {
                        errorRef.current.innerText = 'Проблема с сервером'
                        setIsError(true);
                        return;
                    }
                }
            } 

            if (errorRef.current) {
                errorRef.current.innerText = 'Новый пароль отправлен на почту'
                setIsError(true);
                return;
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={classes.page}>
            <h1 className={classes.logo}>
                bu<span className={classes.point}>.</span>Tester
            </h1>
            <form className={classes.form}>
                <h2 className={classes.title}>
                    <Link to='../log-in' className={classes.link}>
                        <Icons.arrowBack classes={classes.arrow_back} />
                    </Link>
                    Восстановление пароля
                </h2>
                <AuthInput text='Почта' type='text' value={email} setValue={setEmail}>
                    <Icons.email classes={email ? classes.icon + " " + classes.active : classes.icon} />
                </AuthInput>
                <span ref={errorRef} className={`${classes.error} ${isError ? classes.active : ''}`}></span>
                <AuthButton text='Отправить запрос' clickHandler={clickHandler} />
            </form>
        </div>
    );
};

export default ResetPasswordPage;
