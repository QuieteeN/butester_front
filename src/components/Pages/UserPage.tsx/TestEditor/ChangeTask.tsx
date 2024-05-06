/* eslint-disable react/jsx-pascal-case */
import React, { useRef, useState } from "react";
import InputCase from "./InputCase";
import classes from '../UserPage.module.css'
import { useAddTestAnwerMutation, useChangeTestAnwerMutation, useChangeTestQuestionMutation, useDeleteTestAnswerMutation, useDeleteTestCaseMutation } from "../../../../services/testsApi";
import Icons from '../../../icons'

interface IChangeTask {
    task: any;
    deleteQuestion: (idQuestion: number) => void;
}

const ChangeTask: React.FC<IChangeTask> = ({task, deleteQuestion} : IChangeTask) => {

    const [question, setQuestion] = useState(task?.questionName);               // Вопрос
    const [correctAnswer, setCorrectAnswer] = useState(task?.correctAnswer);    // Ответ
    const [options, setOptions] = useState(task?.options)                       // Варианты ответов
    const [isBlockedQuestion, setIsBlockedQuestion] = useState(true);           // Блокировка кнопок вопроса
    const [isBlockedAnswer, setIsBlockedAnswer] = useState(true);               // Блокировка кнопок ответа
    const [isOpenModal, setIsOpenModal] = useState(false);                      // Для модалки
    const [isError, setIsError] = useState(false);
    const [newAnswer, setNewAnswer] = useState('');                             // Следит за изменение поля варианта ответа

    const messageRef = useRef<HTMLSpanElement>(null);                           // Элемент для вывода ошибки
    
    const [addAnswer] = useAddTestAnwerMutation();                  // Запрос на добваление варианта ответа
    const [deleteQuestionTest] = useDeleteTestCaseMutation();       // Запрос на удаление варианта ответа
    const [changeAnswer] = useChangeTestAnwerMutation();            // запрос на изменение ответа
    const [changeQuestion] = useChangeTestQuestionMutation();       // запрос на изменение вопроса
    const [deleteTestAnswer] = useDeleteTestAnswerMutation();

    // Классы для полей вопроса и ответа
    const btnsClassesQuestion = isBlockedQuestion ? classes.check + ' ' + classes.blocked : classes.check;
    const btnsClassesAnswer = isBlockedAnswer ? classes.check + ' ' + classes.blocked : classes.check;

    // Следим за изменение вопроса
    const questionInputHandler = (event: any) => {
        const value = event.target.value;
        if (value === task?.questionName) {
            setIsBlockedQuestion(true);
        } else {
            setIsBlockedQuestion(false);
        }
        setQuestion(value);
    }

    // Следим за изменение ответа
    const correctAnswerInputHandler = (event: any) => {
        const value = event.target.value;
        if (value === task?.correctAnswer) {
            setIsBlockedAnswer(true);
        } else {
            setIsBlockedAnswer(false);
        }
        setCorrectAnswer(value);
    }

    // Отмена изменения
    const resetQuestion = () => {
        setQuestion(task?.questionName);
        setIsBlockedQuestion(true);
    }

    // Отмена изменения
    const resetAnswer = () => {
        setCorrectAnswer(task?.correctAnswer);
        setIsBlockedAnswer(true);
    }

    // Добавляем вариант ответа
    const addTestAnswer = async () => {
        const visitor = {
            "id": task?.id,
            "body": newAnswer,
        }

        try {
            const result = await addAnswer(visitor);

            if ('error' in result) {
                if ('status' in  result.error && 'data' in result.error) {
                    if (result.error.status === 400 && messageRef.current) {
                        messageRef.current.innerText = 'Изменения должны быть от 10 до 120 символов'
                        setIsError(true);
                        return;
                    }
                }
            } 
            
            const date = new Date();
            const option = {
                id: date.getTime(),
                text: newAnswer
            }
            setOptions([...options, option])
            setIsOpenModal(false)
            setIsError(false);
            window.location.reload();
            setNewAnswer('');
        } catch (error: any) {
            // console.log(error);
        }
    }

    // Удаление варианта ответа
    const deleteOption = (idToRemove: number) => {
        const newOptions = options.filter(
            (item: {id: number, text: string}) => item.id !== idToRemove
        );
        setOptions(newOptions);
    } 

    // Удаление вопроса
    const deleteQuestionHandler = async () => {
        const data = {
            id: task.id
        }

        const deleteAnswer = async (index: number) => {
            const data = {
                id: index
            }
            try {
                const res = await deleteTestAnswer(data);
                deleteOption(index);
                console.log(res);
            } catch (error) {
                console.error(error);
            }
        }

        try {
            task.options.forEach(async (option: any) => await deleteAnswer(option.id));
            const res = await deleteQuestionTest(data);
            deleteQuestion(data.id);
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }

    // Изменение ответа
    const changeCorrectAnswerOfTest = async () => {
        const data = {
            id: task.id,
            body: correctAnswer,
        }
        try {
            const res = await changeAnswer(data);
            console.log(res);
            setIsBlockedAnswer(true);
        } catch (error) {
            console.error(error);
        }

    }

    // Изменение вопроса
    const changeQuestionOfTest = async () => {
        const data = {
            id: task.id,
            body: question
        }
        try {
            const res = await changeQuestion(data);
            console.log(res);
            setIsBlockedQuestion(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={classes.task} key={task.id}>
            <div className={classes.inputBox}>
                <div className={classes.taskHeader}>
                    <span className={classes.inputBoxTitle}>Вопрос</span>
                    <span 
                        className={
                            classes.changedBtn + ' ' + 
                            classes.del
                        }
                        onClick={() => {deleteQuestionHandler()}}
                    >Удалить</span>
                </div>
                <input 
                    type="text" 
                    className={
                        classes.questionInput + 
                        ' ' + 
                        classes.input
                    } 
                    value={question} 
                    onChange={(event) => {
                        questionInputHandler(event)
                    }}
                />
                <div className={classes.btnBox}>
                    <span title="Сохранить изменения">
                        <Icons.check 
                            classes={
                                btnsClassesQuestion + 
                                ' ' + 
                                classes.checkFocus
                            }
                            onClick={() => {
                                changeQuestionOfTest();
                            }}
                        />
                    </span>
                    <span title="Отменить изменения">
                        <Icons.ban 
                            classes={
                                btnsClassesQuestion + 
                                ' ' + 
                                classes.ban
                            } 
                            onClick={() => {
                                resetQuestion();
                            }}
                        />
                    </span>
                </div>
            </div>
            <div className={classes.inputBox}>
                <span className={classes.inputBoxTitle}>Правильный ответ</span>
                <input 
                    type="text" 
                    className={
                        classes.correctAnswerInput + 
                        ' ' + 
                        classes.input
                    } 
                    value={correctAnswer}
                    onChange={(event) => {
                        correctAnswerInputHandler(event);
                    }}
                />
                <div className={classes.btnBox}>
                    <span title="Сохранить изменения">
                        <Icons.check 
                            classes={
                                btnsClassesAnswer + 
                                ' ' + 
                                classes.checkFocus
                            }
                            onClick={() => {
                                changeCorrectAnswerOfTest();
                            }}
                        />
                    </span>
                    <span title="Отменить изменения">
                        <Icons.ban 
                            classes={
                                btnsClassesAnswer + 
                                ' ' + 
                                classes.ban
                            } 
                            onClick={() => {
                                resetAnswer();
                            }}
                        />
                    </span>
                </div>
            </div>
            <div className={classes.inputBox}>
                <span className={classes.inputBoxTitle}>Варианты ответов</span>
                {options.map((option: any) => (<InputCase option={option} index={option?.id} key={option?.id} deleteOption={deleteOption} />))}
                <span 
                    className={
                        classes.changedBtn + ' ' + 
                        classes.marginTop + ' ' + 
                        classes.gg
                    }
                    onClick={() => setIsOpenModal(true)}
                >Добавить ответ</span>
            </div>
            {isOpenModal && <div className={classes.modal_outer}>
                <div className={classes.modal_content}>
                    <h3>Добавление ответа</h3>
                    <span className={classes.close} onClick={() => setIsOpenModal(false)}><Icons.xMark classes={classes.close_icon}/></span>
                    <input type="text" className={classes.modal_input} value={newAnswer} onChange={(e) => {setNewAnswer(e.target?.value)}} />
                    <span ref={messageRef} className={`${classes.modalMessage} ${isError ? classes.active : ''}`}></span>
                    <span className={classes.add_btn} onClick={() => addTestAnswer()}>Добавить</span>
                </div>
            </div>}
        </div>
    )
}

export default ChangeTask;