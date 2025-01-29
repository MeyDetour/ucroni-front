import {useEffect, useState} from "react";
import Event from "../components/event/event.jsx"
import '../components/Button/button.css'
import "./tree.css"
import React from 'react';
import axios from "axios";
import {GlobalConstants} from "../Common/GlobalConstants.js";
import {useParams} from "react-router-dom";
import {buildTree, createLineSvg, getEventPosition, logInfo, logSeparator, logTitle, logWarning} from "./system.jsx";
import Choice from "../Choice/choice.jsx";
import EndOfHistory from "../EndOfHistory/EndOfHistory.jsx";
import Button from "../components/Button/button.jsx";


export default function Tree() {
    const {storieId} = useParams();
    const [currentEvent, setCurrentEvent] = useState(null)
    const [eventsSeen, setEventsSeen] = useState([])
    const [tree, setTree] = useState(null)
    const [endOfTree, setEndOfTree] = useState(false)
    const [endOfHistoryOpen, setEndOfHistoryOpen] = useState(false)
    const [fullMap, setFullMap] = useState(null)


    //  for choice
    const [isThereChoice, setIsThereChoice] = useState(false)
    const [choiceIsDone, setChoiceIsDone] = useState(false)
    const [valueOfChoice, setValueOfChoice] = useState(null)


    /* FETCH DATA  */
    useEffect(() => {

        const fetchStories = async () => {
            try {
                logSeparator()
                logTitle("get data")
                let firstEventId = await axios.get(`${GlobalConstants.baseUrl}api/story/${storieId}`);
                firstEventId = firstEventId.data.firstEvent
                const response = await axios.get(`${GlobalConstants.baseUrl}api/events/of/story/${storieId}`);
                const buildTreeData = buildTree(response.data)
                setTree(buildTreeData.get(firstEventId))
                setFullMap(buildTreeData)
                setEventsSeen((prevEventsSeen) => {
                    if (!prevEventsSeen.includes(firstEventId)) {
                        return [...prevEventsSeen, firstEventId];
                    }
                    return prevEventsSeen;
                });
                setCurrentEvent(buildTreeData.get(firstEventId))

                logSeparator()
            } catch (err) {
                console.error("Erreur lors de la récupération des histoires :", err);
            }
        };
        if (!tree) {
            fetchStories()

        }

    }, [])


    /* READ THE TEXT */
    const handleEventClick = (eventId) => {
        logSeparator()
        logTitle("Handle Event Click")
        logInfo(`click on event ${eventId}`)
        console.log("event seen : ", eventsSeen)
        console.log(tree)
        // verify
        const event = fullMap.get(eventId)
        let canAddFocus = false;
        event.parents.forEach((parentEventId) => {
            const parentEvent = fullMap.get(parentEventId)
            if (parentEvent.choicedDone === eventId) {
                canAddFocus = true
                logInfo("add focus true")
            }
        })
        console.log("event seen : ", eventsSeen)
        console.log(tree)
        // force focus
        if (event.parents.length === 0) {
            canAddFocus = true
            logInfo("First event must have click")
        }
        console.log("event seen : ", eventsSeen)
        console.log(tree)

        // exit if no focus
        if (!canAddFocus) {
            logInfo("You cant add focus")
            logSeparator()
            return
        }
        console.log("event seen : ", eventsSeen)
        console.log(tree)
        // set event as current
        setCurrentEvent(event)


        console.log("event seen : ", eventsSeen)
        // set end of tree
        if (event.finish) {
            logInfo("End of TREE")
            setEndOfTree(true)
        }


        //  add in events seen
        logInfo(`Add event ${eventId} to events seen`)
        console.log("EventsSeen before :", eventsSeen)
        console.log("Want to include :", currentEvent.id)
        if (!eventsSeen.includes(currentEvent.id)) {
            console.log("Add event to eventseen")
            setEventsSeen((prevEventsSeen) => {
                if (!prevEventsSeen.includes(currentEvent.id)) {
                    return [...prevEventsSeen, currentEvent.id];
                }
                return prevEventsSeen;
            });

        } else {
            logInfo("Event already in eventseen")
        }


        console.log("event seen : ", eventsSeen)
        console.log(tree)
        logSeparator()

    }

    /* CHOOSE  */
    const handleDoubleEventClick = (eventId) => {
        logSeparator()
        logTitle("Handle Double Event Click")
        logInfo(`click on event ${eventId}`)
        logInfo(`tree id : ${tree.id}`)
        console.log('event seen : ', eventsSeen)
        console.log('event seen : ', eventsSeen.length)

        const event = fullMap.get(eventId)
        console.log(event)
        console.log(event.children && event.children.length > 0)
        console.log(eventsSeen.includes(eventId))
        console.log(event.choicedDone === null)
        console.log(event.children && event.children.length > 0 && eventsSeen.includes(eventId) && (event.choicedDone === null))
        console.log(eventId === tree.id && eventsSeen.length === 1, "et", tree.id && eventsSeen.length > 1)
        console.log(eventId === tree.id && eventsSeen.length === 1 || eventId !== tree.id && eventsSeen.length > 1)
        //  choice if event has children and event is not seen
        if (event.children && event.children.length > 0 && eventsSeen.includes(eventId) && (event.choicedDone === null) && (eventId === tree.id && eventsSeen.length === 1 || eventId !== tree.id && eventsSeen.length > 1)) {
            setIsThereChoice(true)
            logInfo(`Start choice for event : ${eventId}`)

            // set event as current
            setCurrentEvent(event)
            return
        } else {
            logWarning(`Cannot activate choice... Maybe event has no children or event is no in eventsSeen or event has already choice associated`)
            console.log("here eventsSeen : ", eventsSeen)
            console.log("eventsSeen include eventId ?  : ", eventsSeen.includes(eventId))
            console.log("here children of event :", event.children)
            console.log("Choice done of your event :", event.choiceDone)
        }

        logSeparator()
    }

    /* END OF GAME */

    useEffect(() => {
        function stopGame() {

        }

        if (endOfTree) {
            stopGame()
        }
    }, [endOfTree])

    /* END OF END OF GAME*/


    /* =========== RENDER TREE ============ */
    const creatUniqueEvents = (ev) => {
        logInfo(`Create unique event : ${ev.id}`)

        let addedClass = eventsSeen.includes(ev.id) ? "eventSeen " : "notSeen "

        let parentIds = ev.parents

        if (parentIds && parentIds.length > 0) {
            if (typeof parentIds === "string") {
                parentIds = parentIds.split(",").map(id => parseInt(id, 10));
            }
            addedClass += ` ${parentIds.some(parentId => eventsSeen.includes(parentId)) ? "eventAnimated" : "hide"}`;
        }

        if (endOfTree && addedClass.includes("hide") ) {
          addedClass += " youCanSeeEventItsEndOfTree"
        }
        return (
            <Event
                image={ev.images}
                text={ev.text}
                textAction={ev.interaction}
                focus={currentEvent.id === ev.id}
                injectedid={ev.id}
                parentIds={ev.parents.join(",")}
                addedClassname={addedClass}

            />

        )
    }

    const renderEventTree = (children) => {
        if (!children || children.length === 0) {
            return null;
        }
        return (
            <>

                {
                    children.length === 2 ?

                        <div className={"leftAndRightContainer"}>
                            <div className={"left"}>
                                {creatUniqueEvents(children[0])}
                                {children[0].children && children[0].children.length > 0 && renderEventTree(children[0].children)}

                            </div>
                            <div className={"right"}>
                                {creatUniqueEvents(children[1])}
                                {children[1].children && children[1].children.length > 0 && renderEventTree(children[1].children)}
                            </div>
                        </div>

                        :
                        children.length === 1 ?
                            <div className="row">
                                {creatUniqueEvents(children[0])}
                                {children[0].children && children[0].children.length > 0 && renderEventTree(children[0].children)}
                            </div>
                            : null
                }


            </>
        );
    };
    /* ============ END OF RENDER TREE =============*/


    logSeparator()
    logTitle("STATE OF YOU DATA")

    console.log("state of tree : ", tree)
    console.log("events seen : ", eventsSeen)
    console.log("end of tree : ", endOfTree)
    console.log("open end of history : ", endOfHistoryOpen)
    console.log("currentEvent : ", currentEvent)
    console.log("isThereChoice : ", isThereChoice)
    console.log("choice is done : ", choiceIsDone)
    console.log("value of choice : ", valueOfChoice)

    logSeparator()

    /* EFFECTs AFTER THE TREE APPEAR */
    useEffect(() => {

        logTitle("Useeffect after tree")

        const createLines = () => {


            /* CREATE LINES*/
            const svgContainer = document.getElementById("treeContainer");
            let events = document.querySelectorAll('[id^="event"]');


            // REMOVE DUPLICATED EVENT
            events.forEach((e) => {
                let id = e.getAttribute("data-event-id");
                id = parseInt(id)
                let existingEvent = document.querySelectorAll("#event" + id);
                if (existingEvent.length > 1) {
                    existingEvent[0].remove()
                }

                if (id !== tree.id) {

                    e.addEventListener('click', () => {
                        handleEventClick(parseInt(id))
                    })
                    e.addEventListener('dblclick', () => {
                        handleDoubleEventClick(parseInt(id))
                    })

                }

            })


            //GET EVENTS NOT DUPLICATED
            events = document.querySelectorAll('[id^="event"]');

            // ADD SVG JUST AT THE START
            let needToAddSvg = true;
            if (document.querySelectorAll(".svgTreeLine").length > 0) {
                needToAddSvg = false
            }


            events.forEach((e) => {

                // get parents ids as array
                let parentIds = e.getAttribute('data-parent-ids')
                if (parentIds) {
                    parentIds = parentIds.split(",").map(id => parseInt(id, 10));
                }

                let eventId = e.getAttribute('data-event-id');
                eventId = parseInt(eventId);

                console.log("create line between ", eventId, " adn ", parentIds);
                // if event as parent we create svg children to parent
                if (parentIds && parentIds.length > 0 && needToAddSvg) {


                    // CREATE SVG
                    parentIds.forEach((parentId) => {
                        let parentElement = document.querySelector("#event" + parentId);
                        const parentPosition = getEventPosition(parentElement);
                        const subEventPosition = getEventPosition(e);
                        console.log(parentPosition)
                        console.log(subEventPosition)
                        console.log(parentId)
                        console.log(eventId)

                        // CREATE SVG WITH LINE IN
                        const svgElement = createLineSvg(parentPosition, subEventPosition)
                        svgElement.classList.add(`svgRelation${eventId}-${parentId}`);
                        svgElement.setAttribute("data-parent-event", parentId);
                        svgElement.setAttribute("data-event", eventId);
                        if (!eventsSeen.includes(parseInt(eventId))) {
                            svgElement.classList.add("hide");
                        }
                        if (!eventsSeen.includes(parseInt(parentId))) {
                            svgElement.classList.add("notShowed");
                        }
                        if (parentElement.classList.contains("firstEvent")) {
                            svgElement.classList.add(`lineAnimated`);
                        }
                        svgElement.classList.add(`svgRelation${eventId}-${parentId}`);
                        if (!eventsSeen.includes(parseInt(eventId))) {
                            svgElement.classList.add("hide");
                        }
                        if (!eventsSeen.includes(parseInt(parentId))) {
                            svgElement.classList.add("notShowed");
                        }
                        svgElement.setAttribute("data-parent-event", parentId);
                        svgElement.setAttribute("data-event", eventId);

                        svgContainer.appendChild(svgElement);
                        console.log("line created : ", svgContainer)
                        // ADD SVG TO HTML
                        svgContainer.appendChild(svgElement);
                        console.log("line created : ", svgContainer)

                    })
                }


                if (!needToAddSvg) {
                    /* UPDATE LINES */
                    let svgs = document.querySelectorAll(".svgTreeLine")
                    svgs.forEach(svg => {
                        let svgParentId = svg.getAttribute("data-parent-event")
                        let svgEventId = svg.getAttribute("data-event")
                        svgParentId = parseInt(svgParentId);

                        svgEventId = parseInt(svgEventId);


                        if (svg.classList.contains("hide")) {
                            if (eventsSeen.includes(svgParentId) && eventsSeen.includes(svgEventId)) {
                                svg.classList.remove("hide")
                            }
                        }


                        if (svg.classList.contains("notShowed")) {
                            if (eventsSeen.includes(svgParentId)) {
                                svg.classList.remove("notShowed")
                                svg.classList.add("lineAnimated");
                            }
                        }

                        if(endOfTree && !svgContainer.classList.contains("lineAnimated")) {
                            svg.classList.add("youCanSeeLineItsEndOfTree")
                        }


                    })
                }

            })


        }


        if (tree && fullMap && !choiceIsDone && !isThereChoice) {
            console.log("createlines")
            createLines();
        }


        if (choiceIsDone && !isThereChoice && valueOfChoice) {

            logSeparator()
            logTitle("Choice choosen")
            console.log("it seems you choose something")
            const addEventToEventsSeen = () => {
                //  add event so seen
                let eventChoosen = fullMap.get(valueOfChoice)

                console.log("value of chocie:", valueOfChoice)
                currentEvent.choicedDone = valueOfChoice;
                fullMap.get(currentEvent.id).choiceDone = valueOfChoice
                logInfo(`New choice of ${currentEvent.id} is ${valueOfChoice}`);
                // switch current event from event to his children
                setCurrentEvent(currentEvent.children.find((ev) => ev.id === valueOfChoice));
                logInfo(`New current event is  ${currentEvent.children.find((ev) => ev.id === valueOfChoice)}`);

                setEventsSeen((prevEventsSeen) => {
                    if (!prevEventsSeen.includes(valueOfChoice)) {
                        return [...prevEventsSeen, valueOfChoice];
                    }
                    return prevEventsSeen

                });

                if (eventChoosen && eventChoosen.finish) {
                    logInfo("End of TREE")
                    setEndOfTree(true)
                    setEndOfHistoryOpen(true)
                }

                logInfo(`Add Event choosen to events seen`);

                // reset values
                setValueOfChoice(null)
                setIsThereChoice(false)
                setChoiceIsDone(false)

                logInfo(`Reset value`);
            }

            addEventToEventsSeen()

            logSeparator()
        }


    }, [eventsSeen, tree, isThereChoice]);


    return (
        <>
            {isThereChoice  && <Choice currentEvent={currentEvent} choice={currentEvent.children} setIsThereChoice={setIsThereChoice}
                                      setChoiceIsDone={setChoiceIsDone} setValueOfChoice={setValueOfChoice}></Choice>}

            {endOfTree && currentEvent && endOfHistoryOpen &&
            <EndOfHistory current={currentEvent} setEndOfHistoryOpen={setEndOfHistoryOpen} ></EndOfHistory>
            }

            <div className={"treePage"}>
                    <span className={"lastChoiceSpan"}>
                      {(() => {
                          if (!currentEvent || !fullMap || !currentEvent.parents) return null;

                          const parentId = currentEvent.parents[0];
                          const parentNode = fullMap.get(parentId);

                          if (parentNode?.children?.length > 1) {
                              return `Votre choix : ${currentEvent.interaction}`;
                          }

                          return null;
                      })()}
                    </span>
                <div className="currentTextEventContainer">

                    <h2 className={"currentTextEvent"}>{currentEvent && currentEvent.text ? currentEvent.text : "Selectionnez un évenement, Cliquez pour voir l'histoire, double-cliquez pour choisir et passer à l'étape suivante !"}</h2>
                </div>
                {tree && currentEvent && fullMap && tree.id &&

                    <div
                        style={{
                            transform: `translate(0px, 0px)`,
                            width: "80%", // Large zone à explorer

                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end"
                        }}
                        id="treeContainer"
                    >
                        {renderEventTree(tree.children, true)}

                        <div className={"row"}
                             onClick={() => {
                                 handleEventClick(tree.id)
                             }}
                             onDoubleClick={() => {
                                 logSeparator()
                                 logTitle("Handle Double Event Click Main Node")
                                 logInfo(`tree id : ${tree.id}`)
                                 console.log('event seen : ', eventsSeen)
                                 console.log('event seen : ', eventsSeen.length)

                                 console.log(tree)
                                 console.log(tree.children && tree.children.length > 0)
                                 if (tree.children && tree.children.length > 0 && (tree.choicedDone === null) && eventsSeen.length === 1) {
                                     setIsThereChoice(true)
                                     logInfo(`Start choice for event : ${tree}`)

                                     // set event as current
                                     setCurrentEvent(tree)
                                     return
                                 } else {
                                     logWarning(`Cannot activate choice... Maybe event has no children or event is no in eventsSeen or event has already choice associated`)
                                     console.log("here eventsSeen : ", eventsSeen)
                                     console.log("eventsSeen include eventId ?  : ", eventsSeen.includes(tree.id))
                                     console.log("here children of event :", tree.children)
                                     console.log("Choice done of your tree :", event.choiceDone)
                                 }

                                 logSeparator()
                             }}

                        >

                            <Event
                                image={tree.images}
                                text={tree.text}
                                textAction={tree.interaction}
                                addedClassname={tree.id === 1 ? "firstEvent" : null}
                                focus={currentEvent === tree}>
                                injectedid={tree.id}

                            </Event>

                        </div>
                        {endOfTree &&
                            <Button text={"Revenir au menu"} action={"/"} ></Button>
                        }
                    </div>
                }

            </div>


        </>
    )

}
