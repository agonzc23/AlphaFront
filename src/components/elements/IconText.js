import React from "react";
import PropTypes from "prop-types";

export default function IconText({ icon, text, color = "inherit", size = "1rem", className = "", ...props }) {
  return (
    <span className={`d-flex align-items-center ${className}`.trim()} {...props}>
      <i className={icon} style={{ color, fontSize: size, marginRight: 8 }}></i>
      <span style={{ color }}>{text}</span>
    </span>
  );
}

IconText.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
};
