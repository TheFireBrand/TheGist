import * as React from "react"
import { Children, useState } from "react"
import {
    Frame,
    addPropertyControls,
    ControlType,
    RenderTarget,
    withCSS,
} from "framer"
import { motion } from "framer-motion"
import hash from "@emotion/hash"
import { renderToString } from "react-dom/server"

/**
 * ARC TEXT
 * By Adam and Benjamin
 *
 * @framerIntrinsicWidth 150
 * @framerIntrinsicHeight 150
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
const Arc: React.ComponentType<any> = withCSS(
    function Arc(props) {
        // Checks
        const hasChildren = Children.count(props.slots) > 0
        const isCanvas = RenderTarget.current() === RenderTarget.canvas
        const showCustomPath = hasChildren && props.type === "graphic"

        // For Ellipse
        const isCircle = props.type === "circle"
        const isEllipse = props.type === "ellipse"
        const cylinder = isEllipse ? props.cylinderHeight / 2 : 0

        // Base arc path
        let path = createPath(props.flip, cylinder)
        let childPath
        let viewBox

        // If graphic is connected
        if (showCustomPath) {
            const firstChild = getFirstChild(props.slots)
            const svgChild = getFirstChild(firstChild.props.svg)
            const svgChildCanvas = getFirstChild(firstChild.props.children)

            // Show placeholder on canvas if connected layer isn’t a graphic
            if (isCanvas && !svgChildCanvas.props.frame) {
                return (
                    <div style={placeholderStyles}>
                        <div style={emojiStyles}>💎</div>
                        <p style={titleStyles}>Please connect to Graphic</p>
                        <p style={subtitleStyles}>
                            You can only connect the Arc to a Graphic with a
                            single path.
                        </p>
                    </div>
                )
            }

            // Grab the react element from the canvas and turn it into SVG
            if (isCanvas && svgChildCanvas) {
                const svgString = renderToString(svgChildCanvas)

                // Canvas does not give us viewBox within the string
                const canvasFrame = svgChildCanvas.props.frame

                viewBox = `0 0 ${canvasFrame.width} ${canvasFrame.height}`

                let attributes = svgString.match(/[\w-]+="[^"]*"/g)
                for (const element of attributes) {
                    if (element.includes("d=")) {
                        childPath = splitAndReplace(element)
                    }
                }
            }

            // On the preview/deploy we already get the SVG string
            if (!isCanvas && svgChild) {
                let attributes = svgChild.match(/[\w-]+="[^"]*"/g)
                viewBox = svgChild.split("viewBox=")[1]
                viewBox = viewBox.split(">")[0]
                viewBox = viewBox.replace(/^"(.+(?="$))"$/, "$1")

                for (const element of attributes) {
                    if (element.includes("d=")) {
                        childPath = splitAndReplace(element)
                    }
                }
            }
        }

        // Unique IDs to avoid multiple instances on the canvas sharing a single path
        const id = `curve-${hash(childPath || path)}`

        // Alignment icon conversion
        let alignmentValue
        if (props.alignmentBaseline === "top") alignmentValue = "Text Top"
        if (props.alignmentBaseline === "center") alignmentValue = "Central"
        if (props.alignmentBaseline === "bottom") alignmentValue = "Hanging"

        return (
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                    // userSelect: "none",
                    // pointerEvents: "none",
                    position: "relative",
                }}
                draggable="false"
            >
                <motion.svg
                    className="transform-origin-center-center"
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "center",
                        willChange: props.rotate && "transform",
                    }}
                    viewBox={showCustomPath ? viewBox : `0 0 100 100`}
                    overflow="visible"
                    animate={isCircle && props.rotate && { rotate: 360 }}
                    transition={
                        isCircle &&
                        props.rotate && {
                            duration: 100 / props.rotateSpeed,
                            repeat: Infinity,
                            ease: "linear",
                        }
                    }
                >
                    <path
                        id={id}
                        d={showCustomPath ? childPath : path}
                        strokeWidth="none"
                        fill="transparent"
                    />

                    <text>
                        <textPath
                            href={`#${id}`}
                            startOffset={props.startOffset}
                            dominantBaseline={alignmentValue}
                            style={{
                                ...props.font,
                                wordSpacing: props.wordSpacing,
                                fill: props.color,
                            }}
                        >
                            {props.text}
                            {!isCanvas && props.animate && (
                                <animate
                                    attributeName="startOffset"
                                    from={`${props.animateStart}%`}
                                    to={`${props.animateEnd}%`}
                                    begin="0s"
                                    dur={`${props.animateDuration}s`}
                                    repeatCount="indefinite"
                                ></animate>
                            )}
                        </textPath>
                    </text>
                </motion.svg>
            </motion.div>
        )
    },
    // Work around a bug with framer-motion that calculates a px origin when animating SVG elements.
    [
        ".transform-origin-center-center { transform-origin: center center !important; }",
    ]
)

export default Arc

Arc.defaultProps = {
    height: 50,
    width: 50,
}

addPropertyControls(Arc, {
    text: {
        title: "Content",
        type: ControlType.String,
        defaultValue: "✦ THANK YOU ✦ FOR VISITING",
        displayTextArea: true,
    },
    type: {
        title: "Type",
        type: ControlType.Enum,
        options: ["circle", "ellipse", "graphic"],
        optionTitles: ["Circle", "Ellipse", "Graphic"],
        defaultValue: true,
    },
    cylinderHeight: {
        title: "Height",
        type: ControlType.Number,
        unit: "px",
        min: 0,
        max: 1000,
        hidden: ({ type }) => type !== "ellipse",
    },
    rotate: {
        type: ControlType.Boolean,
        title: "Rotate",
        defaultValue: false,
        hidden: ({ type }) => type !== "circle",
    },
    rotateSpeed: {
        type: ControlType.Number,
        title: "Speed",
        min: 0,
        max: 50,
        defaultValue: 5,
        displayStepper: true,
        step: 1,
        hidden: ({ type, rotate }) => type !== "circle" || !rotate,
    },
    slots: {
        type: ControlType.ComponentInstance,
        title: "Graphic",
        hidden: ({ type }) => type !== "graphic",
    },
    alignmentBaseline: {
        title: "Align",
        type: ControlType.Enum,
        options: ["top", "center", "bottom"],
        optionIcons: ["align-top", "align-middle", "align-bottom"],
        defaultValue: "bottom",
        displaySegmentedControl: true,
    },
    flip: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Direction",
        enabledTitle: "CW",
        disabledTitle: "CCW",
        hidden: ({ type }) => type === "graphic",
    },
    startOffset: {
        title: "Offset",
        type: ControlType.Number,
        defaultValue: 0,
        max: 360,
        unit: "°",
        step: 0.5,
    },
    color: {
        title: "Color",
        type: ControlType.Color,
        defaultValue: "#999",
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        displayTextAlignment: false,
    },
    wordSpacing: {
        type: ControlType.Number,
        step: 1,
        defaultValue: 0,
        title: "Word",
        displayStepper: true,
    },
    animate: {
        type: ControlType.Boolean,
        defaultValue: false,
        title: "Animate",
    },
    animateStart: {
        type: ControlType.Number,
        min: -200,
        max: 200,
        step: 0.1,
        defaultValue: -50,
        title: "From",
        unit: "%",
        hidden: (props) => !props.animate,
    },
    animateEnd: {
        type: ControlType.Number,
        min: -200,
        max: 200,
        step: 0.1,
        defaultValue: 150,
        title: "To",
        unit: "%",
        hidden: (props) => !props.animate,
    },
    animateDuration: {
        type: ControlType.Number,
        min: 0,
        max: 50,
        defaultValue: 5,
        title: "Time",
        unit: "s",
        displayStepper: true,
        hidden: (props) => !props.animate,
    },
})

/* Method to get the first child */
function getFirstChild(slots) {
    let firstChild

    Children.map(slots, (child) => {
        if (firstChild === undefined) {
            firstChild = child
        }
    })

    return firstChild
}

