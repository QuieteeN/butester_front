/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useRef, useState } from "react";
import classes from './UserPage.module.css'
import Icons from "../../icons"
import LeftMenu from "./LeftMenu";
import { useCreateTestMutation } from "../../../services/testsApi";
import { useDispatch } from "react-redux";
import { changeLeftMenu } from "../../../app/features/userPage/leftMenu";
import { useNavigate } from "react-router-dom";

const GenerateTestPage: React.FC = () => {

    const RequestComp: React.FC = () => {
        const [isAnimationStopped, setIsAnimationStopped] = useState<boolean>(false);   // Следит за окончанием анимации точек
        const [isSend, setIsSend] = useState<boolean>(false);                           // Следит за отправкой запроса
        const [isError, setIsError] = useState<boolean>(false);                         //
        const [currentDotIndex, setCurrentDotIndex] = useState<number>(1);              // Индекс активного текста
        const [testName, setTestName] = useState<string>('');                           //

        const textareaContent = useRef<string>('');                             // Храним контент из textarea
        const textareaRef = useRef<HTMLTextAreaElement>(null);                  // Храним сам элемент textarea
        const texts = useRef<HTMLDivElement[]>([]);                             // Элементы текстов
        const dotRefs = useRef<HTMLDivElement[]>([]);                           // Элементы точек

        const [ createTest ] = useCreateTestMutation();                         // Функция для запроса на бек

        const dispatch = useDispatch();

        const navigate = useNavigate();

        const messageRef = useRef<HTMLDivElement>(null);


        //  Делаем перенос строки при Shift+Enter
        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && e.shiftKey) {
                textareaContent.current += '\n'
                resizeTextarea();
            }
        };

        //  Пересчитываем высоту textarea
        const resizeTextarea = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = '0px';
                textareaRef.current.style.paddingTop = (textareaRef.current.clientHeight - textareaRef.current.scrollHeight) / 2 + 'px';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 20}px`;
            }
        };
    
        //  Обарботчик при изменении контента textarea
        const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            textareaContent.current = event.target.value;
            resizeTextarea()
            setIsError(false);
        };

        //  Отправка запроса
        const sendHandler = async() => {

            if (testName === '') {
                setIsError(true);
                if (messageRef.current) {
                    messageRef.current.innerText = "Название теста не должно быть пустым"
                }
                return;
            }

            dotRefs.current.forEach(dot => dot.classList.remove(classes.red));
            texts.current.forEach(text => text.style.display = 'none');

            setIsSend(true);
            setIsAnimationStopped(true);    // Останавливаем анимацию текстов
            if (textareaRef.current) {
                textareaRef.current.value = '';
            }
            resizeTextarea();

            const body = {
                body: textareaContent.current,
                name_test: testName,
            };

            textareaContent.current = '';
            
            // Отпарвляем запрос
            try {
                const res = await createTest(body);
                
                if ('error' in res) {
                    if ('status' in  res.error && 'data' in res.error) {
                        if (res.error.status === 400 && messageRef.current) {
                            messageRef.current.innerText = 'Запрос должен быть от 50 до 2300 символов'
                            setIsError(true);
                            setIsSend(false);
                            setIsAnimationStopped(false);
                            dotRefs.current[0].classList.add(classes.red);
                            texts.current[0].style.display = 'block';
                            return;
                        }
                        if (res.error.status === 500 && messageRef.current) {
                            messageRef.current.innerText = 'GPT сервер недоступен, повторите попытку позже'
                            setIsError(true);
                            setIsSend(false);
                            setIsAnimationStopped(false);
                            dotRefs.current[0].classList.add(classes.red);
                            texts.current[0].style.display = 'block';
                            return;
                        }
                    }
                }

                navigate('/tests')
                window.location.reload()
            } catch (error) {
                console.error(error);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const changeDotColor = () => {
            if (isAnimationStopped) return;
            dotRefs.current.forEach(dot => dot.classList.remove(classes.red));
            texts.current.forEach(text => text.style.display = 'none');
            
            // Выводим текущий текст
            dotRefs.current[currentDotIndex].classList.add(classes.red);
            texts.current[currentDotIndex].style.display = 'block';
            
            // Увеличим счётчик для следующего текста
            setCurrentDotIndex(currentDotIndex => (currentDotIndex + 1) % dotRefs.current.length);
        }

        //  Получаем элементы при загрузке страницы
        useEffect(() => {
            dotRefs.current = Array.from(document.querySelectorAll(`.${classes.dot}`)) as HTMLDivElement[];
            texts.current = Array.from(document.querySelectorAll(`.${classes.infoText}`)) as HTMLDivElement[];
            dotRefs.current[0].classList.add(classes.red); 
        }, []);

        //  Устанавливаем интервал для изменения текста
        useEffect(() => {
            const intervalId = setInterval(changeDotColor, 5000);
            return () => clearInterval(intervalId);
        }, [changeDotColor]);

        useEffect(() => {
            dispatch(changeLeftMenu('chat'));
        }, [dispatch] );
        

        return (
            <>
                <div className={classes.loading}>
                    <div className={`${classes.dot} ${classes.right1} ${isSend ? classes.dot1 : ''}`}></div>
                    <div className={`${classes.dot} ${classes.right2} ${isSend ? classes.dot2 : ''}`}></div>
                    <div className={`${classes.dot} ${classes.right3} ${isSend ? classes.dot3 : ''}`}></div>
                    <div className={`${classes.infoText} ${isSend ? classes.infoNone : ''} ${classes.first}`}>
                        Данный искуственный интелект создает тест на основе написанного текста
                    </div>
                    <div className={`${classes.infoText} ${isSend ? classes.infoNone : ''}`}>
                        Текст должен иметь длину в диапозоне от 50 до 2300 символов
                    </div>
                    <div className={`${classes.infoText} ${isSend ? classes.infoNone : ''}`}>
                        Не зубудьте написать название теста.
                    </div>
                </div>
                <div 
                    className={classes.request}
                >
                    <span ref={messageRef} className={`${classes.modalMessage} ${isError ? classes.active : ''}`}></span>
                </div>
                <div className={classes.request}>
                    <Icons.answer classes={classes.reqIcon} />
                    <input 
                        name="test_name" 
                        placeholder="Название теста"                    
                        className={classes.requestInput}
                        value={testName}
                        onChange={(e) => {
                            setTestName(e.target.value);
                            setIsError(false);
                        }}
                    />
                </div>
                <div className={classes.request}>
                    <Icons.request classes={classes.reqIcon}/>
                    <textarea 
                        ref={textareaRef}
                        name="chat"
                        onChange={handleTextareaChange} 
                        onKeyDown={handleKeyDown}
                        style={{maxHeight: '200px', resize: 'none'}}
                        placeholder="Текст запроса"
                    ></textarea>
                    {isSend ? <Icons.ban classes={classes.sendIcon} /> : 
                        <Icons.arrowBack classes={classes.sendIcon} 
                        onClick={() => {
                            sendHandler()}} 
                        />
                    }
                </div>
            </>
        )
    }

    return(
        <main className={classes.allPage}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={classes.content}>
                      <RequestComp />  
                </div>
            </section>
        </main>
    )
}

export default GenerateTestPage;