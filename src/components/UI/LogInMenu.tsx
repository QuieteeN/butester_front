import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./styles/LogInMenu.module.css";

interface IMenuListProps {
    text: string;
    path: string;
    pageType: string;
}

interface ILogInMenuProps {
    text: string;
}

const MenuList = ({ text, path, pageType }: IMenuListProps) => {
    let itemClasses = classes.menu_list;

    if (pageType === text) {
        itemClasses += " " + classes.active;
    }

    return (
        <NavLink to={path} className={itemClasses}>
            <li>{text}</li>
        </NavLink>
    );
};

const LogInMenu: React.FC<ILogInMenuProps> = ({ text }: ILogInMenuProps) => {
    return (
        <nav className={classes.nav}>
            <ul className={classes.menu}>
                <MenuList text='Вход' path='/log-in' pageType={text} />
                <MenuList text='Регистрация' path='/sign-up' pageType={text} />
            </ul>
        </nav>
    );
};

export default LogInMenu;
