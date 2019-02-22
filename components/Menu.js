import Link from "next/link";

const Menu = () => {
  return (
    <div className="menu nes-container is-rounded">
      <h1 className="title">Guess My Drawing!</h1>
      <Link href="/room" prefetch>
        <button type="button" className=" option nes-btn is-primary">
          Create Room
        </button>
      </Link>
      <Link href="/lobby" prefetch>
        <a className="option nes-btn is-primary">Join Room</a>
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

        .option {
          margin: 0 0 20px 0;
        }
      `}</style>
    </div>
  );
};

export default Menu;
