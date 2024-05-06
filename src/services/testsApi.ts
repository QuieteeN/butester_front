import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TOKEN = localStorage.getItem('token');

export const testsApi = createApi({
    reducerPath: 'testApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8090/',
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${TOKEN}`);
            headers.set("Content-Type", 'application/json')
            return headers;
        }
    }),
    endpoints: (builder) => ({

        // Получаем информацию о сгенерированном тесте
        test: builder.query<any, void>({
            query: () => 'butest/lasttestcaseuser',
        }),

        // Получение теста по индексу
        getTestById: builder.query<any, {id: number}>({
            query: (data: {id: number}) => ({
                url: `/butest/testcase/${data.id}`,
                method: 'GET',
            }),
        }),

        // Генерация теста
        createTest: builder.mutation<{error: any}, {name_test: string, body: string}>({
            query: ({name_test, body}) => ({
                url: '/butest',
                method: 'POST',
                body: {
                    nameOfTest: name_test,
                    body: body
                },
            }),
        }), 

        // Создание теста
        createTestManually: builder.mutation<any, {nameOfTest: string, question: string, correct_answer: string}>({
            query: (data: {nameOfTest: string, question: string, correct_answer: string}) => ({
                url: '/butest/addtestcasemanually',
                method: 'POST',
                body: {
                    nameOfTest: data.nameOfTest,
                    testTaskDTO: {
                        question: data.question,
                        correct_answer: data.correct_answer
                    }
                }
            }),
        }),

        // Изменение варианта ответа
        changeAnswerOfTest: builder.mutation<any, { id: number, body: string }>({
            query: ( data : {id: number, body: string}) => ({
                url: `/butest/changeoption/${data.id}`,
                method: 'PATCH',
                body: {
                    body: data.body,
                },
            })
        }),
        
        // Добавление вопроса в тест
        addTestCase: builder.mutation<any, {id: number, question: string, correct_answer: string}>({
            query: (data: {id: number, question: string, correct_answer: string}) => ({
                url: `/butest/addtestask/${data.id}`,
                method: 'POST',
                body: {
                    correct_answer: data.correct_answer,
                    question: data.question
                },
            })
        }),

        // Удаление вопроса в тесте
        deleteTestCase: builder.mutation<any, {id: number}>({
            query: (data: {id: number}) => ({
                url: `/butest/deletetesttask/${data.id}`,
                method: "DELETE",
            })
        }),

        // Изменение ответа вопроса
        changeTestAnwer: builder.mutation<any, {id: number, body: string}>({
            query: (data: {id: number, body: string}) => ({
                url: `/butest/changeansweroftest/${data.id}`,
                method: "PATCH",
                body: {
                    body: data.body
                }
            })
        }),

        // Изменение вопроса
        changeTestQuestion: builder.mutation<any, {id: number, body: string}>({
            query: (data: {id: number, body: string}) => ({
                url: `/butest/changequestionoftest/${data.id}`,
                method: "PATCH",
                body: {
                    body: data.body
                }
            })
        }),

        // Добавление ответа на вопрос
        addTestAnwer: builder.mutation<any, {id: number, body: string}>({
            query: (data: {id: number, body: string}) => ({
                url: `/butest/addoption/${data.id}`,
                method: "POST",
                body: {
                    body: data.body
                }
            })
        }),

        // Удаление ответа
        deleteTestAnswer: builder.mutation<any, {id: number}>({
            query: (data: {id: number}) => ({
                url: `/butest/deleteteoption/${data.id}`,
                method: "DELETE",
            })
        }),

        // Создание ссылки для теста
        shareTestLink: builder.mutation<any, {id: number}>({
            query: (data: {id: number}) => ({
                url: `/butest/sharetest/${data.id}`,
                method: 'PATCH',
            })
        }),
    }),
});

export const {
    useTestQuery,
    useGetTestByIdQuery,
    useCreateTestMutation,
    useChangeAnswerOfTestMutation,
    useAddTestCaseMutation,
    useDeleteTestCaseMutation,
    useChangeTestAnwerMutation,
    useChangeTestQuestionMutation,
    useAddTestAnwerMutation,
    useDeleteTestAnswerMutation,
    useShareTestLinkMutation,
    useCreateTestManuallyMutation,
} = testsApi;