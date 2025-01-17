/* eslint-disable react/jsx-pascal-case */
import React, { useState } from "react";
import { useFindTestByUrlQuery, usePassingTestMutation } from "../../../services/userApi";
import classes from "./UserPage.module.css"
import { Params, useNavigate, useParams } from "react-router-dom";
import Icons from './../../icons'

// Для типизации параметров компонентов

interface ITextComponent {
    questions: any[];
}

interface IQuestionComponent {
    question: any; 
    selectedAnswer: number; 
    onAnswerChange: (id: number) => void;
}


const TestPassing: React.FC = () => {

    const params: Readonly<Params<string>> = useParams();

    const [isPassing, setIsPassing] = useState(false);  // Отправлен или нет

    const currentTest = useFindTestByUrlQuery({ url: params.testUrl || '' });   // Получаем тест по URL
    const [passingTest] = usePassingTestMutation();     // Запрос для отправки ответов

    const navigate = useNavigate();

    
    const TestComponent: React.FC<ITextComponent> = ({ questions } : ITextComponent) => {
        const [answers, setAnswers] = useState(new Map());  // Ответы на вопросы

        const [error, setError] = useState<string | null>(null);
        const navigate = useNavigate()
        console.log('Create')
        
        // Обработка выбора ответа
        const handleAnswerChange = (questionId: number, selectedIndex: number) => {
            const newAnswers = new Map(answers);
            newAnswers.set(`${questionId}`, selectedIndex);
            setAnswers(newAnswers);
        };
        
        // Обработка отправки ответа
        const handleSubmit = async (e: any) => {
          e.preventDefault();
          const data = {
              url: params.testUrl || '',
              testAnswers: Object.fromEntries(answers.entries()),
          }
          if (answers.size === questions.length) {
              try {
                  const result = await passingTest(data);
                  if ('error' in result) {
                      if ('status' in  result.error && 'data' in result.error) {
                          if (result.error.status === 400) {
                              setError('Ответьте на все вопросы!');
                              return;
                          }
                      }
                  } 
                  setIsPassing(false);
                  navigate('/check-tests');
                  window.location.reload();
              } catch (e) {
                  console.error(e);
              }
              console.log('Ответы:', answers);
          } else {
              setError('Ответьте на все вопросы!');
          }
        };
      
        return (
          <div className={classes.testCase + " " + classes.testPassing}>
            {questions.map((question) => (
              <QuestionComponent
                key={question.id}
                question={question}
                selectedAnswer={answers.get(`${question.id}`)}
                onAnswerChange={(selectedIndex: number) =>
                  handleAnswerChange(question.id, selectedIndex)
                }
              />
            ))}
            {error && <span className={`${classes.modalMessage} ${classes.active}`}>{error}</span>}
            <span className={classes.runTest} onClick={handleSubmit}>Отправить ответы</span>
          </div>
        );
      };
      
      
      const QuestionComponent: React.FC<IQuestionComponent> = ({ question, selectedAnswer, onAnswerChange } : IQuestionComponent) => {
        return (
          <div className={classes.task}>
            <h3 className={classes.question}>{question.questionName}</h3>
            {question.options.map((option: any, index: number) => (
              <div key={index} className={`${classes.radioContainer} ${option.id === selectedAnswer ? classes.selected: ''}`} onClick={() => onAnswerChange(option.id)}>
                <input
                  className={classes.customRadio}
                  type="radio"
                  id={`${question.id}-${option.id}`}
                  name={question.id}
                  value={option}
                  checked={option.id === selectedAnswer}
                  onChange={() => onAnswerChange(option.id)}
                />
                <label className={classes.radioLabel} htmlFor={`${question.id}-${option.id}`}>{option.text}</label>
              </div>
            ))}
          </div>
        );
      };
      

    return (
        <>
            <h2 className={classes.testHeader}>
                <span className={classes.description}>{currentTest.data?.body.nameOfTest || "Без названия"}</span>
                <div className={classes.btnBox}>
                    <span title="Выйти с формы" onClick={isPassing ? () => setIsPassing(false) : () => navigate('/tests')}><Icons.xMark classes={classes.check + ' ' + classes.xMark} /></span>
                </div>
            </h2>
            {isPassing ? <TestComponent questions={currentTest?.data?.body.testTaskList} /> :
                <div className={classes.testCase + " " + classes.testPassing}>
                    <span className={classes.questionCount}>Количество вопросов {currentTest?.data?.body.testTaskList.length}</span>
                    {currentTest?.data?.statusCode === 'CREATED' ? <span className={classes.passedTest}>Тест пройден</span> :
                    <span className={classes.runTest} onClick={() => setIsPassing(true)}>Пройти тест</span>}
                </div>
            }
        </>
    )
}

export default TestPassing;