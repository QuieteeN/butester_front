/* eslint-disable react/jsx-pascal-case */
import React from "react";
import LogInMenu from "../../UI/LogInMenu";
import SignUp from "./SignUp";
import classes from "../AuthPage.module.css";
import { Link } from "react-router-dom";
import Icons from "../../icons";

const SignUpPage: React.FC = () => {
    return (
        <div className={classes.page}>
            <h1 className={classes.logo}>
                bu<span className={classes.point}>.</span>Tester
            </h1>
            <h2 className={classes.title}>
                <Link to='../' className={classes.link}>
                    <Icons.arrowBack classes={classes.arrow_back} />
                </Link>
                <LogInMenu text='Регистрация' />
            </h2>
            <SignUp />
        </div>
    );
};

export default SignUpPage;
