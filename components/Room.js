import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
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
  SERVER_JOIN_ERROR: "server_join_error",
  SERVER_UPDATE_PLAYER_LIST: "server_update_player_list",
  SERVER_NEW_ANSWER: "server_new_answer"
};

const Room = ({ username }) => {
  const socketRef = useRef();

  const [player, setPlayer] = useState({
    id: uuidv4(),
    username
  });

  useEffect(() => {
    const url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3004"
        : "https://gmd.duajarimanis.com";
    const socket = io(url);
    socket.on(EVENT.CONNECT, joinRoom);
    socket.on(EVENT.CONNECT_ERROR, handleError);
    socket.on(EVENT.SERVER_JOIN_ERROR, handleError);
    socket.on(EVENT.SERVER_UPDATE_PLAYER_LIST, updatePlayerList);
    socket.on(EVENT.SERVER_NEW_ANSWER, popNewAnswer);
    socketRef.current = socket;

    return () => socket.close();
  }, []);

  const joinRoom = () => {
    socketRef.current.emit(EVENT.CLIENT_JOIN_ROOM, player, updatePlayerList);
  };

  const [playerList, setPlayerList] = useState(Array(8).fill(null));
  const updatePlayerList = players => {
    setPlayerList(players);
  };

  const handleError = err => {
    console.log(err);
    alert(err);
    socketRef.current.close();
  };

  const popNewAnswer = payload => {
    console.log(payload);
  };

  const [answer, setAnswer] = useState("");
  const submitAnswer = e => {
    e.preventDefault();
    socketRef.current.emit(EVENT.CLIENT_SUBMIT_ANSWER, {
      player,
      message: answer
    });
    setAnswer("");
  };

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
        <Canvas />
      </div>
      <form onSubmit={submitAnswer}>
        <div className="input-box nes-field">
          <input
            type="text"
            id="username"
            className="nes-input"
            value={answer}
            onChange={e => setAnswer(e.target.value.trim())}
          />
        </div>
        <input type="submit" hidden />
      </form>
      <style jsx>{`
        .room {
          display: grid;
          grid-template-columns: 300px auto 300px;
          grid-template-rows: 1fr 1fr 1fr 1fr 100px;
          grid-template-areas: "p1 canvas p2" "p3 canvas p4" "p5 canvas p6" "p7 canvas p8" "input input input";
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
          position: relative;
        }

        .input-box {
          grid-area: input;
        }
      `}</style>
    </div>
  );
};

Room.propTypes = {
  username: PropTypes.string.isRequired
};

export default Room;
