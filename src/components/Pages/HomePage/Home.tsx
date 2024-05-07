/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper";
import classes from "./Home.module.css";
import Header from "../../UI/Header";
import { Directions } from "../../../types/wrapper";
import Button from "../../UI/Button";
import { ButtonColors } from "../../../types/button";
import Companies from "./Companies";
import images from "./../../../images/index";
import Icons from "./../../icons/index";

const Home: React.FC = () => {

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
        <>
            <Header />
            <main className={classes.main}>
                <Wrapper direction={Directions.Column}>
                    <span className={classes.top_header}>Представляем</span>
                    <h1 className={classes.section_title + " " + classes.top_title + " " + classes.text_gradient}>
                        Платформа с ИИ для тестов
                    </h1>
                    <p className={classes.section_description}>
                        Доступ к разнообразному спектру передовых моделей: продвинутые языковые модели вам в помощь для генерации тестов
                    </p>
                    <p className={classes.btns}>
                        <Button color={ButtonColors.Black} text='Начать' href={login ? '/generate-test' : '/log-in'} />
                        <Button color={ButtonColors.White} text='Попробовать' href={login ? '/create-test' : '/log-in'} />
                    </p>
                </Wrapper>

                <article className={classes.chat_photo}>
                    <img src={images.Chat} alt='' />
                </article>

                <Wrapper direction={Directions.Column}>
                    <h2 className={classes.section_title + " " + classes.sections_title + " " + classes.title}>
                        ИИ внедрены в
                    </h2>
                    <Companies />
                </Wrapper>

                <Wrapper direction={Directions.Row}>
                    <section className={classes.row_section}>
                        <img src={images.Description} alt='' />
                    </section>
                    <section className={classes.row_section}>
                        <span className={classes.top_header}>Вот и ИИ</span>
                        <h2 className={classes.section_title + " " + classes.title}>И вы используйте ИИ</h2>
                        <p className={classes.section_description + " " + classes.text_align_start}>
                            Мы предоставляем возможности
                        </p>
                        <div className={classes.hr}></div>
                        <ul className={classes.profits}>
                            <li className={classes.profit}>
                                <div className={classes.profit_svg}>
                                    <Icons.generationProfit classes={classes.svg} />
                                </div>
                                <div>
                                    <h5 className={classes.profit_title}>Генерация тестов</h5>
                                    <p className={classes.profit_description}>
                                        Вы можете быстро и легко сгенерировать тесты по любой теме при помощи ИИ
                                    </p>
                                </div>
                            </li>
                            <li className={classes.profit}>
                                <div className={classes.profit_svg}>
                                    <Icons.modifyProfit classes={classes.svg} />
                                </div>
                                <div>
                                    <h5 className={classes.profit_title}>Редактирование тестов</h5>
                                    <p className={classes.profit_description}>
                                        Также можете редактировать любое место сгенерированных тестов
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </Wrapper>

                <Wrapper direction={Directions.Column}>
                    <article className={classes.frame}>
                        <section className={classes.background}>
                            <div className={classes.first}></div>
                            <div className={classes.second}></div>
                        </section>
                        <section>
                            <span className={classes.top_header}>Больше возможностей</span>
                            <h2 className={classes.section_title}>Самый простой способ реализовать тесты</h2>
                            <p className={classes.section_description}>
                                Зарегистрируйтесь, чтобы войти в систему и изучить дополнительные функции, не
                                перечисленные в списке.
                            </p>
                            <ul className={classes.add_profits}>
                                <li className='add_profit'>
                                    <div className={classes.add_profit_svg}>
                                        <Icons.modifyProfit classes={classes.svg} />
                                    </div>

                                    <h4>Долгосрочная память</h4>
                                    <p className='add_profit_title'>
                                        Не нужно беспокоиться о том, что модели забудут то, что вы сказали раньше,
                                        модель сможет запомнить то, что вы сказали несколько дней, недель или даже
                                        месяцев назад.
                                    </p>
                                </li>

                                <li className='add_profit'>
                                    <div className={classes.add_profit_svg}>
                                        <Icons.perfomanceProfit classes={classes.svg} />
                                    </div>

                                    <h4>Улучшенная продуктивность</h4>
                                    <p className='add_profit_title'>
                                        За счет автоматизации многих задач и обработки данных искусственным интеллектом,
                                        возможно значительное повышение производительности.
                                    </p>
                                </li>

                                <li className='add_profit'>
                                    <div className={classes.add_profit_svg}>
                                        <Icons.timeProfit classes={classes.svg} />
                                    </div>

                                    <h4>Экономия аремени</h4>
                                    <p className='add_profit_title'>
                                        Благодаря возможности запоминания данных и быстрому доступу к информации,
                                        использование искусственного интеллекта существенно экономит рабочее время
                                    </p>
                                </li>
                            </ul>
                        </section>
                    </article>
                </Wrapper>
            </main>
            <footer className={classes.footer}>
                <Wrapper direction={Directions.Row}>
                    <p className={classes.footer_text}>
                        <span className={classes.footer_text_span}>© 2021</span>
                        <span className={classes.logo}>
                            <span>
                                bu<span className={classes.point}>.</span>Tester
                            </span>
                        </span>
                        <span className={classes.footer_text_span}>Все права защищены</span>
                    </p>
                </Wrapper>
            </footer>
        </>
    );
};

export default Home;
