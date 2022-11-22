"use client"

import sceneInit from "../../lib/model";
import { useEffect } from "react";
export default function CarModel() {
  useEffect(() => {
    const renderedModel = new sceneInit("model_canvas", "ae-86", 25)
    renderedModel.animate();
  },[])

  return (
    <div>
      <canvas id="model_canvas"></canvas>
    </div>
  );
}
