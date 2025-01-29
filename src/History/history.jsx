import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "./history.css";
import {GlobalConstants} from "../Common/GlobalConstants.js";

const App = () => {
    const {storieId} = useParams();
    const navigate = useNavigate(); // Add navigation hook
    const [storyPath, setStoryPath] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRecapVisible, setIsRecapVisible] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function getPath() {
            console.log("get path")
            try {
                console.log(` fetch ${GlobalConstants.baseUrl}api/get/path/${storieId}`)
                let api = await fetch(`${GlobalConstants.baseUrl}api/get/path/${storieId}`)
                let response = await api.json()
                console.log(response)
                let newImages = [response.imageOne.imageUrl, response.imageTwo.imageUrl, response.imageThree.imageUrl, response.imageFour.imageUrl, response.imageFive?.imageUrl, response.imageSix?.imageUrl]
                newImages.forEach((image) => {
                    setStoryPath((prevImage) => {
                        if (!image) {
                            return prevImage;
                        }
                        if (!prevImage.includes(image)) {
                            return [...prevImage, image];
                        }
                        return prevImage

                    });
                })

            } catch (err) {

                console.error("Erreur lors de la requête :", err);
                setError("Impossible de charger l'histoire.");

            }
        }
        getPath()

    }, [storieId]);


    useEffect(() => {
        if (storyPath.length > 0 && currentIndex < storyPath.length) {
            const timeout = setTimeout(() => {
                if (currentIndex < storyPath.length - 1) {
                    setCurrentIndex((prevIndex) => prevIndex + 1);
                } else {
                    setIsRecapVisible(true);

                    // Redirect to another page after a delay when recap is visible
                    setTimeout(async () => {
                        let api = await fetch(`${GlobalConstants.baseUrl}api/stories`)
                        let apijson = await api.json()
                        apijson = apijson[0]
                        const text = apijson.description+ "\n    Cependant, vous avez le pouvoir de changer le cours des chose.\n" +
                            "                         Voulez-vous essayer d'éviter cette fin  ? "
                        const title = apijson.title;
                        const buttonContent = "Commencer"
                        const buttonAction = "/story/play/" + storieId


                        navigate("/pageDeBase", {
                            state: {text, title, buttonContent, buttonAction}
                        });
                    }, 2000); // 2 seconds delay after recap is shown
                }
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [storyPath, currentIndex, navigate]);

    // Affichage des erreurs
    if (error) {
        return <div className="error">{error}</div>;
    }

    // Affichage du chargement
    if (storyPath.length === 0) {
        return <div> </div>;
    }

    // Affichage du récapitulatif
    if (isRecapVisible) {
        return (
            <div className="recap-container">
                <div className="recap-line"/>
                {storyPath.map((url,index) => (
                    <div key={index} className={`recap-bubble  ${index === 0 || index === storyPath.length -1 ? "gros" :""}`}>
                        {url ?
                            <img
                                src={`${GlobalConstants.baseUrl}${url}`}
                                alt=""
                            />
                         : (
                            <div className="placeholder-image">Aucune Image</div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="story-container">
            <div className="story-line"/>
            {storyPath.length > 0 && (
                <div className="story-bubble-wrapper">
                    {storyPath
                        .filter((_, index) => index === currentIndex)
                        .map((story) => (
                            <div
                                key={story.id}
                                className={`story-bubble ${
                                    currentIndex === storyPath.length - 1
                                        ? "last-circle"
                                        : currentIndex === 0 ? "first-circle"  : " "
                                }`}
                            >
                                {story  ? (
                                    <img
                                        src={`${GlobalConstants.baseUrl}${story}`}
                                        alt=""
                                        className="story-image"
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/200"
                                        alt="Placeholder"
                                        className="story-image"
                                    />
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default App;
