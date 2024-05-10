import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LogInPage from "./components/Pages/LogInPage/LogInPage";
import Home from "./components/Pages/HomePage/Home";
import SignUpPage from "./components/Pages/SignUpPage/SignUpPage";
import ResetPasswordPage from "./components/Pages/ResetPasswordPage/ResetPasswordPage";
import NewPasswordPage from "./components/Pages/ResetPasswordPage/NewPasswordPage";
// import UserPage from "./components/Pages/UserPage.tsx/UserPage";
import GenerateTestPage from "./components/Pages/UserPage.tsx/GenerateTestPage";
import PassingTestPage from "./components/Pages/UserPage.tsx/PassingTestPage";
import ChangeTestPage from "./components/Pages/UserPage.tsx/ChangeTestPage";
import AnswerTestsPage from "./components/Pages/UserPage.tsx/AnswerTestsPage";
import CheckTestsPage from "./components/Pages/UserPage.tsx/CheckTestsPage";
import TestPage from "./components/Pages/UserPage.tsx/TestPage";
import CreateTestPage from "./components/Pages/UserPage.tsx/CreateTestPage";
import LastTestPage from "./components/Pages/UserPage.tsx/LastTestPage";

function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' Component={Home} />
                    <Route path='/sign-up' Component={SignUpPage} />
                    <Route path='/log-in' Component={LogInPage} />
                    <Route path='/reset-password' Component={ResetPasswordPage} />
                    <Route path='/new-password' Component={NewPasswordPage} />
                    <Route path='/generate-test' Component={GenerateTestPage} />
                    <Route path='/passing-test/:testUrl' Component={PassingTestPage} />
                    <Route path='/change-test/:testId' Component={ChangeTestPage} />
                    <Route path='/tests' Component={AnswerTestsPage} />
                    <Route path='/check-tests' Component={CheckTestsPage} />
                    <Route path='/test-info/:testId' Component={TestPage} />
                    <Route path='/create-test' Component={CreateTestPage} />
                    <Route path='/test-info/lastTest' Component={LastTestPage} />
                </Routes>
            </BrowserRouter>
    );
}

export default App;
