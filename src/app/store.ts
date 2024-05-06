import { configureStore} from "@reduxjs/toolkit";
import userReducer from './features/user/userSlice'
import leftMenuReducer from './features/userPage/leftMenu'
import testReducer from './features/userPage/testSlice'
import urlCopiedReducer from './features/userPage/urlCopied'
import { authApi } from "../services/authApi";
import { testsApi } from "../services/testsApi";
import { userApi } from "../services/userApi";
import { teacherApi } from "../services/teacherApi";

const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [testsApi.reducerPath]: testsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [teacherApi.reducerPath]: teacherApi.reducer,
        user: userReducer,
        leftMenu: leftMenuReducer,
        test: testReducer,
        urlCopied: urlCopiedReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware).concat(testsApi.middleware).concat(userApi.middleware).concat(teacherApi.middleware),
});

export default store;