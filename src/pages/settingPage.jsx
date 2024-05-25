import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { useMediaQuery } from "react-responsive";
import NoticeBoard from "../components/NoticeBoard";
import Statistic from "../components/Statistic";
import "./settingPage.css";

export const Row = ({ children }) => {
    const isRow = useMediaQuery({
        query: "(min-width:501px)",
    });
    return <>{isRow && children}</>;
};

export const Column = ({ children }) => {
    const isColumn = useMediaQuery({
        query: "(min-width:500px)",
    });
    return <>{isColumn && children}</>;
};

const TypingText = ({ text, onFinish }) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                if (typeof onFinish === "function") onFinish();
            }
        }, 50);
        return () => clearInterval(interval);
    }, [text, onFinish]);

    return <span>{displayText}</span>;
};

const SettingPage = () => {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useRecoilState(GENDER);
    const setModelURL = useSetRecoilState(MODEL_URL);
    const setMetadataURL = useSetRecoilState(METADATA_URL);
    const setWeightsURL = useSetRecoilState(WEIGHTS_URL);
    const [isPreviousTypingFinished, setPreviousTypingFinished] = useState(false);
    const isRow = useMediaQuery({
        query: "(max-width:2000px)",
    });
    const isColumn = useMediaQuery({
        query: "(max-width:1000px)",
    });

    const handlePreviousTypingFinish = () => {
        setPreviousTypingFinished(true);
    };

    return (
        <div className="container">
            <div className="participant-wrapper">
                {!isRow && (
                    <Statistic
                        count="8"
                        most_woman_animal="토끼상"
                        most_man_animal="늑대상"
                        most_woman_path="rabbit-woman"
                        most_man_path="wolf"
                    />
                )}
            </div>
            <div className="content-wrapper">
                <div className="header">
                    <img className="mainLogo" src={`${process.env.PUBLIC_URL}/img/mainLogo.png`} />
                </div>

                <div className="main">
                    <div className="character-wrap">
                        <img className="character" src={`${process.env.PUBLIC_URL}/img/character.png`} />
                    </div>

                    <div className="speech-wrap">
                        <span className="character-name">너굴</span>
                        <img className="speechBubble" src={`${process.env.PUBLIC_URL}/img/speechBubble.png`} />
                        <div className="speech-text">
                            <p>
                                {isPreviousTypingFinished ? (
                                    "오늘 동물상 미팅을 하러 온 주민이구나!"
                                ) : (
                                    <TypingText
                                        text="오늘 동물상 미팅을 하러 온 주민이구나!"
                                        onFinish={handlePreviousTypingFinish}
                                    />
                                )}
                            </p>
                            {isPreviousTypingFinished && (
                                <p>
                                    <TypingText text="성별을 알려 달라구리!" />
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="select-wrap">
                        <img className="selectBubble" src={`${process.env.PUBLIC_URL}/img/selectBubble.png`} />
                        <div className="select-text">
                            <p
                                onClick={() => {
                                    setModelURL(process.env.PUBLIC_URL + "/models/girl/model.json");
                                    setMetadataURL(process.env.PUBLIC_URL + "/models/girl/metadata.json");
                                    setWeightsURL(process.env.PUBLIC_URL + "/models/girl/weights.bin");
                                    navigate("/test");
                                }}
                                onMouseEnter={() => setSelectedGender("FEMALE")}
                                onMouseLeave={() => setSelectedGender(null)}
                                className={
                                    selectedGender === "여자"
                                        ? "pointer selected-gender-text selected"
                                        : "pointer selected-gender-text"
                                }
                            >
                                여자
                            </p>
                            <p
                                onClick={() => {
                                    setModelURL(process.env.PUBLIC_URL + "/models/boy/model.json");
                                    setMetadataURL(process.env.PUBLIC_URL + "/models/boy/metadata.json");
                                    setWeightsURL(process.env.PUBLIC_URL + "/models/boy/weights.bin");
                                    navigate("/test");
                                }}
                                onMouseEnter={() => setSelectedGender("MALE")}
                                onMouseLeave={() => setSelectedGender(null)}
                                className={
                                    selectedGender === "남자"
                                        ? "pointer selected-gender-text selected"
                                        : "pointer selected-gender-text"
                                }
                            >
                                남자
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {!isRow && (
                <div className="noticeboard-wrapper">
                    <NoticeBoard />
                </div>
            )}
        </div>
    );
};

export default SettingPage;
