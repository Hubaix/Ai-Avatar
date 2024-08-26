import React from "react";
import AvatarComponent from "./components/AvatarComponent";
import {useState, useMemo} from "react";
import { useContext } from "react";
import AnimationContext from "./components/Context/AnimationContext";




function Test()
{
        const [avatarGender, setAvatarGender] = useState("female2");
        const [script, setScript] = useState("welcome");

        const context_ = useContext(AnimationContext);

        const triggerAnimation = (animation) => {
        context_.change_animation(animation);
        };

        const animation_sequence = ()=>{
          triggerAnimation("idle");
          setTimeout(()=>{
            triggerAnimation("Talking");
            changeScript("pricing");
          },4500);
        };


        const changeScript = (script_)=>{
        setScript(script_);
        }


        const avatarComponent = useMemo(() => {
            return (
                <AvatarComponent
                  modelRotation={[Math.PI * 0.0, 0.4, 0.0]} //z,x,y
                  avatar= {avatarGender}
                  orbitControl={false}
                  modelScale={2}
                  modelPosition={[-0.5, -3, 2]}
                  cameraPosition={{ position: [0, 0, 3.5] }}
                  bgImage="textures/bg1.jpeg"
                  canvasCSS={{ width: "100vw", height: "100vh" }}
                  audioScript = {script}
                  playAudio = {true}
                />
            );
            
          }, [avatarGender, script]);

    return(
        <>
        <button onClick={()=>{triggerAnimation("idle");}}>Idle</button>
        <button onClick={()=>{triggerAnimation("Greeting");}}>Greeting</button>
        <button onClick={()=>{triggerAnimation("Talking");}}>Talking</button>
        <button onClick={()=>{triggerAnimation("TalkingGesture");}}>Talking 2</button>
        <button onClick={()=>{triggerAnimation("Walking");}}>Walking</button>
        <button onClick={()=>{triggerAnimation("Nod");}}>Nod</button>
        <button onClick={()=>{animation_sequence();}}>Sequence</button>
        <button onClick={()=>{changeScript(script === "pricing" ? "welcome" : "pricing");}}>Speech</button>
        {avatarComponent}
        </>
    );
};

export default Test;