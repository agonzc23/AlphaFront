import React from "react";
import PropTypes from "prop-types";
import "../../styles/CustomCard.css";

export default function CustomCard({ children, width = "100%", className = "", ...props }) {
  return (
    <div className={`card custom-card ${className}`.trim()} style={{ width }} {...props}>
      {children}
    </div>
  );
}

CustomCard.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  className: PropTypes.string
};
