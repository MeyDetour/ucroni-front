import './App.css'
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import {EventCreation} from "./Event/EventCreation.jsx";
import Tree from "./tree/tree.jsx";
import History from "./History/history.jsx";

import StorySelection from "./StorySelection/StorySelection.jsx";

import PageDeBase from "./PageDeBase/pageDeBase.jsx";
import StoryCreation from "./StoryCreation/StoryCreation.jsx";
import PathCreation from "./PathCreation/PathCreation.jsx";

function App() {


    return (
        <BrowserRouter>
            <Routes>
                {/* home */}
                <Route path="/" element={<StorySelection/>}/>


                {/* create event */}
                <Route path="/eventcreation" element={<EventCreation/>}/>
                {/* create story */}
                <Route path="/storycreation" element={<StoryCreation/>}/>
                {/* create path */}
                <Route path="/pathcreation" element={<PathCreation/>}/>

                {/* image qui defilent*/}
                <Route path="/story/:storieId" element={<History/>}/>

                {/* play one story and get tree*/}
                <Route path="/story/play/:storieId" element={<Tree/>}/>

                <Route
                    path="/pageDeBase"
                    element={<PageDeBase/>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App
