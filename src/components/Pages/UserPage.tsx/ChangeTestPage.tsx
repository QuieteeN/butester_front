/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useRef, useState } from "react";
import classes from "./UserPage.module.css"
import LeftMenu from "./LeftMenu";
import { useAddTestCaseMutation, useGetTestByIdQuery } from "../../../services/testsApi";
import Icons from "./../../icons"
import ChangeTask from "./TestEditor/ChangeTask";
import { Params, useNavigate, useParams } from "react-router-dom";

interface IChangeBox {
    testId: number;
}

const ChangeTestPage: React.FC = () => {
    const params: Readonly<Params<string>> = useParams();

    const ChangeBox: React.FC<IChangeBox> = ({testId} : IChangeBox) => {
        const { data } = useGetTestByIdQuery({id: testId});     // Получаем запрос на последний сгенерированный тест
        const [isOpenModal, setIsOpenModal] = useState(false);  // Для модалки
        const [isError, setIsError] = useState(false);
        const [newQuestion, setNewQuestion] = useState('')      // Следит за изменением поля вопроса
        const [newAnswer, setNewAnswer] = useState('')          // Следит за изменением поля ответа
        const [addQuestionTest] = useAddTestCaseMutation()      // Запрос на добавление вопроса в тест
        const [questions, setQuestions] = useState<any[]>([]);  // Вопросы теста

        const messageRef = useRef<HTMLSpanElement>(null);       // Элемент для вывода ошибки

        const navigate = useNavigate()

        // Обновляем данные о вопросах
        useEffect(() => {
            if (data) {
                setQuestions(data.testTaskList || []);
            }
        }, [data]);

        // Добавляем вопрос
        const addQuestion = async () => {
            const question = {
                "id": data?.id,
                "question": newQuestion,
                "correct_answer": newAnswer,
            }
    
            try {
                const result = await addQuestionTest(question);
    
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
                const quest = {
                    id: date.getTime(),
                    questionName: newQuestion,
                    correctAnswer: newAnswer,
                    options: []
                }
                setQuestions([...questions, quest])
                setIsOpenModal(false)
                setIsError(false);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }

        // Удаление вопроса
        const deleteQuestion = (idQuestion: number) => {
            const newQuestions = questions.filter(
                (question: any) => question.id !== idQuestion
            )
            setQuestions(newQuestions);
        }

        return (
            <>
                <div className={classes.testCase}>
                    <h2 className={classes.testHeader}>
                        <span className={classes.description}>{`Редактирование теста "${data?.nameOfTest}"`}</span>
                        <div className={classes.btnBox}>
                            <span title="Отменить изменения"><Icons.ban classes={classes.check + ' ' + classes.ban} /></span>
                            <span title="Выйти с редактирования" onClick={() => navigate(`/test-info/${testId}`)}><Icons.xMark classes={classes.check + ' ' + classes.xMark} /></span>
                        </div>
                    </h2>
                    {questions && questions.map((task: any) => (
                        <ChangeTask task={task} key={task.id} deleteQuestion={deleteQuestion}/>
                    ))}
                    <span className={classes.changedBtn + ' ' + classes.gg} onClick={() => setIsOpenModal(true)} >Добавить вопрос</span>
                </div>
                {isOpenModal && <div className={classes.modal_outer}>
                    <div className={classes.modal_content}>
                        <h3>Добавление вопроса</h3>
                        <span className={classes.close} onClick={() => setIsOpenModal(false)}><Icons.xMark classes={classes.close_icon}/></span>
                        <input type="text" className={classes.modal_input} value={newQuestion} onChange={(e) => {setNewQuestion(e.target?.value)}} />
                        <input type="text" className={classes.modal_input} value={newAnswer} onChange={(e) => {setNewAnswer(e.target?.value)}} />
                        <span ref={messageRef} className={`${classes.modalMessage} ${isError ? classes.active : ''}`}></span>
                        <span className={classes.add_btn} onClick={() => addQuestion()}>Добавить</span>
                    </div>
                </div>} 
            </>
            
        )
    }

    return(
        <main className={classes.allPage}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={classes.content}>
                      <ChangeBox testId={Number(params.testId)} />
                </div>
            </section>
        </main>
    )
}

export default ChangeTestPage;