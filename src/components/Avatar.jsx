import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import AnimationContext from './Context/AnimationContext';
import { useContext } from 'react';

const corresponding = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  C: 'viseme_I',
  D: 'viseme_AA',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_PP',
};



export function Avatar({ glbFile, audioScript, playAudio, avatar, ...props }) {
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  
  let smoothMorphTarget = true,
      morphTargetSmoothing = 0.2;

  const jsonFile = useLoader(THREE.FileLoader, `/audios/${audioScript}.json`);
  const lipsync = JSON.parse(jsonFile);

  const context_ = useContext(AnimationContext);


  const { nodes, materials } = useGLTF(glbFile);

  useEffect(()=>{
    console.log(nodes);
  })


  const group = useRef();


  // useEffect(()=>{
  //   console.log("Gender", avatar);
  //   animations = useGLTF(avatar === "female" ? "/models/female_complete.glb" :  "/models/male_complete.glb");
  //   actions, mixer = useAnimations(animations.animations, group);
  // }, [avatar]);



  const animations = useMemo(()=>{
    const female = "/models/female_complete.glb";
    const female2 = "/models/female_complete2.glb";
    const male = "/models/male_complete.glb";

    if(avatar === "female")
    {
      return useGLTF(female);
    }
    else if(avatar === "female2")
    {
      return useGLTF(female2);
    }
    else if(avatar === "male")
    {
      return useGLTF(male);
    }
    else{
      console.error("No Model with this name found");
    }
  }, [avatar]); 


  const {actions, mixer} = useAnimations(animations.animations, group);




  useEffect(() => {
    actions[context_.state_].reset().fadeIn(0.5).play();

    return ()=>{
      actions[context_.state_].fadeOut(0.5);
    }

  }, [context_.state_, actions]);





  useEffect(() => {
    console.log("playing mp3");
    const audio = new Audio(`/audios/${audioScript}.mp3`);
    audio.muted = true; // Start muted
    audioRef.current = audio;

    const onCanPlayThrough = () => {
      setAudioReady(true);
    };

    audio.addEventListener('canplaythrough', onCanPlayThrough);
    audio.load();

    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const sourceNode = audioContext.createMediaElementSource(audio);
    sourceNodeRef.current = sourceNode;
    const gainNode = audioContext.createGain();
    gainNodeRef.current = gainNode;
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlayThrough);
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioScript]);

  useEffect(() => {
    const playAudioIfReady = async () => {
      if (playAudio && audioReady && audioRef.current && audioContextRef.current) {
        try {
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          await audioRef.current.play();
          audioRef.current.muted = false; // Unmute after successful play
          gainNodeRef.current.gain.setValueAtTime(1, audioContextRef.current.currentTime); // Unmute using Web Audio API
          console.log("Audio is playing");
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      } else if (!playAudio && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to the beginning
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime); // Mute using Web Audio API
      }
    };

    playAudioIfReady();
  }, [playAudio, audioReady, audioScript]);

  useFrame(() => {
    const currentAudioTime = audioRef.current ? audioRef.current.currentTime : 0;
    if (!audioRef.current || audioRef.current.paused || audioRef.current.ended) {
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]],
          0,
          morphTargetSmoothing
        );

        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]],
          0,
          morphTargetSmoothing
        );
      }
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]],
            1,
            morphTargetSmoothing
          );
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]],
            1,
            morphTargetSmoothing
          );
        }
        break;
      }
    }
  });

  return (
    <>
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} frustumCulled = {false} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} frustumCulled = {false} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} frustumCulled = {false} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}  frustumCulled = {false}/>
        <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} frustumCulled = {false} />
        <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} frustumCulled = {false} />
        <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} frustumCulled = {false} />
        <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} frustumCulled = {false} />
        <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} frustumCulled = {false} />
      </group>
    </>
  );
}

//useGLTF.preload(glbFile);