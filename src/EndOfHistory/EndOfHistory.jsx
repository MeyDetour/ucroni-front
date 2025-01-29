import "./EndOfHistory.css"
import "../PageDeBase/pageDeBase.css"
import React, {useEffect, useState} from 'react';
import "../components/Button/button.css"
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function EndOfHistory({current, setEndOfHistoryOpen}) {
    const [renderText, setRenderText] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setRenderText(true);
        }, 3500)
        if (!current) {
            return null
        }

    }, [current, setRenderText]);

    return (
        <>
            {!renderText ?

                <div className={"endOfHistory"}>
                    <div>
                        <img src={current.images ? current.images : "/src/assets/tree/ReadyPlayerOne.jpg"} alt=""/>
                    </div>
                </div>
                :
                <div className="pageDeBase">
                    <div className="pageDeBaseTopContainer">
                        <div className="pageDeBaseStickyBottom">
                            <h1>Fin</h1>
                            <p>
                                {current.text}
                            </p>

                            <button className={"button"} onClick={()=>{
                                console.log("click")
                                setEndOfHistoryOpen(false)
                            }}>Revoir mes choix</button>

                        </div>
                    </div>
                    <div className="pageDeBaseGridContainer"></div>
                </div>
            }

        </>
    );
}




