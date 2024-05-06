/* eslint-disable react/jsx-pascal-case */
import React from "react";
import LogInMenu from "../../UI/LogInMenu";
import LogIn from "./LogIn";
import classes from "../AuthPage.module.css";
import { Link } from "react-router-dom";
import Icons from "../../icons";

const LogInPage: React.FC = () => {
    return (
        <div className={classes.page}>
            <h1 className={classes.logo}>
                bu<span className={classes.point}>.</span>Tester
            </h1>
            <h2 className={classes.title}>
                <Link to='../' className={classes.link}>
                    <Icons.arrowBack classes={classes.arrow_back} />
                </Link>
                <LogInMenu text='Вход' />
            </h2>
            <LogIn />
        </div>
    );
};

export default LogInPage;
