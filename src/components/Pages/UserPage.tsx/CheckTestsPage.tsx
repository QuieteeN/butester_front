import React, { useEffect, useState } from "react";
import classes from './UserPage.module.css'
import LeftMenu from "./LeftMenu";
import CheckTests from "./CheckTests";
import { useUserNotCheckedQuery } from "../../../services/teacherApi";

const CheckTestsPage: React.FC = () => {
    const [usersTests, setUsersTests] = useState<any[]>([])

    const usersTestsQuery = useUserNotCheckedQuery();

    useEffect(() => {
        if (usersTestsQuery.data) {
            setUsersTests(usersTestsQuery.data || []);
        }
    }, [usersTestsQuery.data])

    return (
        <main className={classes.allPage}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={`${classes.content} ${classes.contentOverflow}`}>
                      <CheckTests answers={usersTests} />
                </div>
            </section>
        </main>
    )
}

export default CheckTestsPage;