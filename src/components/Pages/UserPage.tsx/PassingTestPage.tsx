import React from "react";
import classes from './UserPage.module.css'
import LeftMenu from "./LeftMenu";
import TestPassing from "./TestPassing";

const PassingTestPage: React.FC = () => {

    return(
        <main className={classes.allPage}>
            <LeftMenu />
            <section className={classes.info}>
                <div className={classes.content}>
                      <TestPassing />  
                </div>
            </section>
        </main>
    )
}

export default PassingTestPage;