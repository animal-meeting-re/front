import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import "./settingPage.css";

const SettingPage = () => {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useRecoilState(GENDER);
    const setModelURL = useSetRecoilState(MODEL_URL);
    const setMetadataURL = useSetRecoilState(METADATA_URL);
    const setWeightsURL = useSetRecoilState(WEIGHTS_URL);

    return (
        <div className="container">
            <div className="header">
                <img className="mainLogo" src={`${process.env.PUBLIC_URL}/img/mainLogo.png`} />
            </div>

            <div className="character-wrap">
                <img className="character" src={`${process.env.PUBLIC_URL}/img/character.png`} />
            </div>
            <div class="speech-wrap">
                <span className="character-name">너굴</span>
                <img className="speechBubble" src={`${process.env.PUBLIC_URL}/img/speechBubble.png`} />
                <div className="speech-text">
                    <p>
                        오늘 <span style={{ color: "#58fa47" }}>동물상 미팅</span>을 하러 온 주민이구나!
                    </p>
                    <p>성별을 알려 달라구리!</p>
                </div>

                <div className="select-wrap">
                    <img
                        className="selectBubble"
                        src={`${process.env.PUBLIC_URL}/img/selectBubble.png`}
                        style={{ width: "550px" }}
                    />
                    <div className="select-text">
                        <p
                            onClick={() => {
                                setModelURL(process.env.PUBLIC_URL + "/models/girl/model.json");
                                setMetadataURL(process.env.PUBLIC_URL + "/models/girl/metadata.json");
                                setWeightsURL(process.env.PUBLIC_URL + "/models/girl/weights.bin");
                                navigate("/test");
                            }}
                            onMouseEnter={() => setSelectedGender("여자")}
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
                            onMouseEnter={() => setSelectedGender("남자")}
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
    );
};
export default SettingPage;
