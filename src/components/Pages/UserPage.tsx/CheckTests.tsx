/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import classes from './UserPage.module.css'
import { useCheckTestMutation, useGetTestResultQuery, useGetUncheckedSelfTestsQuery, useShowAnswerOfUserQuery } from "../../../services/userApi";
import { useGetTestByIdQuery } from "../../../services/testsApi";
import { useUserCheckedQuery } from "../../../services/teacherApi";
import Icons from './../../icons'
import { useNavigate } from "react-router-dom";

// Типы для аргументов компонентов
interface ICheckTests {
    answers: any[];
}

interface ICheckComponent {
    userId: number;
    testId: number;
}

const CheckTests: React.FC<ICheckTests> = ({answers} : ICheckTests) => {
    const [userId, setUserId] = useState(0);                        // ID пользователя
    const [testId, setTestId] = useState(0);                        // ID теста
    const [username, setUsername] = useState('');                   // Имя пользователя
    const [isCheck, setIsCheck] = useState(false);                  // На проверке или нет
    const [checkedTests, setCheckedTests] = useState<any[]>([]);    // Проверенные тесты
    const [passedTestsUncheck, setPassedTestsUncheck] = useState<any[]>([]);      // Пройденные тесты
    const [passedTestsCheck, setPassedTestsCheck] = useState<any[]>([]);      // Пройден

    const checkedTestsQuery = useUserCheckedQuery();                // Запрос на проверенные тесты
    const getTestsResult = useGetTestResultQuery();                 // Запрос га результаты тестов
    const getPassedTestsQuery = useGetUncheckedSelfTestsQuery();    // Запрос на пройденные тесты

    const navigate = useNavigate();

    // Обновляем данные про проверенные тесты
    useEffect(() => {
        if (checkedTestsQuery.data){
            setCheckedTests(checkedTestsQuery.data || []);
        }
    }, [checkedTestsQuery.data]);

    useEffect(() => {
        if (getPassedTestsQuery.data) {
            setPassedTestsUncheck(getPassedTestsQuery.data || []);
        }
    }, [getPassedTestsQuery.data])

    useEffect(() => {
        if (getTestsResult.data) {
            setPassedTestsCheck(getTestsResult.data || []);
        }
    }, [getTestsResult.data])

    // Запускаем процесс проверки
    const clickHandler = (userId: number, testCaseId: number, username: string) => {
        setUserId(userId);
        setTestId(testCaseId);
        setIsCheck(true);
        setUsername(username);
    }


    const CheckComponent: React.FC<ICheckComponent> = ({userId, testId} : ICheckComponent) => {
        const [checkAnswers, setCheckAnswers] = useState(new Map());            // Храним проверенные вопросы
        const [checkTest] = useCheckTestMutation();                             // Запрос на проверку

        // Обновляем даннные о проверенных вопросах
        const handleAnswerChange = (answerId: number, correct: boolean) => {
            const newAnswers = new Map(checkAnswers);
            newAnswers.set(`${answerId}`, correct);
            setCheckAnswers(newAnswers);
        };

        // Отправляем запрос
        const handleSubmit = async () => {
            const data = {
                idTestCase: testId, 
                idUser: userId, 
                testCheck: Object.fromEntries(checkAnswers.entries()),
            }

            if (checkAnswers.size === showAnswerQuery.data?.body.length) {
                try {
                    const res = await checkTest(data);
                    console.log(res);
                    setIsCheck(false);
                    window.location.reload();
                } catch (e) {
                    console.error(e);
                }
                // Отправить ответы на сервер или выполнить другие действия
                console.log('Ответы:', checkAnswers);
            } else {
                console.log('Проверьте все вопросы!');
            }
        };

        const showAnswerQuery = useShowAnswerOfUserQuery({idCase: testId, idUser: userId})
        console.log(showAnswerQuery)

        const getTestById =  useGetTestByIdQuery({id: testId});

        // Функция для получения pointTest по id
        // const getPointTestById = (idToFind: number): number | null => {
        //     const testDataItem = getTestsResult.data.find((item: any) => item.testCase.id === idToFind);
        //     return testDataItem ? testDataItem.pointTest : null;
        // };

        return (
            <>
                <h2 className={classes.testHeader}>
                    <span className={classes.description}>{`${username}: ${getTestById.data?.id}-${getTestById.data?.nameOfTest || 'Без названия'}`}</span>
                    <div className={classes.btnBox}>
                        <span title="Выйти с формы" onClick={() => setIsCheck(false)}><Icons.xMark classes={classes.check + ' ' + classes.xMark} /></span>
                    </div>
                </h2>
                <div className={classes.testCase}>
                    {!showAnswerQuery.data?.body.every((item: any) => item.rightAnswer === null) ? <div>
                        Тест проверен
                        {` Результат ${showAnswerQuery.data?.body.filter((item: any) => item.rightAnswer === true).length}/${getTestById.data?.testTaskList.length}`}
                    </div> : <>
                        {
                            showAnswerQuery.data?.body.map((answer: any) => (
                                <AnsweredQuestion key={answer.id} answer={answer} btnClick={handleAnswerChange} />
                            ))
                        }
                        <button className={classes.runTest} onClick={handleSubmit}>Закончить проверку</button>
                    </>}
                    
                </div>
            </>
        )
    }

    const AnsweredQuestion: React.FC<{answer: any, btnClick: (questionId: number, correct: boolean) => void}> = ({answer, btnClick} : {answer: any, btnClick: (questionId: number, correct: boolean) => void}) => {
        const [isCheked, setIsChecked] = useState(false);
        const [isCorrect, setIsCorrect] = useState(false);

        return (
            <div className={classes.task}>
                <h3 className={classes.question}>{answer.testTask.questionName}</h3>
                <h4 className={classes.questionHeaders}>Правильный вариант ответа:</h4>
                <div className={`${classes.taskOption} ${classes.correct}`}>
                    <span 
                        className={`${classes.taskOptionText}`}
                    >
                        {answer.testTask.correctAnswer}
                    </span>
                </div>
                <h4 className={classes.questionHeaders}>Варианты ответа:</h4>
                {answer.testTask.options.map((option: any, index: number) => (
                    <div key={index} 
                        className={`${classes.taskOption} ${
                            option.id === answer.answerUser.id ? 
                                isCheked ? 
                                    isCorrect ? classes.correctAns : classes.incorrectAns 
                                : classes.selectedOption 
                            : ''}`}>
                        <span 
                            className={`${classes.taskOptionText}`}
                        >
                            {option.text}
                        </span>
                    </div>
                ))}
                <div className={classes.checkBtns}>
                    <button 
                        className={classes.correctBtn}
                        onClick={() => {
                            setIsChecked(true);
                            setIsCorrect(true);
                            btnClick(answer.id, true);
                        }}
                    >
                        Правильно
                    </button>
                    <button 
                        className={classes.incorrectBtn}
                        onClick={() => {
                            setIsChecked(true);
                            setIsCorrect(false);
                            btnClick(answer.id, false);
                        }}
                    >
                        Неправильно
                    </button>
                </div>
            </div>
        )
    } 

    const AddListComponent: React.FC<{test: any}> = ({test}: {test: any}) => {

        const showAnswerQuery = useShowAnswerOfUserQuery({idCase: test.testCase.id, idUser: test.user.id})
        const getTestById =  useGetTestByIdQuery({id: test.testCase.id});

        return (
            <li 
                className={classes.answerTest} 
                onClick={() => clickHandler(test.user.id, test.testCase.id, test.user.username)} 
                key={test.id}
            >{`${test.user.username}: ${test.testCase.nameOfTest || 'Без названия'} -  Результат ${
                showAnswerQuery.data?.body.filter((item: any) => item.rightAnswer === true).length}/${getTestById.data?.testTaskList.length}`}</li>
        )
    }

    const AddListComponentSelf: React.FC<{test: any}> = ({test}: {test: any}) => {
        const getTestById =  useGetTestByIdQuery({id: test.testCase.id});

        return (
            <li 
                className={classes.answerTest} 
                onClick={() => navigate(`/passing-test/${test.testCase.url}`)} 
                key={test.id}
            >{`${test.user.username}: ${test.testCase.nameOfTest || 'Без названия'} - Результат: ${test.pointTest}/${getTestById.data?.testTaskList.length}`}</li>
        )
    }

    return (
        <>
            {isCheck ? 
                <CheckComponent userId={userId} testId={testId} /> :
                <>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Тесты для проверки</span>
                    </h2>
                    <ul className={classes.answers}>
                        {answers.length > 0 ? answers.map((answer) => (
                            <li 
                                className={classes.answerTest} 
                                onClick={() => clickHandler(answer.user.id, answer.testCase.id, answer.user.username)} 
                                key={answer.id}
                            >{`${answer.user.username}: ${answer.testCase.id}-${answer.testCase.nameOfTest || 'Без названия'}`}</li>
                        )) : <li 
                                className={classes.answerTest} 
                            >Нету тестов для проверки</li>}
                    </ul>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Тесты проверенные</span>
                    </h2>
                    <ul className={classes.answers}>
                        {checkedTests.length > 0 ? checkedTests.map((test) => (
                            <AddListComponent test={test} key={test.id} />
                        )) : <li 
                                className={classes.answerTest} 
                            >Нету проверенных тестов</li>}
                    </ul>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Пройденные тесты</span>
                    </h2>
                    <ul className={classes.answers}>
                        {passedTestsCheck.length > 0 ? passedTestsCheck.map((test) => (
                            <AddListComponentSelf test={test} />
                        )) : <li 
                                className={classes.answerTest} 
                            >Нету проверенных тестов</li>}
                    </ul>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>Непроверенные пройденные тесты</span>
                    </h2>
                    <ul className={classes.answers}>
                        {passedTestsUncheck.length > 0 ? passedTestsUncheck.map((test) => (
                            <li 
                                className={classes.answerTest} 
                                onClick={() => navigate(`/passing-test/${test.testCase.url}`)} 
                                key={test.id}
                            >{`${test.user.username}: ${test.testCase.nameOfTest || 'Без названия'}`}</li>
                        )) : <li 
                                className={classes.answerTest} 
                            >Нету непроверенных тестов</li>}
                    </ul>
                </>
            }
        </>
    )
}

export default CheckTests;