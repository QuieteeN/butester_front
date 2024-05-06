/* eslint-disable react/jsx-pascal-case */
import React, { useRef, useState } from "react";
import classes from './UserPage.module.css'
import LeftMenu from "./LeftMenu";
import Icons from './../../icons'
import { useNavigate } from "react-router-dom";
import { useCreateTestManuallyMutation } from "../../../services/testsApi";

const CreateTestPage: React.FC = () => {

    const [correctAnswer, setCorrectAnswer] = useState<string>('');
    const [testQuestion, setTestQuestion] = useState<string>('');
    const [testName, setTestName] = useState<string>('');
    const [isError, setIsError] = useState<boolean>();

    const [createTest] = useCreateTestManuallyMutation();

    const navigate = useNavigate();

    const messageRef = useRef<HTMLSpanElement>(null);

    //  Отправка запроса
    const sendHandler = async() => {

        console.log(messageRef.current);
        if (messageRef.current) {
            
            if (testName === '') {
                setIsError(true);
                messageRef.current.innerText = "Название теста не должно быть пустым"
                return;
            }
            
            if (testQuestion === '') {
                setIsError(true);
                messageRef.current.innerText = 'Вопрос не должен быть пустым'
                return;
            } else if (testQuestion.length < 10 || testQuestion.length > 120) {
                setIsError(true);
                messageRef.current.innerText = 'Длина вопроса должен быть от 10 до 120 символов'
                return;
            }
            
            if (correctAnswer === '') {
                setIsError(true);
                messageRef.current.innerText = 'Ответ не должен быть пустым'
                return;
            } else if (correctAnswer.length < 10 || correctAnswer.length > 120) {
                setIsError(true);
                messageRef.current.innerText = 'Длина ответа должен быть от 10 до 120 символов'
                return;
            }
        }


        const body = {
            nameOfTest: testName, 
            correct_answer: correctAnswer, 
            question: testQuestion
        }
        ;
        
        // Отпарвляем запрос
        try {
            const res = await createTest(body);
            
            if ('error' in res) {
                if ('status' in  res.error && 'data' in res.error) {
                    if (res.error.status === 400 && messageRef.current) {
                        messageRef.current.innerText = 'Запрос должен быть от 50 до 2300 символов'
                        setIsError(true);
                        return;
                    }
                    if (res.error.status === 500 && messageRef.current) {
                        messageRef.current.innerText = 'GPT сервер недоступен, повторите попытку позже'
                        setIsError(true);
                        return;
                    }
                }
            }

            console.log(res);
            console.log(body);

            navigate('/test-info')
            window.location.reload()
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className={classes.allPage}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={classes.content}>
                    <div className={classes.testCase}>
                        <h2 className={classes.testHeader}>
                            <span className={classes.description}>Создать тест</span>
                            <div className={classes.btnBox}>
                                <span title="Выйти с формы" onClick={() => navigate('/tests')}><Icons.xMark classes={classes.check + ' ' + classes.xMark} /></span>
                            </div>
                        </h2>
                        <form className={classes.testCreateForm} action="POST">
                            <p className={classes.testInputLabel}>Название теста</p>
                            <div className={classes.testCreateInputBox} >
                                <input 
                                    onChange={(e) => {
                                        setTestName(e.target.value);
                                        setIsError(false);
                                    }}
                                    className={classes.testCreateFormInputs}
                                    placeholder="Название теста"
                                    value={testName}
                                    name='testName' 
                                    type="text"  
                                />
                                <Icons.modifyProfit classes={classes.testCreateFormIcons} />
                            </div>
                            <p className={classes.testInputLabel}>Вопрос</p>
                            <div className={classes.testCreateInputBox} >
                                <input 
                                    onChange={(e) => {
                                        setTestQuestion(e.target.value);
                                        setIsError(false);
                                    }}
                                    className={classes.testCreateFormInputs}
                                    placeholder="Вопрос"
                                    value={testQuestion}
                                    name='testQuestion' 
                                    type="text"
                                />
                                <Icons.request classes={classes.testCreateFormIcons} />
                            </div>
                            <p className={classes.testInputLabel}>Ответ</p>
                            <div className={`${classes.testCreateInputBox} ${classes.last}`} >
                                <input 
                                    onChange={(e) => {
                                        setCorrectAnswer(e.target.value);
                                        setIsError(false);
                                    }}
                                    className={classes.testCreateFormInputs}
                                    value={correctAnswer}
                                    name='correctAnswer' 
                                    placeholder="Ответ"
                                    type="text"
                                />
                                <Icons.answer classes={classes.testCreateFormIcons} />
                            </div>
            
                            <span   
                                className={`${classes.modalMessage} ${isError ? classes.active : ''}`}
                                ref={messageRef} 
                            ></span>
                            <span 
                                className={classes.createTestFormBtn}
                                onClick={() => sendHandler()}
                            >Создать тест</span>
                        </form>
                    </div> 
                </div>
            </section>
        </main>
    )
}

export default CreateTestPage;