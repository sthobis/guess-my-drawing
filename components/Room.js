import { useRef } from "react";

const Room = () => {
  const canvasRef = useRef();
  return (
    <div className="room nes-container is-rounded">
      <div className="player">P1</div>
      <div className="player">P2</div>
      <div className="player">P3</div>
      <div className="player">P4</div>
      <div className="player">P5</div>
      <div className="player">P6</div>
      <div className="player">P7</div>
      <div className="player">P8</div>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
      <style jsx>{`
        .room {
          display: grid;
          grid-template-columns: 300px auto 300px;
          grid-template-rows: 25% 25% 25% 25%;
          grid-template-areas: "p1 canvas p2" "p3 canvas p4" "p5 canvas p6" "p7 canvas p8";
          width: calc(100vw - 100px);
          height: calc(100vh - 100px);
          margin: 50px;
        }

        .player:nth-child(1) {
          grid-area: p1;
        }

        .player:nth-child(2) {
          grid-area: p2;
        }

        .player:nth-child(3) {
          grid-area: p3;
        }

        .player:nth-child(4) {
          grid-area: p4;
        }

        .player:nth-child(5) {
          grid-area: p5;
        }

        .player:nth-child(6) {
          grid-area: p6;
        }

        .player:nth-child(7) {
          grid-area: p7;
        }

        .player:nth-child(8) {
          grid-area: p8;
        }

        .canvas-container {
          grid-area: canvas;
        }
      `}</style>
    </div>
  );
};

export default Room;
