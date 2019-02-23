import { useEffect, useState } from "react";

const useMousePosition = ref => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMouseRelativeToRef = e => {
      setMouse({
        x: e.clientX - ref.current.getBoundingClientRect().left,
        y: e.clientY - ref.current.getBoundingClientRect().top
      });
    };

    ref.current.addEventListener("mousemove", updateMouseRelativeToRef);
    return () => {
      canvasRef.current.removeEventListener(
        "mousemove",
        updateMouseRelativeToRef
      );
    };
  }, []);

  return mouse;
};

export default useMousePosition;
