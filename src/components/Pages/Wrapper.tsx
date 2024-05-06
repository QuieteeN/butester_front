import React, { ReactNode } from "react";
import classes from "./styles.module.css";
import { Directions } from "../../types/wrapper";

interface IWrapperProps {
    direction: Directions;
    children: ReactNode;
}

const Wrapper: React.FC<IWrapperProps> = ({ direction, children }: IWrapperProps) => {
    let sectionClasses = classes.info;

    switch (direction) {
        case Directions.Column:
            sectionClasses += " " + classes.column;
            break;
        case Directions.Row:
            sectionClasses += " " + classes.row;
            break;
        default:
            break;
    }
    return (
        <div className={classes.wrapper}>
            <section className={sectionClasses}>{children}</section>
        </div>
    );
};

export default Wrapper;
