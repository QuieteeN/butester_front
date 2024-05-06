/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useRef, useState } from "react";
import classes from './UserPage.module.css'
import LeftMenu from "./LeftMenu";
import Icons from './../../icons'
import { useGetTestByIdQuery, useShareTestLinkMutation } from "../../../services/testsApi";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Params, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeCopied, changeOpened } from "../../../app/features/userPage/urlCopied";
import { changeLeftMenu } from "../../../app/features/userPage/leftMenu";

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface TestTask {
    id: number;
    questionName: string;
    correctAnswer: string;
    options: { id: number; text: string; }[];
}

interface TestData {
    id: number;
    url: string;
    nameOfTest: string | null;
    testTaskList: TestTask[];
}

const TestPage: React.FC = () => {
    const urlCopied = useSelector((state: any) => state.urlCopied);

    const params: Readonly<Params<string>> = useParams();

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(changeLeftMenu('answer'));
    }, [dispatch] );

    const AnswerBox: React.FC<{testId: number}> = ({testId}: {testId: number}) => {
        const currentTest = useGetTestByIdQuery({id: testId});

        const [url, setUrl] = useState(currentTest?.data?.url);
        const queryClient = useQueryClient();

        const spanRef = useRef<HTMLSpanElement>(null);

        const [ shareTest ] = useShareTestLinkMutation();

        const navigate = useNavigate();

        async function generateTestDoc(data: TestData): Promise<void> {
            try {

                const paragraphs = data.testTaskList.map((task, index) => (
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Вопрос ${index + 1}: ${task.questionName}`,
                                break: 1,
                                bold: true
                            }),
                            new TextRun({
                                text: 'Варианты ответов:',
                                break: 1,
                            }),
                            ...task.options.map((option, optionIndex) => new TextRun({
                                text: `${optionIndex + 1}) ${option.text}`,
                                break: 1,
                            })),
                            new TextRun({
                                text: '',
                                break: 1,
                            }),
                                
                        ],
                        thematicBreak: false,
                    })
                ))

                console.log(data)
                
                const doc = new Document({
                    compatibility: {
                        doNotUseEastAsianBreakRules: true
                    },
                    sections: [
                      {
                        properties: {
                        },
                        children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `URL: ${data.url || 'Нету'}\n`,
                                                break: 1,
                                                italics: true,
                                            }),
                                            new TextRun({
                                                text: `Название теста: ${data.nameOfTest || 'Без названия'}\n\n`,
                                                break: 1,
                                                bold: true,
                                            }),
                                        ],
                                        thematicBreak: true,
                                        heading: HeadingLevel.HEADING_1,
                                    }),
                                    ...paragraphs
                        ],
                      },
                      
                    ],
                  });

                  Packer.toBlob(doc).then((blob) => {
                    saveAs(blob, `${data.nameOfTest || 'Test'}_${data.id}.docx`);
                  });
                
        
                // Остальной код генерации и скачивания документа...
            } catch (error) {
                console.error('Ошибка при формировании документа:', error);
            }
        }

        const createUrl = async () => {
            const data = {
                id: testId,
            }
            try {
                const res = await shareTest(data);
                console.log(res);
                await queryClient.invalidateQueries(['getTestById', testId]);
                window.location.reload()
            } catch (error) {
                console.error(error);
            }
        }

        const copyClickHandler = async (e: any) => {
            e.stopPropagation();
            dispatch(changeCopied(true))
            if (spanRef.current) {
                try {
                    await navigator.clipboard.writeText(spanRef.current.textContent || '');
                    console.log('Text copied successfully');
                } catch (error) {
                    console.error('Failed to copy text:', error);
                }
            }
        }

        useEffect(() => {
            if (currentTest?.data?.url) {
                setUrl(currentTest?.data?.url || []);
            }
        }, [currentTest?.data?.url]);

        return (
            <>
                <h2 className={classes.testHeader}>
                    <span className={classes.description}>{currentTest.data?.nameOfTest || "Без названия"}</span>
                    <div className={classes.btnBox}>
                        <span 
                            className={classes.shareBtn} 
                            onClick={
                                (e) => {
                                    e.stopPropagation();
                                    if (!url){
                                        createUrl();
                                    } else {
                                        dispatch(changeOpened(!urlCopied.opened));
                                    }
                                }
                            }
                        >
                            {urlCopied.opened ? <>Закрыть окно</> : !url ? <>Получить ссылку</> : <>Скопировать ссылку</>}
                        </span>
                        {urlCopied.opened && <p className={classes.shareUrl}>
                            <span className={classes.urlTitle}>URL</span>
                            <span className={classes.url} ref={spanRef} onClick={copyClickHandler} >{url}</span>
                            <span className={classes.urlCopyBtn} onClick={(e) => copyClickHandler(e)}>
                                {urlCopied.copied ? <Icons.check classes={classes.check} /> : <>Copy</>}
                            </span>
                        </p>}
                        <span title="Скачать" onClick={() => generateTestDoc(currentTest.data)}><Icons.arrowBack classes={`${classes.check} ${classes.upload}`} /> </span>
                        <span title="Редактировать тест" onClick={() => navigate(`/change-test/${testId}`)} ><Icons.modifyProfit classes={classes.check + ' ' + classes.ban} /></span>
                        <span title="Выйти" onClick={() => navigate('/tests')} ><Icons.xMark classes={classes.check + ' ' + classes.ban} /></span>
                    </div>
                </h2>
                <div className={classes.testCase}>
                    {currentTest.data?.testTaskList.map((task: any) => (
                        <div className={classes.task} key={task.id}>
                            <h3 className={classes.question}>{task?.questionName}</h3>
                            <p className={classes.correctAnswer}>
                                <span>{task.correctAnswer}</span>
                            </p>
                            <p className={classes.options}>Варианты:</p>
                            <ul>
                                {task.options.map((option: any) => (<li key={option.id}>{option.text}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            </>
        )
    }

    return(
        <main className={classes.allPage} onClick={() => {
            dispatch(changeCopied(false));
            dispatch(changeOpened(false))
        }}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={classes.content}>
                      <AnswerBox  testId={Number(params.testId)}/>
                </div>
            </section>
        </main>
    )
}

export default TestPage;