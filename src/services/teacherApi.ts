import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TOKEN = localStorage.getItem('token');

export const teacherApi = createApi({
    reducerPath: 'teacherApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8090/butest/teacher',
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${TOKEN}`);
            headers.set("Content-Type", 'application/json')
            return headers;
        }
    }),
    endpoints: (builder) => ({

        // Получение тестов которыми человек поделился
        sharedTestList: builder.query<any, void>({
            query: () => `/sharedtestslist`,
        }),

        // Получение тестов на редактирование
        redactTestsList: builder.query<any, void>({
            query: () => `/redacttestslist`
        }),

        // Поиск не проверенных тестов
        userNotChecked: builder.query<any, void>({
            query: () => `/usernotchecked`,
        }),

        // Поиск проверенных тестов
        userChecked: builder.query<any, void>({
            query: () => `/userchecked`,
        }),

    })
})

export const {
    useSharedTestListQuery,
    useRedactTestsListQuery,
    useUserNotCheckedQuery,
    useUserCheckedQuery,
} = teacherApi;