// SNTNL Components :: ScrollControl for Framer
// PRODUCTION COMPONENT
// V 1.5.5
import{jsx as _jsx}from"react/jsx-runtime";import*as React from"react";import{addPropertyControls,ControlType}from"framer";import L from"@studio-freight/lenis";/**
 *
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */export function SNTNLScrollComponent(props){const{duration,wheelMultiplier,smoothTouch,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite,children}=props;const childRefs=React.useRef([]);React.useEffect(()=>{const lenis=new L({duration,smoothTouch,wheelMultiplier,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite});function raf(t){lenis.raf(t);requestAnimationFrame(raf);}requestAnimationFrame(raf);// window.scrollTo(0, 0)
const style=document.createElement("style");let scrollbarStyles=props.showScrollbar?"":`
    ::-webkit-scrollbar { width: 0px; height: 0px;}
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
`;style.innerHTML=`
    #__framer-badge-container { display: none !important; }
    ${scrollbarStyles}
    overscrollBehavior: "contain";
`;document.head.appendChild(style);},[duration,smoothTouch,wheelMultiplier,touchMultiplier,autoResize,smoothWheel,orientation,gestureOrientation,infinite]);const childrenWithRef=React.Children.map(children,(child,index)=>{return /*#__PURE__*/React.cloneElement(child,{ref:el=>childRefs.current[index]=el});});return /*#__PURE__*/_jsx("div",{children:childrenWithRef});}SNTNLScrollComponent.defaultProps={duration:2.5,smoothTouch:false,wheelMultiplier:1.15,touchMultiplier:1.15,autoResize:true,smoothWheel:true,infinite:false,orientation:"vertical",gestureOrientation:"vertical"};addPropertyControls(SNTNLScrollComponent,{duration:{title:"Duration",type:ControlType.Number,defaultValue:2.5,step:.01},smoothWheel:{title:"Smooth Wheel",type:ControlType.Boolean,defaultValue:true},wheelMultiplier:{title:"Wheel Multiplier",type:ControlType.Number,defaultValue:1.25,min:.1,max:10,step:.01},orientation:{title:"Direction",type:ControlType.Enum,options:["vertical","horizontal","both"],defaultValue:"vertical"},smoothTouch:{title:"Smooth Touch",type:ControlType.Boolean,defaultValue:false},touchMultiplier:{title:"Touch Multiplier",type:ControlType.Number,defaultValue:.15,min:.1,max:1,step:.05},gestureOrientation:{title:"Gesture Direction",type:ControlType.Enum,options:["vertical","horizontal","both"],defaultValue:"vertical"},showScrollbar:{title:"Scrollbar",type:ControlType.Boolean,defaultValue:false,enabledTitle:"Show",disabledTitle:"Hide"},infinite:{title:"Infinite",type:ControlType.Boolean,defaultValue:false,description:`
*Usage:*
Insert as the first element on the canvas.

*NOTICE*
SNTNL SmoothScroll Component is not to be distributed or bundled for sale with Framer Templates.

*Get a License:*
 [SmoothScroll](https://dub.sh/SmoothScroll)
    `}});
export const __FramerMetadata__ = {"exports":{"SNTNLScrollComponent":{"type":"reactComponent","name":"SNTNLScrollComponent","slots":[],"annotations":{"framerIntrinsicWidth":"1","framerDisableUnlink":"*","framerSupportedLayoutWidth":"any-prefer-fixed","framerSupportedLayoutHeight":"any-prefer-fixed","framerIntrinsicHeight":"1","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./Smooth_Infinite_Scroll_Component_1_5_5.map