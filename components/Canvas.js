import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import useMousePosition from "../lib/useMousePosition";

const Canvas = ({ canvasRef, broadcastDrawing, disabled }) => {
  const mouse = useMousePosition(canvasRef);
  const prevMouse = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const startDrawing = e => {
    if (!disabled) {
      setIsDrawing(true);
    }
  };
  const stopDrawing = e => {
    setIsDrawing(false);
    prevMouse.current = null;
  };
  useEffect(() => {
    if (isDrawing) {
      drawCanvas();
      broadcastDrawing({
        mouse,
        prevMouse,
        size: canvasRef.current.getBoundingClientRect().width
      });
      prevMouse.current = mouse;
    }
  });

  const resizeCanvas = () => {
    const width = canvasRef.current.getBoundingClientRect().width;
    const height = canvasRef.current.getBoundingClientRect().height;
    const size = Math.min(width, height);
    canvasRef.current.width = size;
    canvasRef.current.height = size;
  };
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const drawCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#000";
    if (prevMouse.current) {
      ctx.beginPath();
      ctx.moveTo(prevMouse.current.x, prevMouse.current.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
      ctx.closePath();
    } else {
      ctx.fillRect(mouse.x, mouse.y, 1, 1);
    }
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
          max-width: 100%;
          max-height: 100%;
          border: 4px solid #000;
        }
      `}</style>
    </>
  );
};

Canvas.propTypes = {
  canvasRef: PropTypes.shape({
    current: PropTypes.any
  }),
  broadcastDrawing: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default Canvas;
