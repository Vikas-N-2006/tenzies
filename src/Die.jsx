import PropTypes from "prop-types";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  return (
    <button
      style={styles}
      onClick={props.handleClick}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, 
    ${props.isHeld ? "held" : "not held"}`}>
      {props.value}
    </button>
  );
}

Die.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isHeld: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};
