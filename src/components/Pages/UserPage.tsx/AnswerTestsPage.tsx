/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import classes from './UserPage.module.css'
import LeftMenu from "./LeftMenu";
import { useDispatch } from "react-redux";
import { changeCopied, changeOpened } from "../../../app/features/userPage/urlCopied";
import { changeLeftMenu } from "../../../app/features/userPage/leftMenu";
import { useRedactTestsListQuery, useSharedTestListQuery } from "../../../services/teacherApi";
import { useNavigate } from "react-router-dom";
import Icons from './../../icons'


const AnswerTestsPage: React.FC = () => {

    const [sharedTests, setSharedTests] = useState<any[]>([]); 
    const [redactTests, setRedactTests] = useState<any[]>([]); 

    const sharedTestsQuery = useSharedTestListQuery();
    const redactTestsQuery = useRedactTestsListQuery();
    console.log(sharedTestsQuery)

    const dispatch = useDispatch()

    const navigate = useNavigate();

    useEffect(() => {
        if (sharedTestsQuery.data) {
            setSharedTests(sharedTestsQuery.data || []);
        }
    }, [sharedTestsQuery.data])

    useEffect(() => {
        if (redactTestsQuery.data) {
            setRedactTests(redactTestsQuery.data || []);
        }
    }, [redactTestsQuery.data])

    useEffect(() => {
        dispatch(changeLeftMenu('answer'));
    }, [dispatch] );

    const clickHandler = (testId: number) => {
        navigate(`/test-info/${testId}`);
    }

    return(
        <main className={classes.allPage} onClick={() => {
            dispatch(changeCopied(false));
            dispatch(changeOpened(false))
        }}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={`${classes.content} ${classes.contentOverflow}`}>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Тесты для редактирования</span>
                        <div className={classes.btnBox}>
                            <span title="Сгенерировать тест" onClick={() => navigate('/generate-test')}><Icons.generationProfit classes={classes.check + ' ' + classes.generate} /></span>
                            <span title="Создать тест" onClick={() => navigate('/create-test')}><Icons.xMark classes={classes.check + ' ' + classes.add} /></span>
                        </div>
                    </h2>
                    <ul className={classes.answers}>
                        {redactTests.length > 0 ? redactTests.map((test) => (
                            <li 
                                className={classes.answerTest} 
                                onClick={() => clickHandler(test.id)} 
                                key={test.id}
                            >{`${test?.id}-${test?.nameOfTest || 'Без названия'}`}</li>
                        )) :  <li 
                                className={classes.answerTest} 
                            >Нету тестов для редактирования</li>}
                    </ul>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Поделившиеся тесты</span>
                    </h2>
                    <ul className={classes.answers}>
                        {sharedTests.length > 0 ? sharedTests.map((test) => (
                            <li 
                                className={classes.answerTest} 
                                onClick={() => clickHandler(test.id)} 
                                key={test.id}
                            >{`${test?.id}-${test?.nameOfTest || 'Без названия'}`}</li>
                        )) : <li 
                                className={classes.answerTest} 
                            >Нету поделившихся тестов</li> }
                    </ul>
                </div>
            </section>
        </main>
    )
}

export default AnswerTestsPage;