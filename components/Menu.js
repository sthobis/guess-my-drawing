import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="menu nes-container is-rounded">
      <h1 className="title">Guess My Drawing!</h1>
      <div className="nes-field">
        <label htmlFor="username">Nick name</label>
        <input
          type="text"
          id="username"
          className="nes-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <Link href={`/room?u=${username}`} prefetch>
        <a className="join-button nes-btn is-primary">Join Room</a>
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

        .join-button {
          margin: 30px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default Menu;
