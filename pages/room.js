import PropTypes from "prop-types";
import Room from "../components/Room";

const RoomPage = ({ username }) => <Room username={username} />;

RoomPage.getInitialProps = ({ req, res, query }) => {
  const { u } = query;
  if (!u) {
    return { username: "player" };
  } else {
    return { username: u };
  }
};

RoomPage.propTypes = {
  username: PropTypes.string.isRequired
};

export default RoomPage;
