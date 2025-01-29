import React, { useEffect, useState } from "react";
import axios from "axios";
import { GlobalConstants } from "../Common/GlobalConstants.js";
import "./StoriesList.css";

const StoriesList = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${GlobalConstants.baseUrl}api/stories`);
            setStories(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des histoires :", err);
            setError("Impossible de récupérer les histoires. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Liste des Histoires</h1>
            {loading && <p className="loading">Chargement des histoires...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && stories.length === 0 && (
                <p className="no-stories">Aucune histoire disponible.</p>
            )}
            {!loading && !error && stories.length > 0 && (
                <ul className="stories-list">
                    {stories.map((story) => (
                        <li key={story.id} className="story-item">
                            <h2>{story.text}</h2>
                            <p>Interaction : {story.interaction}</p>
                            {story.images && story.images.length > 0 && (
                                <div className="image-gallery">
                                    {story.images.map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={`${GlobalConstants.baseUrl}/${imageUrl}`}
                                            alt={`Image ${index + 1}`}
                                            className="story-image"
                                        />
                                    ))}
                                    <a href="" className="button">lala</a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StoriesList;
