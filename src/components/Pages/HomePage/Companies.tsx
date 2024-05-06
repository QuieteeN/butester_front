import React from "react";
import images from "./../../../images/index";
import classes from "./Companies.module.css";

interface ICompanyImage {
    source: string;
    alt: string;
    style: any;
}

const CompanyImage: React.FC<ICompanyImage> = ({ source, alt, style }: ICompanyImage) => {
    return (
        <>
            <img src={source} alt={alt} style={style} className={classes.company} />
        </>
    );
};

const Companies: React.FC = () => {
    return (
        <div className={classes.companies}>
            {Object.entries(images.Companies).map(([key, value]) => (
                <CompanyImage source={value} alt={key + " Logo"} style={{ maxWidth: "100%" }} />
            ))}
        </div>
    );
};

export default Companies;
