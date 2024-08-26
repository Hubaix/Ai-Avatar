import { Canvas } from "@react-three/fiber";
import { Experience } from "./Experience";
import { useEffect, useState } from "react";

function AvatarComponent(props) {

  const male = "/models/male.glb";
  const female = "/models/female.glb";
  const female2 = "/models/AsianWoman.glb"

  const [path, setPath] = useState("");

  useEffect(()=>{
    if(props.avatar === "male")
    {
      setPath(male);
    }
    else if(props.avatar === "female")
    {
      setPath(female);
    }
    else if(props.avatar === "female2")
    {
      setPath(female2);
    }
  })


  return (
    <>
    <div style = {props.canvasCSS} id="canvas-container">
        <Canvas shadows camera={props.cameraPosition}>
            <Experience
            bgImgPath = {props.bgImage} 
            position={props.modelPosition}
            scale={props.modelScale}
            orbitControl={props.orbitControl} 
            glbFile = {path}
            audioScript={props.audioScript}
            playAudio={props.playAudio}
            avatarRotation={props.modelRotation}
            avatar = {props.avatar}
            />
        </Canvas>
    </div>

    </>
  );
}

export default AvatarComponent;
