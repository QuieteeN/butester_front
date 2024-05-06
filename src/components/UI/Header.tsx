import React, { useEffect, useState } from "react";
import Wrapper from "../Pages/Wrapper";
import classes from "./styles/Header.module.css";
import Button from "./Button";
import { ButtonColors } from "../../types/button";
import { Directions } from "../../types/wrapper";

const Header: React.FC = () => {
    const [login, setLogin] = useState<string | null>("");
    
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const username = localStorage.getItem("login");
                setLogin(username);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <header className={classes.header}>
            <Wrapper direction={Directions.Row}>
                <div className={classes.logo}>
                    <span>
                        bu<span className={classes.point}>.</span>Tester
                    </span>
                </div>
                <div className={classes.navigation}>
                    <nav>
                        <ul>
                            <li>
                                <Button color={ButtonColors.White} text='Примеры' />
                            </li>
                            <li>
                                <Button color={ButtonColors.White} text='Документация' />
                            </li>
                            <li>
                                <Button color={ButtonColors.Black} text='Войти' href={login ? '/generate-test' : './log-in'} />
                            </li>
                        </ul>
                    </nav>
                </div>
            </Wrapper>
        </header>
    );
};

export default Header;
