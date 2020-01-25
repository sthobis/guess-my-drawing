import Router from "next/router";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useImmer } from "use-immer";
import uuidv4 from "uuid/v4";
import Canvas from "./Canvas";
import PlayerList from "./PlayerList";

const url =
  process.env.NODE_ENV === "development"
    ? "https://wdtju.sse.codesandbox.io/"
    : "https://gmd-api.sthobis.com";
const socket = io(url, {
  autoConnect: false
});
const id = uuidv4();

const EVENT = {
  CONNECT_ERROR: "connect_error",
  JOIN_ROOM: "join_room",
  JOIN_ROOM_ERROR: "join_room_error",
  LEAVE_ROOM: "leave_room",
  SUBMIT_ANSWER: "submit_answer",
  UPDATE_DRAWING: "update_drawing",
  UPDATE_PLAYER_LIST: "update_player_list",
  UPDATE_ANSWER_LIST: "update_answer_list",
  ROUND_ANSWER: "round_answer",
  ROUND_START: "round_start",
  ROUND_ENDED_WITH_WINNER: "round_ended_with_winner",
  ROUND_ENDED_WITHOUT_WINNER: "round_ended_without_winner"
};

const Room = ({ username }) => {
  const canvasRef = useRef();

  const [player, setPlayer] = useState({ id, username });
  useEffect(() => {
    setPlayer({
      id,
      username
    });
  }, [username]);

  const [drawer, setDrawer] = useState({});
  const [loggerText, setLoggerText] = useState("waiting for 1 more players..");
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    socket.connect();
    joinRoom();
    return () => {
      socket.close();
    };
  }, []);

  const joinRoom = () => {
    socket.emit(EVENT.JOIN_ROOM, player, handleJoinRoom);
  };

  useEffect(() => {
    socket.on(EVENT.CONNECT_ERROR, handleError);
    socket.on(EVENT.JOIN_ROOM_ERROR, handleError);
    socket.on(EVENT.UPDATE_PLAYER_LIST, updatePlayerList);
    socket.on(EVENT.UPDATE_ANSWER_LIST, showDialog);
    socket.on(EVENT.UPDATE_DRAWING, updateDrawing);
    socket.on(EVENT.ROUND_ANSWER, prepareRound);
    socket.on(EVENT.ROUND_START, startRound);
    socket.on(EVENT.ROUND_ENDED_WITH_WINNER, finishRoundWithWinner);
    socket.on(EVENT.ROUND_ENDED_WITHOUT_WINNER, finishRoundWithoutWinner);

    return () => {
      socket.off(EVENT.CONNECT_ERROR, handleError);
      socket.off(EVENT.JOIN_ROOM_ERROR, handleError);
      socket.off(EVENT.UPDATE_PLAYER_LIST, updatePlayerList);
      socket.off(EVENT.UPDATE_ANSWER_LIST, showDialog);
      socket.off(EVENT.UPDATE_DRAWING, updateDrawing);
      socket.off(EVENT.ROUND_ANSWER, prepareRound);
      socket.off(EVENT.ROUND_START, startRound);
      socket.off(EVENT.ROUND_ENDED_WITH_WINNER, finishRoundWithWinner);
      socket.off(EVENT.ROUND_ENDED_WITHOUT_WINNER, finishRoundWithoutWinner);
    };
  });

  const handleError = err => {
    console.log(err);
    alert(err.message);
    Router.push("/");
  };

  const handleJoinRoom = players => {
    updatePlayerList(players);
    setIsConnecting(false);
  };

  const [playerList, setPlayerList] = useState(Array(8).fill(null));
  const updatePlayerList = players => {
    setPlayerList(players);
    if (players.filter(p => p !== null).length === 1) {
      setLoggerText("waiting for 1 more players..");
    } else {
      setLoggerText("waiting for next round..");
    }
  };

  const [answerList, setAnswerList] = useImmer(Array(8).fill(null));
  const showDialog = payload => {
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

  const broadcastDrawing = payload => {
    socket.emit(EVENT.UPDATE_DRAWING, payload);
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

  const [answerInput, setAnswerInput] = useState("");
  const submitAnswer = e => {
    e.preventDefault();
    if (player.id === drawer.id) return;

    const payload = {
      player,
      message: answerInput
    };
    socket.emit(EVENT.SUBMIT_ANSWER, payload);
    showDialog(payload);
    setAnswerInput("");
  };

  const [answer, setAnswer] = useState("");
  const prepareRound = payload => {
    setAnswer(payload);
    showDialog({
      player,
      message: `Let's draw "${payload}"!`
    });
  };

  const startRound = drawer => {
    setLoggerText("");
    setDrawer(drawer);
    if (player.id !== drawer.id) {
      showDialog({
        player: drawer,
        message: "I'm drawing!"
      });
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const finishRoundWithWinner = payload => {
    if (playerList.filter(p => p !== null).length >= 2) {
      setLoggerText(
        `${payload.player.username} guessed correctly! The answer is "${
          payload.message
        }"`
      );
    }
  };

  const finishRoundWithoutWinner = answer => {
    if (playerList.filter(p => p !== null).length >= 2) {
      setLoggerText(
        `Oops! Round ended without anyone be able to answer! The correct answer is "${answer}"`
      );
    }
  };

  return (
    <div className="room nes-container is-rounded">
      <PlayerList
        playerList={playerList}
        answerList={answerList}
        drawer={drawer}
      />
      <div className="canvas-container">
        <Canvas
          canvasRef={canvasRef}
          broadcastDrawing={broadcastDrawing}
          disabled={player.id !== drawer.id}
        />
        {loggerText && (
          <div className="logger nes-container is-rounded is-dark">
            <p>{loggerText}</p>
          </div>
        )}
      </div>
      <form className="input-form" onSubmit={submitAnswer}>
        <div className="input-box nes-field">
          <input
            type="text"
            id="username"
            className="input nes-input"
            value={answerInput}
            onChange={e => setAnswerInput(e.target.value.substr(0, 20))}
            placeholder={
              player.id === drawer.id
                ? `it's your turn to draw! draw "${answer}"`
                : "type answer.. (20 chars max)"
            }
            disabled={player.id === drawer.id}
            autoComplete="off"
          />
        </div>
        <input type="submit" hidden />
      </form>
      {isConnecting && (
        <div className="overlay">
          <div className="logger nes-container is-rounded is-dark">
            <p>Loading...</p>
          </div>
        </div>
      )}
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

        .canvas-container {
          grid-area: canvas;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .logger {
          position: absolute;
          left: 25%;
          right: 25%;
          text-align: center;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          z-index: 11;
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
