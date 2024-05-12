import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const PercentageBar = (props) => {
    return (
        <div style={{ display: "flex", width: "100%" }}>
            <span style={{ width: "80px", textAlign: "right", paddingRight: "10px" }}>{props.title}</span>
            <div style={{ width: "100%" }}>
                <ProgressBar completed={props.percentage} bgColor={props.bgColor} baseBgColor={props.bgBaseColor} />
            </div>
        </div>
    );
};

export default PercentageBar;
