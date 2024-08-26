import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

export const Experience = ({
  orbitControl = false,
  bgImgPath,
  glbFile,
  audioScript,
  avatarRotation = [0, 0, 0],
  position,
  scale,
  useControl,
  playAudio,
  avatar,
}) => {
  const texture = useTexture(bgImgPath);
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      {orbitControl && <OrbitControls />}
      <Avatar
        position={position}
        scale={scale}
        rotation={avatarRotation}
        glbFile={glbFile}
        audioScript={audioScript}
        playAudio={playAudio}
        avatar = {avatar}
      />
      <Environment preset="warehouse" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
