import {useEffect, useState} from "react";
import {GlobalConstants} from "../Common/GlobalConstants.js";
import "../Event/EventCreation.css"
import {Link} from "react-router";
import axiosHttp from "../auth/interceptor.js";

export const PathCreation = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState();

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);
    const [image6, setImage6] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetch(`${GlobalConstants.baseUrl}api/stories`)
            .then(async res => {
                let response = await res.json()
                console.log(response)
                setStories(response)
            })
            .catch(err => console.log(err));
    }, []);

    const handleSubmit = async () => {


        setError(null);
        setSuccess(null);
        if(!image1 || !image2 || !image3 || !image4){
            setError("You must provide 4 images");
            return;
        }

        const formData = new FormData();
        formData.append("image1", image1);
        formData.append("image2", image2);
        formData.append("image3", image3);
        formData.append("image4", image4);
        if (image5) {
            formData.append("image5", image5);
        }
        if (image6) {
            formData.append("image6", image6);
        }
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {


            const pathResponse = await axiosHttp.post(
                `${GlobalConstants.baseUrl}api/path/new/for/story/${selectedStory}`,
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );

            console.log("story créé avec succès :", pathResponse);

            setSuccess("story créé avec succès !");

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
                        <label htmlFor="imageUpload">Image 1</label>
                        <input
                            id="image1"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage1([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUpload">Image 2</label>
                        <input
                            id="image2"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage2([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUpload">Image 3</label>
                        <input
                            id="image3"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage3([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUpload">Image 4</label>
                        <input
                            id="image4"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage4([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUpload">Image 5 (facultatif)</label>
                        <input
                            id="image5"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage5([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUpload">Image 6 (facultatif) </label>
                        <input
                            id="image6"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                setImage6([...e.target.files]);
                                console.log([...e.target.files]);
                            }}
                            className="form-input"
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
                </div>

                <div className="form-actions">
                    <button onClick={handleSubmit} className="form-button" type="button">
                        Créer
                    </button>
                    <Link className={"link"} to={"/eventcreation"}>Let's create event</Link>

                </div>
            </div>
        </div>
    );
};

export default PathCreation;
