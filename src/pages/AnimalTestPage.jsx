import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import NoticeBoard from "../components/NoticeBoard";
import GradientButton from "../components/base/GradientButton";
import PercentageBar from "../components/base/PercentageBar";
import RegistrationForm from "../components/modal/RegistrationForm";
import { useRecoilValue, useRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { getAnimalTypeDetailsByIndex } from "../data/animalData";
import { fetchFile } from "../utils/FileUtil";
import "./AnimalTestPage.css";

const AnimalTestPage = () => {
    const navigate = useNavigate();
    const [gender, setGender] = useRecoilState(GENDER);
    const modelURL = useRecoilValue(MODEL_URL);
    const metadataURL = useRecoilValue(METADATA_URL);
    const weightsURL = useRecoilValue(WEIGHTS_URL);

    const [bar1Percentage, setBar1Percentage] = useState(0);
    const [bar2Percentage, setBar2Percentage] = useState(0);
    const [bar3Percentage, setBar3Percentage] = useState(0);
    const [bar4Percentage, setBar4Percentage] = useState(0);
    const [bar5Percentage, setBar5Percentage] = useState(0);
    const [bar6Percentage, setBar6Percentage] = useState(0);

    const [modelFile, setModelFile] = useState();
    const [weightsFile, setWeightsFile] = useState();
    const [metadataFile, setMetadataFile] = useState();

    const [model, setModel] = useState();
    const webcamRef = useRef(null);

    const [countdown, setCountdown] = useState(0);
    const [cumulativePredictions, setCumulativePredictions] = useState([0, 0, 0, 0, 0, 0]);
    const [startMessage, setStartMessage] = useState("");
    const [resultIndex, setResultIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [animalData, setAnimalData] = useState();

    useEffect(() => {
        if (gender == null) {
            navigate("/");
        } else {
            loadFiles();
        }
    }, []);

    useEffect(() => {
        if (modelFile && weightsFile && metadataFile) {
            loadModel();
        }
    }, [modelFile, weightsFile, metadataFile]);

    useEffect(() => {
        updateCumulativePredictions();
    }, [cumulativePredictions]);

    useEffect(() => {
        gender && setAnimalData(getAnimalTypeDetailsByIndex(gender, resultIndex));
    }, [resultIndex]);

    function initStatus() {
        setCumulativePredictions([0, 0, 0, 0, 0, 0]);
        setBar1Percentage(0);
        setBar2Percentage(0);
        setBar3Percentage(0);
        setBar4Percentage(0);
        setBar5Percentage(0);
        setBar6Percentage(0);
        setResultIndex(0);
    }

    function updateCumulativePredictions() {
        const sum = cumulativePredictions.reduce((a, b) => a + b, 0);
        const normalizedPredictions = cumulativePredictions.map((value) => (value / sum) * 100);

        if (sum === 0) {
            return;
        }

        let maxIndex = 0;
        let maxPred = 0;
        cumulativePredictions.map((predict, index) => {
            if (maxPred < predict) {
                maxIndex = index;
                maxPred = predict;
            }
        });
        setResultIndex(maxIndex);
        setBar1Percentage(Math.floor(normalizedPredictions[0]));
        setBar2Percentage(Math.floor(normalizedPredictions[1]));
        setBar3Percentage(Math.floor(normalizedPredictions[2]));
        setBar4Percentage(Math.floor(normalizedPredictions[3]));
        setBar5Percentage(Math.floor(normalizedPredictions[4]));
        setBar6Percentage(Math.floor(normalizedPredictions[5]));
    }

    async function loadFiles() {
        setModelFile(await fetchFile(modelURL, "model.json"));
        setWeightsFile(await fetchFile(weightsURL, "weights.bin"));
        setMetadataFile(await fetchFile(metadataURL, "metadata.json"));
    }

    async function loadModel() {
        console.log("init model");
        setModel(await tmImage.loadFromFiles(modelFile, weightsFile, metadataFile));
    }

    async function predict() {
        if (model) {
            let prediction = await model.predict(webcamRef.current.video);
            console.log(prediction);

            const newCumulativePredictions = cumulativePredictions.map(
                (value, index) => value + prediction[index].probability + Math.random() * 0.2
            );

            setCumulativePredictions(newCumulativePredictions);
            console.log("result update");
        } else {
            console.log("model undefined");
        }
    }

    function startPredicting() {
        loadModel().then(() => {
            initStatus();
            let countdownTime = 3;
            setCountdown(countdownTime);
            setStartMessage("");

            const countdownInterval = setInterval(() => {
                countdownTime -= 1;
                setCountdown(countdownTime);
                if (countdownTime <= 0) {
                    clearInterval(countdownInterval);
                    setStartMessage("START!");
                    setTimeout(() => {
                        setStartMessage("");
                        startPredictProcess();
                    }, 1000);
                }
            }, 1000);
        });
    }

    function startPredictProcess() {
        let timeLeft = 5;
        setCountdown(timeLeft);

        const intervalId = setInterval(() => {
            predict();
            timeLeft -= 0.5;
            setCountdown(timeLeft);
        }, 500);

        setTimeout(() => {
            clearInterval(intervalId);
            setCountdown(0);
            setIsFinished(true);
        }, 5000);
    }

    return (
        <div className="main_container">
            <div className="screen_container">
                <div className="center_container">
                    {/* <div className="header_container_v1">
                        <img style={{ width: "260px" }} src={`${process.env.PUBLIC_URL}/img/mainLogo.png`} />
                    </div> */}
                    <div className="header_container_v2">
                        <GradientButton
                            content="Ai Animal Test"
                            textStyle={{
                                fontSize: "2.6rem",
                                fontWeight: "800",
                            }}
                        />
                    </div>
                    <div className="option_container">
                        <GradientButton
                            onClick={() => {
                                setGender(null);
                                navigate("/");
                            }}
                            content="뒤로가기"
                            buttonStyle={{
                                fontSize: "1rem",
                                fontWeight: "800",
                            }}
                        />

                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ marginRight: "5px" }}>
                                <GradientButton
                                    onClick={() => {
                                        setIsFinished(false);
                                        startPredicting();
                                    }}
                                    content="시작"
                                    buttonStyle={{
                                        fontSize: "1rem",
                                        fontWeight: "800",
                                    }}
                                />
                            </div>

                            <RegistrationForm
                                resultIndex={resultIndex}
                                gender={gender}
                                bar1Percentage={bar1Percentage}
                                bar2Percentage={bar2Percentage}
                                bar3Percentage={bar3Percentage}
                                bar4Percentage={bar4Percentage}
                                bar5Percentage={bar5Percentage}
                                bar6Percentage={bar6Percentage}
                            />
                        </div>
                    </div>
                    <div className="webcam_container" style={{ position: "relative" }}>
                        {isFinished ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <img
                                    src={process.env.PUBLIC_URL + animalData.image}
                                    alt={animalData.type}
                                    style={{
                                        maxWidth: "90%",
                                        maxHeight: "50%",
                                        borderRadius: "20px",
                                        border: "5px solid gainsboro",
                                    }}
                                />
                                <p style={{ fontSize: "1.8rem", marginTop: "15px", fontWeight: "bold", color: "#333" }}>
                                    {animalData && animalData.type}
                                </p>
                                <p
                                    style={{
                                        fontSize: "1.5rem",
                                        marginTop: "10px",
                                        color: "#555",
                                        lineHeight: "1.6",
                                        margin: "0",
                                    }}
                                >
                                    {animalData &&
                                        animalData.characteristics.map((characteristic, index) => (
                                            <p key={index} style={{ margin: "0" }}>
                                                {characteristic}
                                            </p>
                                        ))}
                                </p>
                                <p
                                    style={{
                                        fontSize: "1.5rem",
                                        marginTop: "10px",
                                        color: "#555",
                                        lineHeight: "1.6",
                                        fontFamily: "Cafe24Ssurround",
                                    }}
                                >
                                    {animalData && animalData.celebrities}
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Webcam
                                    ref={webcamRef}
                                    mirrored={true}
                                    width={"100%"}
                                    height={"100%"}
                                    style={{ borderRadius: "10px" }}
                                    muted={false}
                                />
                                <div style={{ width: "100%", height: "100%" }}></div>
                            </div>
                        )}
                        {countdown > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "5rem",
                                    color: "white",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                {Math.ceil(countdown)}
                            </div>
                        )}
                        {startMessage && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "5rem",
                                    color: "white",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                {startMessage}
                            </div>
                        )}
                    </div>
                    <div className="percentage_bar_container">
                        <PercentageBar
                            title="강아지상"
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/dog.png"
                                    : "img/woman-animal/dog-woman.png"
                            }
                            bgColor="#FF99C8"
                            bgBaseColor="#f0bcd4"
                            percentage={bar1Percentage}
                        />
                        <PercentageBar
                            title="고양이상"
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/cat-man.png"
                                    : "img/woman-animal/cat-woman.png"
                            }
                            bgColor="#f7efa6"
                            bgBaseColor="#faf7dd"
                            percentage={bar2Percentage}
                        />
                        <PercentageBar
                            title={gender === "MALE" ? "곰상" : "여우상"}
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/bear.png"
                                    : "img/woman-animal/fox.png"
                            }
                            bgColor="#aef4c9"
                            bgBaseColor="#ddefe4"
                            percentage={bar3Percentage}
                        />
                        <PercentageBar
                            title={gender === "MALE" ? "공룡상" : "토끼상"}
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/dinosaur.png"
                                    : "img/woman-animal/rabbit-woman.png"
                            }
                            bgColor="#A9DEF9"
                            bgBaseColor="#ceeaf8"
                            percentage={bar4Percentage}
                        />
                        <PercentageBar
                            title={gender === "MALE" ? "늑대상" : "사슴상"}
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/wolf.png"
                                    : "img/woman-animal/deer.png"
                            }
                            bgColor="#E4C1F9"
                            bgBaseColor="#ebd8f7"
                            percentage={bar5Percentage}
                        />
                        <PercentageBar
                            title={gender === "MALE" ? "토끼상" : "햄스터상"}
                            iconSrc={
                                gender === "MALE"
                                    ? process.env.PUBLIC_URL + "img/man-animal/rabbit-man.png"
                                    : "img/woman-animal/hamster.png"
                            }
                            bgColor="#fca951"
                            bgBaseColor="#ffe0c0"
                            percentage={bar6Percentage}
                        />
                    </div>
                </div>
            </div>
            <div className="right_container">
                <NoticeBoard />
            </div>
        </div>
    );
};
export default AnimalTestPage;
