import React from "react";
import "./GradientButton.css";

const GradientButton = (props) => {
    return (
        <div className="gradient_button" style={props.buttonStyle} onClick={props.onClick}>
            <div className="gradient_button_content" style={props.textStyle}>
                {props.content}
            </div>
        </div>
    );
};

export default GradientButton;
