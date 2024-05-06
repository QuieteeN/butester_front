import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TOKEN = localStorage.getItem('token');

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8090/butest/passtest',
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${TOKEN}`);
            headers.set("Content-Type", 'application/json')
            return headers;
        }
    }),
    endpoints: (builder) => ({
        
        // Получение теста по URL
        findTestByUrl: builder.query<any, {url: string}>({
            query: (data: {url: string}) => ({
                url: `/findbyurl/${data.url}`,
                method: 'GET'
            })
        }),
        
        // Посмотреть ответы на тест другого человека
        showAnswerOfUser: builder.query<any, {idCase: number, idUser: number}>({
            query: (data: {idCase: number, idUser: number}) => ({
                url: `/showansweruser/${data.idCase}/${data.idUser}`,
                method: 'GET',
            })
        }),

        // Отправить ответы на тест
        passingTest: builder.mutation<any, {url: string, testAnswers: Map<string, number>}>({
            query: (data: {url: string, testAnswers: Map<string, number>}) => ({
                url: `/passingtest/${data.url}`,
                method: 'POST',
                body: data.testAnswers,
            })
        }),

        // Проверка теста
        checkTest: builder.mutation<any, {idTestCase: number, idUser: number, testCheck: Map<string, boolean>}>({
            query: (data: {idTestCase: number, idUser: number, testCheck: Map<string, boolean>}) => ({
                url: `/checktest/${data.idTestCase}/${data.idUser}`,
                method: 'POST',
                body: data.testCheck
            })
        }),

        // Получение результатов пройденных тестов
        getTestResult: builder.query<any, void>({
            query: () => `/testresult`,
        }),

        // Получение списка непроверенных пройденных тестов
        getUncheckedSelfTests: builder.query<any, void>({
            query: () => `/unchechedlistforuser`,
        }),
    })
})

export const {
    useFindTestByUrlQuery,
    useShowAnswerOfUserQuery,
    usePassingTestMutation,
    useCheckTestMutation,
    useGetTestResultQuery,
    useGetUncheckedSelfTestsQuery,
} = userApi;