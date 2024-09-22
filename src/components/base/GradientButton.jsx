import React from "react";
import "./GradientButton.css";

const GradientButton = React.forwardRef((props, ref) => {
  return (
    <div
      className="gradient_button"
      style={props.buttonStyle}
      onClick={props.onClick}
      ref={ref}
    >
      <div className="gradient_button_content" style={props.textStyle}>
        {props.content}
      </div>
    </div>
  );
});

export default GradientButton;
