import { useState } from "react";
import AnimationContext from "./AnimationContext";

function AnimationState(props)
{
    const running_animation = "Talking";

    const [state_, setState] = useState(running_animation);

    const change_animation = (animation)=>{
        setState(animation);
    }

    return(

        <AnimationContext.Provider value = {{state_, change_animation}}>
            {props.children}
        </AnimationContext.Provider>

    )
}

export default AnimationState;