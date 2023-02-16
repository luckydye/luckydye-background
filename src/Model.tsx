import {
  AdaptiveDpr,
  Environment,
  PerspectiveCamera as Camera,
  Plane,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef } from "react";
import { PerspectiveCamera } from "three";

export default function Model() {
  const group = useRef<any>();
  const light = useRef<any>();

  const { scene, animations, cameras } = useGLTF("/spirited_away_train.glb");
  const { actions } = useAnimations(animations, group);

  const three = useThree((state) => state);

  scene.traverseVisible((ob) => {
    ob.castShadow = true;
    ob.receiveShadow = true;
  });

  const camera = cameras[0] as PerspectiveCamera;

  useEffect(() => {
    for (let key in actions) {
      actions[key]?.play();
    }
  }, []);

  return (
    <group ref={group} dispose={null}>
      <AdaptiveDpr pixelated />

      {/* <ambientLight intensity={1} /> */}
      <directionalLight castShadow position={[16, 6, -10]} intensity={8} />

      <Environment background preset="sunset"></Environment>

      <EffectComposer disableNormalPass resolutionScale={0.5} multisampling={0.5}>
        <DepthOfField
          target={scene.children.find((ob) => ob.name === "Sphere")?.position}
          focalLength={0.002}
          bokehScale={10}
          height={360}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        <Bloom luminanceThreshold={0.4} mipmapBlur />
        <Noise opacity={0.5} blendFunction={BlendFunction.SOFT_LIGHT} />
      </EffectComposer>

      <pointLight
        receiveShadow
        castShadow
        ref={light}
        position={[-0.279, 0.8313, -1]}
        intensity={1}
        color={[0.8, 0.4, 1]}
        shadowBias={0.01}
      />

      <Plane
        visible={false}
        scale={6}
        position={[-0.279, 0.8313, -4]}
        rotation={camera.rotation}
        onPointerMove={(state) => {
          light.current?.position.set(state.point.x, state.point.y, state.point.z);
        }}
      ></Plane>

      <Camera makeDefault {...{ ...camera, children: [] }} />

      <primitive object={scene} />
    </group>
  );
}
