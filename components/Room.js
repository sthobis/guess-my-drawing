import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useImmer } from "use-immer";
import uuidv4 from "uuid/v4";
import Canvas from "./Canvas";

const EVENT = {
  CONNECT: "connect",
  CONNECT_ERROR: "connect_error",
  DISCONNECT: "disconnect",
  DISCONNECTING: "disconnecting",
  GENERAL_ERROR: "general_error",
  CLIENT_JOIN_ROOM: "client_join_room",
  CLIENT_LEAVE_ROOM: "client_leave_room",
  CLIENT_SUBMIT_ANSWER: "client_submit_answer",
  CLIENT_UPDATE_DRAWING: "client_update_drawing",
  SERVER_JOIN_ERROR: "server_join_error",
  SERVER_UPDATE_PLAYER_LIST: "server_update_player_list",
  SERVER_NEW_ANSWER: "server_new_answer",
  ROUND_START: "round_start",
  ROUND_ENDED_WITH_WINNER: "round_ended_with_winner",
  ROUND_ENDED_WITHOUT_WINNER: "round_ended_without_winner"
};

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3004"
    : "https://gmd.duajarimanis.com";
const socket = io(url);
const id = uuidv4();

const Room = ({ username }) => {
  const canvasRef = useRef();

  const player = {
    id,
    username
  };

  useEffect(() => {
    joinRoom();
    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    socket.on(EVENT.CONNECT_ERROR, handleError);
    socket.on(EVENT.SERVER_JOIN_ERROR, handleError);
    socket.on(EVENT.SERVER_UPDATE_PLAYER_LIST, updatePlayerList);
    socket.on(EVENT.SERVER_NEW_ANSWER, popNewAnswer);
    socket.on(EVENT.CLIENT_UPDATE_DRAWING, updateDrawing);
    socket.on(EVENT.ROUND_START, startRound);
    socket.on(EVENT.ROUND_ENDED_WITH_WINNER, finishRound);
    socket.on(EVENT.ROUND_ENDED_WITHOUT_WINNER, finishRound);

    return () => {
      socket.off(EVENT.CONNECT_ERROR, handleError);
      socket.off(EVENT.SERVER_JOIN_ERROR, handleError);
      socket.off(EVENT.SERVER_UPDATE_PLAYER_LIST, updatePlayerList);
      socket.off(EVENT.SERVER_NEW_ANSWER, popNewAnswer);
      socket.off(EVENT.CLIENT_UPDATE_DRAWING, updateDrawing);
      socket.off(EVENT.ROUND_START, startRound);
      socket.off(EVENT.ROUND_ENDED_WITH_WINNER, finishRound);
      socket.off(EVENT.ROUND_ENDED_WITHOUT_WINNER, finishRound);
    };
  });

  const joinRoom = () => {
    socket.emit(EVENT.CLIENT_JOIN_ROOM, player, updatePlayerList);
  };

  const [drawer, setDrawer] = useState({});
  const startRound = drawer => {
    setDrawer(drawer);
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const finishRound = winner => {};

  const [playerList, setPlayerList] = useState(Array(8).fill(null));
  const updatePlayerList = players => {
    setPlayerList(players);
  };

  const [answerList, setAnswerList] = useImmer(Array(8).fill(null));
  const popNewAnswer = payload => {
    const playerIndex = playerList.findIndex(
      p => p && p.id === payload.player.id
    );
    setAnswerList(draft => {
      draft[playerIndex] = payload.message;
    });
    setTimeout(() => {
      setAnswerList(draft => {
        draft[playerIndex] = null;
      });
    }, 3000);
  };

  const handleError = err => {
    console.log(err);
    alert(err);
    socket.close();
  };

  const [answer, setAnswer] = useState("");
  const submitAnswer = e => {
    e.preventDefault();
    if (player.id === drawer.id) return;

    const payload = {
      player,
      message: answer
    };
    socket.emit(EVENT.CLIENT_SUBMIT_ANSWER, payload);
    popNewAnswer(payload);
    setAnswer("");
  };

  const broadcastDrawing = payload => {
    socket.emit(EVENT.CLIENT_UPDATE_DRAWING, payload);
  };

  const updateDrawing = ({ mouse, prevMouse, size }) => {
    const ctx = canvasRef.current.getContext("2d");
    const currentSize = canvasRef.current.getBoundingClientRect().width;
    ctx.fillStyle = "#000";
    if (prevMouse.current) {
      ctx.beginPath();
      ctx.moveTo(
        (prevMouse.current.x * currentSize) / size,
        (prevMouse.current.y * currentSize) / size
      );
      ctx.lineTo(
        (mouse.x * currentSize) / size,
        (mouse.y * currentSize) / size
      );
      ctx.stroke();
      ctx.closePath();
    } else {
      ctx.fillRect(
        (mouse.x * currentSize) / size,
        (mouse.y * currentSize) / size,
        1,
        1
      );
    }
    prevMouse.current = mouse;
  };

  return (
    <div className="room nes-container is-rounded">
      {playerList.map((p, i) => {
        if (!p) {
          return (
            <div key={i} className="player">
              <span className="player-name nes-text is-disabled">{`insert coin`}</span>
            </div>
          );
        } else {
          return (
            <div key={i} className="player">
              {drawer.id === p.id && <i className="snes-jp-logo" />}
              <span className="player-name">{p.username}</span>
              {answerList[i] && (
                <div className="message">
                  <div
                    className={`nes-balloon ${
                      i % 2 === 0 ? "from-left" : "from-right"
                    }`}
                  >
                    <p>{answerList[i]}</p>
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
      <div className="canvas-container">
        <Canvas
          canvasRef={canvasRef}
          broadcastDrawing={broadcastDrawing}
          disabled={player.id !== drawer.id}
        />
      </div>
      <form className="input-form" onSubmit={submitAnswer}>
        <div className="input-box nes-field">
          <input
            type="text"
            id="username"
            className="input nes-input"
            value={answer}
            onChange={e => setAnswer(e.target.value.substr(0, 20))}
            placeholder="type answer.. (20 chars max)"
            disabled={player.id === drawer.id}
            autoComplete="off"
          />
        </div>
        <input type="submit" hidden />
      </form>
      <style jsx>{`
        .room {
          display: grid;
          grid-template-columns: 200px auto 200px;
          grid-template-rows: 1fr 1fr 1fr 1fr 70px;
          grid-template-areas: "p1 canvas p2" "p3 canvas p4" "p5 canvas p6" "p7 canvas p8" "input input input";
          width: calc(100vw - 60px);
          height: calc(100vh - 60px);
          margin: 30px;
          padding: 20px;
        }

        .player {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .player-name {
          margin: 14px 10px 0 10px;
        }

        .message {
          position: absolute;
          left: 100%;
          top: 0;
        }

        .player:nth-child(2n) .message {
          left: auto;
          right: 100%;
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
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .input-form {
          grid-area: input;
          display: flex;
          justify-content: stretch;
          align-items: flex-end;
        }

        .input-box {
          display: flex;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

Room.propTypes = {
  username: PropTypes.string.isRequired
};

export default Room;
