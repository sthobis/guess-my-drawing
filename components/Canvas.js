import { useEffect, useRef, useState } from "react";
import useMousePosition from "../lib/useMousePosition";

const Canvas = () => {
  const canvasRef = useRef();
  const mouse = useMousePosition(canvasRef);
  const prevMouse = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const startDrawing = e => {
    setIsDrawing(true);
  };
  const stopDrawing = e => {
    setIsDrawing(false);
    prevMouse.current = null;
  };
  useEffect(() => {
    if (isDrawing) {
      // console.log(mouse.x + ", " + mouse.y);
      drawCanvas();
    }
  });

  useEffect(() => {
    canvasRef.current.width = canvasRef.current.getBoundingClientRect().width;
    canvasRef.current.height = canvasRef.current.getBoundingClientRect().height;
  }, []);
  const drawCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#000";
    console.log(prevMouse.current);
    if (prevMouse.current) {
      ctx.beginPath();
      ctx.moveTo(prevMouse.current.x, prevMouse.current.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
      ctx.closePath();
    } else {
      ctx.fillRect(mouse.x, mouse.y, 1, 1);
    }
    prevMouse.current = mouse;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width="1000"
        height="1000"
        className="canvas"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
      />
      <style jsx>{`
        .canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid #000;
        }
      `}</style>
    </>
  );
};

export default Canvas;
