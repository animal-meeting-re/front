import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const PercentageBar = (props) => {
    return (
        <div style={{ display: "flex", width: "100%", alignItems: "center", height: "100%" }}>
            <img
                src={props.iconSrc}
                alt="icon"
                style={{
                    width: "44px",
                    height: "35px",
                    marginRight: "5px",
                }}
            />
            <span
                style={{
                    width: "80px",
                    textAlign: "left",
                    fontFamily: "Cafe24Ssurround",
                    alignItems: "center",
                    fontSize: "1.4rem",
                }}
            >
                {props.title}
            </span>

            <div style={{ width: "100%", height: "100%" }}>
                <ProgressBar 
                completed={props.percentage} 
                bgColor={props.bgColor} 
                baseBgColor={props.bgBaseColor}
                height="28px"  />
            </div>
        </div>
    );
};

export default PercentageBar;
