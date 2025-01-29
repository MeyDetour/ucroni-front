import './event.css'
import {GlobalConstants} from "../../Common/GlobalConstants.js";
// eslint-disable-next-line react/prop-types
export default function Event({
                                  parentIds = null,
                                  injectedid = 1,
                                  text,
                                  textAction,
                                  focus = false,
                                  image,
                                  addedClassname = " "
                              }) {
    return (
        <div data-event-id={injectedid}
             data-parent-ids={parentIds}
             id={"event" + injectedid}
             className={`eventContainer ${focus ? "focus" : "unfocus"} ${addedClassname ? addedClassname : ""}`}
        >

            <div className={` event  `}>
                <img src={  image ? GlobalConstants.baseUrl + image: "../../src/assets/tree/ReadyPlayerOne.jpg"} alt=""/>


            </div>
            <div className="bgBlack"></div>

        </div>
    )
}