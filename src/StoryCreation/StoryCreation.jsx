import { useEffect, useState } from "react";
import { GlobalConstants } from "../Common/GlobalConstants.js";
import "../Event/EventCreation.css"
import {Link} from "react-router";

export const StoryCreation = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
     const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        try {
            const story = { title,description };
            console.log(story);
            const eventResponse = await fetch(GlobalConstants.baseUrl + "api/storie",{
                method: "POST",
                body: JSON.stringify(story),
            } );

            console.log("story créé avec succès :", eventResponse.data);

            setSuccess("story créé avec succès !");
            setTitle("");
            setDescription("")
        } catch (err) {
            console.error("Erreur lors de la soumission :", err);
            setError("Une erreur est survenue lors de la soumission.");
        }
    };



    return (

        <div className="container">
            <div className="form-container">
                <div className="form-header">
                    <h1 className="form-title">Créer une histoire</h1>

                </div>

                {error && <p className="form-error">{error}</p>} {}
                {success && <p className="form-success">{success}</p>} {}

                <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="textInput">Titre de l'histoire</label>
                        <input
                            id="textInput"
                            type="text"
                            placeholder="Entrez le titre de l'histoire"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="interactionInput">Description</label>
                        <input
                            id="interactionInput"
                            type="text"
                            placeholder="Entrez la description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>


                </div>

                <div className="form-actions">
                    <button onClick={handleSubmit} className="form-button" type="button">
                        Créer
                    </button>
                    <Link  className={"link"}  to={"/eventcreation"}>Let's create event</Link>

                </div>
            </div>
        </div>
    );
};

export default StoryCreation;
