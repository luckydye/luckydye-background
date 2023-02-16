import "./index.css";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import Model from "./Model.js";

// @ts-ignore
createRoot(document.getElementById("root")).render(
  <Canvas shadows performance={{ min: 0.5, max: 1 }}>
    <Suspense fallback={null}>
      <Model />
    </Suspense>
  </Canvas>
);
