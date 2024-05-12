import React, { useRef } from "react";
import GradientButton from "../components/GradientButton";
import Webcam from "react-webcam";
import PercentageBar from "../components/PercentageBar";
import "./AnimalTestPage.css";

const AnimalTestPage = (props) => {
    const webcamRef = useRef(null);
    return (
        <div className="main_container">
            <div className="screen_container">
                <div className="center_container">
                    <div className="header_container">
                        <GradientButton
                            content="Ai Animal Test"
                            buttonStyle={{
                                fontSize: "2rem",
                                fontWeight: "800",
                            }}
                        />
                    </div>
                    <div className="option_container">
                        <GradientButton
                            content="시작"
                            buttonStyle={{
                                fontSize: "1rem",
                                fontWeight: "800",
                            }}
                        />
                    </div>
                    <div className="webcam_container">
                        {/* <div></div> */}
                        <Webcam
                            ref={webcamRef}
                            mirrored={true}
                            height={"90%"}
                            style={{ borderRadius: "100%" }}
                            muted={false}
                        />
                    </div>
                    <div className="percentage_bar_container">
                        <PercentageBar title="강아지상" bgColor="#FF99C8" bgBaseColor="#f0bcd4" percentage={80} />
                        <PercentageBar title="고양이상" bgColor="#FCF6BD" bgBaseColor="#faf7dd" percentage={10} />
                        <PercentageBar title="공룡상" bgColor="#aef4c9" bgBaseColor="#ddefe4" percentage={20} />
                        <PercentageBar title="곰상" bgColor="#A9DEF9" bgBaseColor="#ceeaf8" percentage={30} />
                        <PercentageBar title="여우상" bgColor="#E4C1F9" bgBaseColor="#ebd8f7" percentage={40} />
                        <PercentageBar title="토끼상" bgColor="#fca951" bgBaseColor="#ffe0c0" percentage={7} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalTestPage;
