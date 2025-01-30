import "./choice.css";
import React from 'react';
import {logError, logInfo, logWarning} from "../tree/system.jsx";
import {GlobalConstants} from "../Common/GlobalConstants.js";


// eslint-disable-next-line react/prop-types
export default function Choice({choice = [], setIsThereChoice, setChoiceIsDone, setValueOfChoice, currentEvent}) {

    //  isThereChoice to cancel choice an remove choice interface but keep possibility to choose choice
    // isThereChoice will be false but current event will be this event when you click on isThereChoice will be again
    // true because event will not be in event seen. An not event seen can be focused
    //  setChoiceIsDone to close choice, when choice is choosen isThereChoice is false

    if (choice.length === 0) {
        return <h1>Aucun choix disponible</h1>;
    }

    logError("Choice Panel is open")
    return (
        <>
            <div className={"choicePage"}>

                <div className="top">
                    <div onClick={() => {
                        setIsThereChoice(false)
                    }} className="top-content">
                        <img
                            src="/src/assets/choice/arrow-left.svg"
                            alt="Retour"
                            className="arrow-left"
                        />
                        <span>Retourner à l'arbre</span>
                    </div>
                    <div>
                        <span>Petit rappel :</span>
                        <span>{currentEvent.text}</span>
                    </div>
                </div>
                <div className={`content ${choice.length === 1 ? "single" : ""}`}>
                    <div className="title">Faites votre choix</div>

                    <div
                        className={`content-choice ${
                            choice.length === 1 ? "single-choice" : ""
                        }`}
                    >
                        {choice.map((item, index) => (

                            <div
                                key={item.id}
                                className="zone-choice"
                                onClick={() => {
                                    setChoiceIsDone(true)
                                    setIsThereChoice(false)
                                    setValueOfChoice(item.id)
                                }}
                            >

                                {index === 0 && <div className="toile"></div>}

                                   <div className="circle">
                                       <div className="image-background">

                                       {item.images ? (
                                            <img
                                                src={GlobalConstants.baseUrl + item.images}
                                                alt=""
                                                className="choice-image"
                                            />
                                        ) : (
                                            <img
                                                src="/src/assets/choice/emeraude.jpg"
                                                alt=""
                                                className="choice-image"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="button-zone">
                                    <button className="choice-button">
                                        {item.interaction}
                                    </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}




