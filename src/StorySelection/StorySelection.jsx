import './StorySelection.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {GlobalConstants} from "../Common/GlobalConstants.js";


export const StorySelection = () => {
    const[test, setTest] = useState([{name:"default"}])
    const navigate = useNavigate();

    let i = 0


    useEffect(() => {
        testfunc()
    }, [])


    async function testfunc(){
        let api = await fetch(`${GlobalConstants.baseUrl}api/stories`)
        let apijson = await api.json()
        setTest(apijson)
    }

    async function handleCardClick(e) {

        const text = " Vous allez assister à une suite d’évènements, en allant du plus\n" +
            "                        récent au plus ancien. Nous vous en dirons plus après. Soyez\n" +
            "                        attentif ! Êtes-vous prêt ?"
        const title = "Bienvenue"
        const buttonContent = "Commencer"
        const buttonAction = "/story/"+e.target.id


        navigate("/pageDeBase", {
            state: {text, title, buttonContent, buttonAction}
        });
    }
    return (
        <div className="home">
            <div className="mainContainer" >
                <div className="topContainer">
                    <h1>Bienvenue</h1>
                    <p>Choisissez une histoire parmis celles proposées ci-dessous</p>
                </div>
                <div className="bottomContainer">
                    {
                        test?.map((item) => {
                            i++
                            return(
                                // eslint-disable-next-line react/jsx-key
                                <div id={item.id} onClick={handleCardClick} className={`card card${i}`}>
                                    <p className="cardTitle">
                                        {item.title}
                                    </p>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
            <div className="gridContainer">
            </div>
        </div>
    )
}
export default StorySelection;