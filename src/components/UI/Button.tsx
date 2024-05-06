import React from "react";
import classes from "./styles/Button.module.css";
import { ButtonColors } from "../../types/button";

interface IButtonProps {
    color: ButtonColors;
    text: string;
    href?: string;
}

const Button: React.FC<IButtonProps> = ({ color, text, href }: IButtonProps) => {
    let btnClasses = classes.btn;

    switch (color) {
        case ButtonColors.Black:
            btnClasses += " " + classes.black_btn;
            break;
        case ButtonColors.White:
            btnClasses += " " + classes.white_btn;
            break;
        default:
            break;
    }

    return (
        <a href={href} className={btnClasses}>
            {text}
        </a>
    );
};

export default Button;
