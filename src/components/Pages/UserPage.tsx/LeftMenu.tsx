/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import classes from './UserPage.module.css'
import Icons from './../../icons'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeLeftMenu } from "../../../app/features/userPage/leftMenu";
import { useRedactTestsListQuery, useSharedTestListQuery, useUserNotCheckedQuery } from "../../../services/teacherApi";
import { changeTestId, changeUrl } from "../../../app/features/userPage/testSlice";

const LeftMenu: React.FC = () => {

    const [tests, setTests] = useState<any[]>([]);
    const [sharedTests, setSharedTests] = useState<any[]>([])
    const [usersTests, setUsersTests] = useState<any[]>([])
    const [url, setUrl] = useState('');
    

    const [isSharedTestListOpen, setIsSharedTestListOpen] = useState(false);
    const [isUsersTestListOpen, setIsUsersTestListOpen] = useState(false);
    const [isTestsListOpen, setIsTestsListOpen] = useState(false);

    const redactTestsQuery = useRedactTestsListQuery();
    const sharedTestsQuery = useSharedTestListQuery();
    const usersTestsQuery = useUserNotCheckedQuery();

    const navigate = useNavigate();
    const leftMenu = useSelector((state: any) => state.leftMenu);
    const dispatch = useDispatch();

    useEffect(() => {
        if (redactTestsQuery.data) {
            setTests(redactTestsQuery.data || []);
        }
    }, [redactTestsQuery.data]);

    useEffect(() => {
        if (usersTestsQuery.data) {
            setUsersTests(usersTestsQuery.data || []);
        }
    }, [usersTestsQuery.data])

    useEffect(() => {
        if (sharedTestsQuery.data) {
            setSharedTests(sharedTestsQuery.data || []);
        }
    }, [sharedTestsQuery.data]);

    function clickHandler(type: string) {
        dispatch(changeLeftMenu(type));
    }

    const onPassingTest = () => {
        dispatch(changeUrl(url))
        navigate(`/passing-test/${url}`);
    }

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        navigate("/");
    }

    const testClickHandler = (idTest: number) => {
        dispatch(changeTestId(idTest))
        clickHandler('answer')
        navigate('/test-info')
    }


    return(
        <section className={classes.leftMenu}>
                <h1 className={classes.logo} onClick={() => navigate('/')}>
                    bu<span className={classes.point}>.</span>Tester
                </h1>
                <div className={classes.user}>
                    <span className={classes.userIcon}><Icons.user /></span>
                    <span>{localStorage.getItem("login")}</span>
                    <span className={classes.logOutIcon} onClick={() => logOut()}><Icons.arrowBack /></span>
                </div>
                <div className={classes.searchTest}>
                    <input type="text" className={classes.searchInput} value={url} onChange={(e) => setUrl(e.target.value)}/>
                    <span className={classes.searchBtn} onClick={() => onPassingTest()}>Найти тест</span>
                </div>
                <div 
                    className={classes.sectionButton + ' ' +  classes.chat + ' ' + (leftMenu.chat && classes.active)}
                    onClick={() => {
                        clickHandler('chat');
                        navigate('/generate-test');
                    }}
                >
                    <Icons.chat classes={classes.menuIcons}/>
                    <span>Чат</span>
                </div>
                <div 
                    className={classes.sectionButton + ' ' + classes.answer + ' ' + (leftMenu.answer && classes.active)}
                    onClick={() => {
                        clickHandler('answer');
                        navigate('/tests');
                    }}
                >
                    <Icons.answer classes={classes.menuIcons}/>
                    <span>Тесты</span>
                </div>
                <div 
                    className={classes.sectionButton + ' ' + classes.passingTests + ' ' + (leftMenu.passingTests && classes.active)}
                    onClick={() => {
                        clickHandler('passingTests');
                        navigate('/check-tests');
                    }}
                >
                    <Icons.check classes={classes.menuIcons}/>
                    <span>Проверка</span>
                </div>
                <div className={`${classes.testsNav}`}>
                    {tests.length > 0 && <>
                        <h4 onClick={() => {
                            setIsSharedTestListOpen(false)
                            setIsUsersTestListOpen(false)
                            setIsTestsListOpen(!isTestsListOpen);
                        }} className={`${isTestsListOpen && classes.active}`} >Мои тесты</h4>
                        <ul className={`${classes.tests} ${isTestsListOpen && classes.activeTests}`}>
                        {tests.map((test: any) => (
                            <li 
                                className={classes.test} 
                                key={test.id}
                                onClick={() => testClickHandler(test.id)}
                            >
                                {test.id + ": " + (test.nameOfTest || "Без названия" )}
                            </li>
                        ))}
                    </ul>
                    </>}
                    {sharedTests.length > 0 && leftMenu.answer && <>
                        <h4 onClick={() => {
                            setIsSharedTestListOpen(!isSharedTestListOpen)
                            setIsUsersTestListOpen(false)
                            setIsTestsListOpen(false)
                        }} className={`${isSharedTestListOpen && classes.active}`} >Поделившиеся тесты</h4>
                        <ul className={`${classes.tests} ${isSharedTestListOpen && classes.activeTests}`}>
                            {sharedTests.map((test: any) => (
                                <li 
                                    className={classes.test} 
                                    key={test.id}
                                    onClick={() => testClickHandler(test.id)}
                                >
                                    {test.id + ": " + (test.nameOfTest || "Без названия" )}
                                </li>
                            ))}
                        </ul>
                    </>}
                    {usersTests.length > 0 && <>
                        <h4 onClick={() => {
                            setIsUsersTestListOpen(!isUsersTestListOpen);
                            setIsSharedTestListOpen(false)
                            setIsTestsListOpen(false);
                        }} className={`${isUsersTestListOpen && classes.active}`} >Для Проверки</h4>
                        <ul className={`${classes.tests} ${isUsersTestListOpen && classes.activeTests}`}>
                            {usersTests.map((item: any) => (
                                <li 
                                    className={classes.test} 
                                    key={item.id}
                                >
                                    {item.user.username + ": "+ item.testCase.id + (item.testCase.nameOfTest || "Без названия" )}
                                </li>
                            ))}
                        </ul>
                    </>}
                </div>
            </section>
    )
}

export default LeftMenu