/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import classes from "../AuthPage.module.css";
import AuthInput from "../../UI/AuthInput";
import { Link } from "react-router-dom";
import AuthButton from "../../UI/AuthButton";
import Icons from "../../icons";

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState("");
    const [passwordRepeated, setPasswordRepeated] = useState("");
    const [isEye, setIsEye] = useState(true);
    const [isEyeRepeated, setIsEyeRepeated] = useState(true);

    return (
        <div className={classes.page}>
            <h1 className={classes.logo}>
                bu<span className={classes.point}>.</span>Tester
            </h1>
            <form className={classes.form}>
                <AuthInput
                    text='Новый пароль'
                    type={isEye ? "password" : "text"}
                    value={password}
                    setValue={setPassword}
                >
                    <Icons.password classes={password ? classes.icon + " " + classes.active : classes.icon} />
                    {isEye ? (
                        <Icons.eye classes={classes.eye} onClick={() => setIsEye(false)} />
                    ) : (
                        <Icons.eyeSlash classes={classes.eye} onClick={() => setIsEye(true)} />
                    )}
                </AuthInput>
                <AuthInput
                    text='Повторите пароль'
                    type={isEyeRepeated ? "password" : "text"}
                    value={passwordRepeated}
                    setValue={setPasswordRepeated}
                >
                    <Icons.password classes={passwordRepeated ? classes.icon + " " + classes.active : classes.icon} />
                    {isEyeRepeated ? (
                        <Icons.eye classes={classes.eye} onClick={() => setIsEyeRepeated(false)} />
                    ) : (
                        <Icons.eyeSlash classes={classes.eye} onClick={() => setIsEyeRepeated(true)} />
                    )}
                </AuthInput>
                <AuthButton text='Изменить' />
                <p className={classes.auth_foot}>
                    Есть аккаунт?{" "}
                    <Link to='/log-in' className={classes.link}>
                        Войти
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
