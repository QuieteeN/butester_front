import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type AuthUser = {
    username: string,
    password: string,
}

type RegistrationUser = AuthUser & {
    confirmPassword: string,
    email: string,
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8090/' }),
    endpoints: (builder) => ({

        // Авторизация
        authUser: builder.mutation<any, AuthUser>({
            query: (user: AuthUser) => ({
                url: '/auth',
                method: 'POST',
                body: user,
            })
        }),

        // Регистрация
        registrationUser: 
            builder.mutation<any, RegistrationUser>({
            query: (data: RegistrationUser) => ({
                url: `/registration`,
                method: 'POST',
                body: data,
            })
        }),

        // Восстановление пароля
        restorePassword: builder.mutation<any, {email: string}>({
            query: (data: {email: string}) => ({
                url: `/restorepassword`,
                method: 'POST',
                body: {
                    email: data.email,
                }
            })
        })
    }),
})

export const { 
    useAuthUserMutation,
    useRegistrationUserMutation,
    useRestorePasswordMutation,
} = authApi;