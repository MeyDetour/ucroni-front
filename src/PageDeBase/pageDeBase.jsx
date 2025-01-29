import './pageDeBase.css';
import Button from "../components/Button/button.jsx";
import {useLocation} from "react-router-dom";

export const PageDeBase = () => {
    const location = useLocation();
    const { text, title, buttonContent, buttonAction } = location.state || {};
    console.log(buttonAction);

    return (
        <div className="pageDeBase">
            <div className="pageDeBaseTopContainer">
                <div className="pageDeBaseStickyBottom">
                    <h1 className="pageDeBaseTitle">{title}</h1>
                    <p>
                        {text}
                    </p>

                    <Button text={buttonContent} action={buttonAction} />
                </div>
            </div>
            <div className="pageDeBaseGridContainer"></div>
        </div>
    );
};

export default PageDeBase;