import React from "react";
import classes from "./styles/AuthButton.module.css";

interface IAuthButtonProps {
    text: string;
    clickHandler?: () => void;
}

const AuthButton = ({ text, clickHandler }: IAuthButtonProps) => {
    return <div className={classes.btn} onClick={() => clickHandler && clickHandler()}>{text}</div>;
};

export default AuthButton;
