/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { useChangeAnswerOfTestMutation, useDeleteTestAnswerMutation } from "../../../../services/testsApi";
import classes from '../UserPage.module.css';
import Icons from '../../../icons'

interface IInputCase {
    option: any;
    index: number;
    deleteOption: (id: number) => void;
}

const InputCase: React.FC<IInputCase> = ({option, index, deleteOption} : IInputCase) => {
        
    const [isBlocked, setIsBlocked] = useState(true);
    const [answer, setAnswer] = useState(option?.text);
    const [changeAnswer] = useChangeAnswerOfTestMutation();
    const [deleteTestAnswer] = useDeleteTestAnswerMutation();
    
    const btnsClasses = isBlocked ? classes.check + ' ' + classes.blocked : classes.check;

    const answerInputHandler = (event: any) => {
        const value = event.target.value;
        if (value === option?.text) {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
        setAnswer(value);
    }

    const reset = () => {
        setAnswer(option?.text);
        setIsBlocked(true);
    }

    const saveHandler = async() => {
        const data = {
            id: index,
            body: answer,
        }
        try {
            const res = await changeAnswer(data);
            console.log(res);
            setIsBlocked(true);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteAnswer = async () => {
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

    return (
        <div className={classes.inputBox}>
            <input 
                type="text" 
                className={
                    classes.optionInput + 
                    ' ' + 
                    classes.input
                } 
                value={answer}
                onChange={(event) => {
                    answerInputHandler(event);
                }}
            />
            <div className={classes.btnBox}>
                <span title="Сохранить изменения">
                    <Icons.check 
                        classes={
                            btnsClasses + 
                            ' ' + 
                            classes.checkFocus
                        }
                        onClick={() => {
                            saveHandler();
                        }}
                    />
                </span>
                <span title="Отменить изменения">
                    <Icons.ban 
                        classes={
                            btnsClasses + 
                            ' ' + 
                            classes.ban
                        }
                        onClick={() => {
                            reset();
                        }}        
                    />
                </span>
                <span title="Удалить вариант ответа" onClick={() => deleteAnswer()}><Icons.xMark classes={classes.check + ' ' + classes.xMark} /></span>
            </div>
        </div>
    )
}

export default InputCase;