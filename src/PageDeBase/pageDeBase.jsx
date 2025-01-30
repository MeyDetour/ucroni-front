import './pageDeBase.css';
import Button from "../components/Button/button.jsx";
import {useLocation} from "react-router-dom";

export const PageDeBase = () => {
    const location = useLocation();
    const { text, title, buttonContent, buttonAction , context = "rien" } = location.state || {};
    console.log(buttonAction);

    return (
        <div className="pageDeBase">
            <div className="pageDeBaseTopContainer">
                <div className="pageDeBaseStickyBottom">
                    <h1 className="pageDeBaseTitle">{title}</h1>
                    <p>
                        {text}
                    </p>
                    {context  === "consigne" &&
                        <p className={"consigne"}> - Cliquez pour voir l'histoire, double-cliquez pour choisir et passer à l'étape suivante ! - </p>
                    }

                    <Button text={buttonContent} action={buttonAction} />
                </div>
            </div>
            <div className="pageDeBaseGridContainer"></div>
        </div>
    );
};

export default PageDeBase;