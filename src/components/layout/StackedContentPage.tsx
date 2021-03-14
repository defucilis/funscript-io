import React, { ReactNode } from "react";

import style from "./StackedContentPage.module.scss";

const StackedContentPage = ({ children }: { children: ReactNode }) => {
    return <div className={style.stackedContentPage}>{children}</div>;
};

export default StackedContentPage;
