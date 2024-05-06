import React, { ReactNode } from "react";
import classes from "./styles/AuthInput.module.css";

interface IAuthInputProps {
    text: string;
    type: string;
    value: string;
    setValue: (value: string) => void;
    children: ReactNode;
}

const AuthInput: React.FC<IAuthInputProps> = ({ text, type, children, value, setValue }: IAuthInputProps) => {
    function onChangeHanler(value: string): void {
        setValue(value);
    }

    return (
        <div className={classes.input_block}>
            <div className={classes.label}>{text}</div>
            <div className={value ? classes.input + " " + classes.active : classes.input}>
                <input type={type} placeholder={text} onChange={(e) => onChangeHanler(e.target.value)} value={value} />
                {children}
            </div>
        </div>
    );
};

export default AuthInput;
