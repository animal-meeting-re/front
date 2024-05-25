import React, { useState, useEffect } from "react";
import "./RotatingImage.css";

const RotatingImage = (props) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsFlipped((prevState) => !prevState);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="scene" style={{ width: props.width, height: props.height }}>
            <div className={`card ${isFlipped ? "is-flipped" : ""}`}>
                <div className="card__face card__face--front">
                    <img src={props.front} alt="Front" />
                </div>
                <div className="card__face card__face--back">
                    <img src={props.back} alt="Back" />
                </div>
            </div>
        </div>
    );
};

export default RotatingImage;
