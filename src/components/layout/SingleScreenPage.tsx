import React, { ReactNode } from "react";

import style from "./SingleScreenPage.module.scss";

const SingleScreenPage = ({ children }: { children: ReactNode }) => {
    return <div className={style.singleScreenPage}>{children}</div>;
};

export default SingleScreenPage;
