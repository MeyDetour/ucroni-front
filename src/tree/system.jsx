export function logSeparator() {
    console.log(
        "%c==================================================",
        "background: blue; color: white; font-weight: bold; font-size: 16px;"
    );
}

export function logTitle(title) {
    console.log(
        `%c#${title.toUpperCase()}`,
        "background: #195904FF; color: white; font-weight: bold; font-size: 20px; padding: 4px;"
    );
}

export function logInfo(message) {
    console.log(
        `%c[INFO]: ${message}`,
        "color: cyan; font-size: 14px; font-weight: bold;"
    );
}

export function logWarning(message) {
    console.log(
        `%c[WARNING]: ${message}`,
        "color: orange; font-size: 14px; font-weight: bold;"
    );
}

export function logError(message) {
    console.log(
        `%c[ERROR]: ${message}`,
        "color: red; font-size: 14px; font-weight: bold;"
    );
}


export const getEventPosition = (eventElement) => {
    console.log(eventElement)
    const containerElement = document.querySelector("#treeContainer");

    if (eventElement) {
        const eventRect = eventElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        return {
            x: eventRect.left - containerRect.left + eventRect.width / 2,
            y: eventRect.top - containerRect.top + eventRect.height / 2,
        };
    } else {
        return {x: 0, y: 0};
    }
};
export function createLineSvg(parentPosition,subEventPosition){

    // CREATE SVG WITH LINE IN
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");


    // Configurez la ligne
    lineElement.setAttribute("x1", parentPosition.x);
    lineElement.setAttribute("y1", parentPosition.y);
    lineElement.setAttribute("x2", subEventPosition.x);
    lineElement.setAttribute("y2", subEventPosition.y);
    lineElement.setAttribute("stroke-width", "2");



    svgElement.appendChild(lineElement);
    svgElement.classList.add(`svgTreeLine`);


return svgElement
}



//build tree map with data
//data will be in group group
export function buildTree(events) {
    console.log(events);
    const tree = new Map()
    events.forEach(event => {
        tree.set(event.id, {...event, children: [], parents: [],choicedDone:null})
    })
    events.forEach(event => {
        event.children.forEach(childId => {
            if (tree.has(childId)) {
                tree.get(childId).parents.push(event.id)
                tree.get(event.id).children.push(tree.get(childId))
            }
        })

    })
    return tree //Get racine
}


export function getMarginTop (eventsSeen,endOfTree){
    if (!eventsSeen || endOfTree) return {};
    if (eventsSeen.length < 2) return { marginTop: "-22%" };
    if (eventsSeen.length < 4) return { marginTop: "-5%" };
    if (eventsSeen.length < 6) return { marginTop: "0%" };

    return {}
}
