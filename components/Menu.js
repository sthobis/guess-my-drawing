import Link from "next/link";
import Router from "next/router";
import { useState } from "react";

const Menu = () => {
  const [username, setUsername] = useState("");

  const joinRoom = e => {
    e.preventDefault();
    Router.push(`/room?u=${username}`);
  };
  return (
    <div className="menu nes-container is-rounded">
      <h1 className="title">Guess My Drawing!</h1>
      <form onSubmit={joinRoom}>
        <div className="nes-field">
          <label className="label" htmlFor="username">
            Insert nickname (12 chars max)
          </label>
          <input
            type="text"
            id="username"
            className={`username-input nes-input`}
            value={username}
            onChange={e => setUsername(e.target.value.substr(0, 12))}
          />
          <input type="submit" hidden />
        </div>
      </form>
      <Link href={`/room?u=${username}`} prefetch>
        <button
          className={`join-button nes-btn ${
            username ? "is-primary" : "is-disabled"
          }`}
          disabled={!username}
        >
          Join Room
        </button>
      </Link>
      <style jsx>{`
        .menu {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 50px;
          padding: 50px;
        }

        .title {
          margin: 0 0 50px 0;
        }

        .nes-field {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .label {
          text-align: center;
          margin: 0 0 20px 0;
        }

        .username-input {
          width: 230px;
        }

        .join-button {
          margin: 30px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default Menu;
