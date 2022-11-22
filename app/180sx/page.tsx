"use client"

import sceneInit from "../../lib/model";
import { useEffect } from "react";
export default function CarModel() {
  useEffect(() => {
    const renderedModel = new sceneInit("model_canvas", "180sx", 8)
    renderedModel.animate();
  },[])

  return (
    <div>
      <canvas id="model_canvas"></canvas>
    </div>
  );
}