/* Method to get stringless attributes */
const splitAndReplace = (string) => {
    return string.split("=")[1].replace(/['"]+/g, "")
}

/* Path creation method */
const createPath = (flip, cylinder) => {
    const cylinderTop = 50 - cylinder
    const cylinderBottom = 50 + cylinder
    return !flip
        ? `M 0 50 L 0 ${cylinderTop} A 1 1 0 0 1 100 ${cylinderTop} L 100 50 L 100 ${cylinderBottom} A 1 1 0 0 1 0 ${cylinderBottom} L 0 ${cylinderTop}`
        : `M 0 50 L 0 ${cylinderBottom} A 1 1 0 1 0 100 ${cylinderBottom} L 100 ${cylinderTop} A 1 1 0 1 0 0 ${cylinderTop} L 0 50`
}

/* Styles */
const placeholderStyles = {
    display: "flex",
    width: "100%",
    height: "100%",
    placeContent: "center",
    placeItems: "center",
    flexDirection: "column",
    color: "#96F",
    background: "rgba(136, 85, 255, 0.1)",
    fontSize: 11,
    overflow: "hidden",
}

const emojiStyles = {
    fontSize: 32,
    marginBottom: 10,
}

const titleStyles = {
    margin: 0,
    marginBottom: 10,
    fontWeight: 600,
    textAlign: "center",
}

const subtitleStyles = {
    margin: 0,
    opacity: 0.7,
    maxWidth: 160,
    lineHeight: 1.5,
    textAlign: "center",
}


// // SNTNL Components :: ScrollControl for Framer
// // PRODUCTION COMPONENT
// // V 1.5.5
// import{jsx as _jsx}from"react/jsx-runtime";import*as React from"react";import{addPropertyControls,ControlType}from"framer";import L from"@studio-freight/lenis";/**
//  *
//  * @framerIntrinsicWidth 1
//  * @framerIntrinsicHeight 1
//  *
//  * @framerDisableUnlink
//  *
//  * @framerSupportedLayoutWidth any-prefer-fixed
//  * @framerSupportedLayoutHeight any-prefer-fixed
//  */export function SNTNLScrollComponent(props){const{duration,wheelMultiplier,smoothTouch,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite,children}=props;const childRefs=React.useRef([]);React.useEffect(()=>{const lenis=new L({duration,smoothTouch,wheelMultiplier,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite});function raf(t){lenis.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);// window.scrollTo(0, 0)
// const style=document.createElement("style");let scrollbarStyles=props.showScrollbar?"":`
//     ::-webkit-scrollbar { width: 0px; height: 0px;}
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//     overflow: -moz-scrollbars-none;
// `;style.innerHTML=`
//     #__framer-badge-container { display: none !important; }
//     ${scrollbarStyles}
//     overscrollBehavior: "contain";
// `;document.head.appendChild(style);},[duration,smoothTouch,wheelMultiplier,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite]);const childrenWithRef=React.Children.map(children,(child,index)=>{return /*#__PURE__*/React.cloneElement(child,{ref:el=>childRefs.current[index]=el});});return /*#__PURE__*/_jsx("div",{children:childrenWithRef});}SNTNLScrollComponent.defaultProps={duration:2.5,smoothTouch:false,wheelMultiplier:1.15,touchMultiplier:1.15,autoResize:true,smoothWheel:true,infinite:false,orientation:"vertical",gestureOrientation:"vertical"};addPropertyControls(SNTNLScrollComponent,{duration:{title:"Duration",type:ControlType.Number,defaultValue:2.5,step:.01},smoothWheel:{title:"Smooth Wheel",type:ControlType.Boolean,defaultValue:true},wheelMultiplier:{title:"Wheel Multiplier",type:ControlType.Number,defaultValue:1.25,min:.1,max:10,step:.01},orientation:{title:"Direction",type:ControlType.Enum,options:["vertical","horizontal","both"],defaultValue:"vertical"},smoothTouch:{title:"Smooth Touch",type:ControlType.Boolean,defaultValue:false},touchMultiplier:{title:"Touch Multiplier",type:ControlType.Number,defaultValue:.15,min:.1,max:1,step:.05},gestureOrientation:{title:"Gesture Direction",type:ControlType.Enum,options:["vertical","horizontal","both"],defaultValue:"vertical"},showScrollbar:{title:"Scrollbar",type:ControlType.Boolean,defaultValue:false,enabledTitle:"Show",disabledTitle:"Hide"},infinite:{title:"Infinite",type:ControlType.Boolean,defaultValue:false,description:`
// *Usage:*
// Insert as the first element on the canvas.

// *NOTICE*
// SNTNL SmoothScroll Component is not to be distributed or bundled for sale with Framer Templates.

// *Get a License:*
//  [SmoothScroll](https://dub.sh/SmoothScroll)
//     `}});
// export const __FramerMetadata__ = {"exports":{"SNTNLScrollComponent":{"type":"reactComponent","name":"SNTNLScrollComponent","slots":[],"annotations":{"framerIntrinsicWidth":"1","framerDisableUnlink":"*","framerSupportedLayoutWidth":"any-prefer-fixed","framerSupportedLayoutHeight":"any-prefer-fixed","framerIntrinsicHeight":"1","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
// //# sourceMappingURL=./Smooth_Infinite_Scroll_Component_1_5_5.map
