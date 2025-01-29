import {useEffect, useState} from "react";
import axiosHttp from "../auth/interceptor.js";
import {GlobalConstants} from "../Common/GlobalConstants.js";
import "./EventCreation.css";
import {Link} from "react-router";

export const EventCreation = () => {
    const [text, setText] = useState("");
    const [interaction, setInteraction] = useState("");
    const [causes, setCauses] = useState("");
    const [finish, setFinish] = useState(false);
    const [images, setImages] = useState([]); // État pour stocker les fichiers image
    const [imageEnd, setImageEnd] = useState([]); // État pour stocker les fichiers image
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState();

    useEffect(() => {
        fetch(`${GlobalConstants.baseUrl}api/stories`)
            .then(async res => {
                let response = await res.json()
                console.log(response)
                setStories(response)
            })
            .catch(err => console.log(err));
    }, []);


    const uploadImages = async (formData, link) => {

        console.log(link)
        try {
            const response = await axiosHttp.post(
                `${GlobalConstants.baseUrl}${link}`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                    method: "POST",
                }
            );
            console.log("Images ajoutées avec succès :", response.data);
            setImages([]);
            setText("")
            setCauses("")
            setInteraction("")
            setSelectedStory(null)
            setFinish(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout des images :", error);
            throw new Error("Impossible d'ajouter les images.");
        }
    };


    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        try {
            const event = {text, interaction, causes, selectedStory, finish};

            if (text === "") {
                return
            }
            event.selectedStory = parseInt(selectedStory);
            console.log(GlobalConstants.baseUrl + "api/event")
            console.log(event)
            let eventResponse = await fetch(GlobalConstants.baseUrl + "api/event", {
                method: "POST",
                body: JSON.stringify(event),
            });

            eventResponse = await eventResponse.json();
            console.log("Événement créé avec succès :", eventResponse);
            setSuccess("id created : " + eventResponse.id)
            if (images.length > 0) {
                const formData = new FormData();

                // Ajoute chaque fichier individuellement avec la clé "images"
                images.forEach((image) => {
                    formData.append("images", image);
                })
                for (const pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }
                await uploadImages(formData, `api/event/images/${eventResponse.id}`);
            }
            // if (imageEnd) {
            //     const formData = new FormData();
            //     formData.append("image", imageEnd);
            //     for (const pair of formData.entries()) {
            //         console.log(pair[0], pair[1]);
            //     }
            //     await uploadImages(formData, `api/event/end-image/${eventResponse.id}`);
            // }

        } catch (err) {
            console.error("Erreur lors de la soumission :", err);
            setError("Une erreur est survenue lors de la soumission.");
        }
    };


    return (<>
            {stories &&

                <div className={"eventCreationPage"}>

                    <div className="container">
                        <div className="form-container">
                            <div className="form-header">
                                <h1 className="form-title">Créer un Événement</h1>
                                <p className="form-subtitle">Ajoutez les informations et les images associées</p>
                            </div>

                            {error && <p className="form-error">{error}</p>} {}
                            {success && <p style={{color: "green"}} className="form-success">{success}</p>} {}

                            <div className="form-content">
                                <div className="form-group">
                                    <label htmlFor="textInput">Texte de l'événement</label>
                                    <input
                                        id="textInput"
                                        type="text"
                                        placeholder="Entrez le texte de l'événement"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="interactionInput">Interaction</label>
                                    <input
                                        id="interactionInput"
                                        type="text"
                                        placeholder="Entrez l'interaction"
                                        value={interaction}
                                        onChange={(e) => setInteraction(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="imageUpload">Images (facultatif)</label>
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            setImages([...e.target.files]);
                                            console.log([...e.target.files]);
                                        }}
                                        className="form-input"
                                    />
                                    <br/>
                                    <br/>

                                </div>

                                <div className="form-group">
                                    <label htmlFor="causesSelect">Causes</label>
                                    <input
                                        id="causes"
                                        type="text"
                                        placeholder="Entrez l'interaction"
                                        value={causes}
                                        onChange={(e) => setCauses(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="causesSelect">Est-ce une fin ?</label>
                                    <input
                                        id="causes"
                                        type="checkbox"
                                        placeholder=""
                                        value={finish}
                                        onChange={(e) => setFinish("true" === e.target.value)}
                                        className="form-check"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{
                                    gap: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                }}>
                                    <label htmlFor="causesSelect">Si l'evenement est le premier evenement d'une histoire
                                        cocher
                                        l'histoire ci dessous </label>
                                    {stories.map((story) => (
                                        <div key={story.id} className="form-check">
                                            <input
                                                type="radio"
                                                id={`story-${story.id}`}
                                                name="story"
                                                value={story.id}
                                                checked={selectedStory === story.id.toString()}
                                                onChange={(e) => setSelectedStory(e.target.value)}
                                                className="form-check-input"
                                            />
                                            <label htmlFor={`story-${story.id}`} className="form-check-label">
                                                {story.title}
                                            </label>
                                        </div>
                                    ))}

                                </div>
                                {/*<div className="form-group">*/}
                                {/*    <label htmlFor="imageUpload">Image de fin</label>*/}
                                {/*    <input*/}
                                {/*        id="imageUploadForEnd"*/}
                                {/*        type="file"*/}
                                {/*        accept="image/*"*/}
                                {/*        multiple*/}
                                {/*        onChange={(e) => {*/}
                                {/*            setImageEnd([...e.target.files]);*/}
                                {/*            console.log([...e.target.files]);*/}
                                {/*        }}*/}
                                {/*        className="form-input"*/}
                                {/*    />*/}
                                {/*    <br/>*/}
                                {/*    <br/>*/}

                                {/*</div>*/}


                            </div>

                            <div className="form-actions">
                                <button onClick={handleSubmit} className="form-button" type="button">
                                    Créer l'Événement
                                </button>
                            </div>
                            <Link className={"link"} to={"/storycreation"}>Let's create an history</Link>


                        </div>
                    </div>
                    <div className={"preview"}>

                    </div>
                </div>
            }
        </>
    );
};

export default EventCreation;
