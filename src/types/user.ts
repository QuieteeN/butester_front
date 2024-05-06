export type AuthUser = {
    email: string;
    password: string;
};

export type User = AuthUser & { name: string };

export enum UserActionTypes {
    CREATE_USER = "CREATE_USER",
    AUTH_USER = "AUTH_USER",
}

interface ICreateUserAction {
    type: UserActionTypes.CREATE_USER;
    payload: User;
}

interface IAuthUserAction {
    type: UserActionTypes.AUTH_USER;
    payload: AuthUser;
}

export type UserAction = ICreateUserAction | IAuthUserAction;
