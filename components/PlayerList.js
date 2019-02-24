import PropTypes from "prop-types";

const PlayerList = ({ playerList, answerList, drawer }) => (
  <>
    {playerList.map((player, i) => {
      if (!player) {
        return (
          <div key={i} className="player">
            <span className="player-name nes-text is-disabled">{`insert coin`}</span>
          </div>
        );
      } else {
        return (
          <div key={i} className="player">
            {drawer.id === player.id && <i className="snes-jp-logo" />}
            <span className="player-name">{player.username}</span>
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
    <style jsx>{`
      .player {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;
        z-index: 10;
      }

      .player-name {
        margin: 14px 10px 0 10px;
      }

      .message {
        position: absolute;
        left: 100%;
        top: 0;
        pointer-events: none;
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
    `}</style>
  </>
);

PlayerList.propTypes = {
  playerList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  drawer: PropTypes.object.isRequired
};

export default PlayerList;
