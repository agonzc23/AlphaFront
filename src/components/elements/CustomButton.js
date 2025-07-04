import React from "react";
import PropTypes from "prop-types";
import "../../styles/CustomButton.css";

export default function CustomButton({
  children,
  variant = "primary",
  size = "md",
  style = {},
  className = "",
  ...props
}) {
  const baseClass = `btn btn-${variant}${size === "sm" ? " btn-sm" : size === "lg" ? " btn-lg" : ""}`;
  return (
    <button
      className={`${baseClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  style: PropTypes.object,
  className: PropTypes.string
};
