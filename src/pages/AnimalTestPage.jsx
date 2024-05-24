import React, { useEffect, useRef, useState } from "react";
import GradientButton from "../components/GradientButton";
import Webcam from "react-webcam";
import PercentageBar from "../components/PercentageBar";
import * as tmImage from "@teachablemachine/image";
import { useRecoilValue } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import "./AnimalTestPage.css";

const AnimalTestPage = (props) => {
    const gender = useRecoilValue(GENDER);
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
    const [highestIndex, setHighestIndex] = useState(0);
    const [highestAnimal, setHighestAnimal] = useState(null);

    const [isFinished, setIsFinished] = useState(false);

    const animalData = {
        0: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_dog.jpg",
            info: "Dogs are loyal and friendly.",
        },
        1: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_cat.jpg",
            info: "Cats are independent and curious.",
        },
        2: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_fox.jpg",
            info: "Foxes are clever and quick.",
        },
        3: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_rabbit.jpg",
            info: "Rabbits are gentle and quiet.",
        },
        4: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_deer.jpg",
            info: "Deers are graceful and serene.",
        },
        5: {
            image: process.env.PUBLIC_URL + "/img/resultImg/girl_tuttle.jpg", // change hamster
            info: "Hamsters are small and energetic.",
        },
    };

    useEffect(() => {
        console.log("ISFINISHED : ", isFinished);
    }, [isFinished]);

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (modelFile && weightsFile && metadataFile) {
            loadModel();
            console.log("model load complete");
        }
    }, [modelFile, weightsFile, metadataFile]);

    useEffect(() => {
        const sum = cumulativePredictions.reduce((a, b) => a + b, 0);
        const normalizedPredictions = cumulativePredictions.map((value) => (value / sum) * 100);

        let maxIndex = 0;
        let maxPred = 0;
        cumulativePredictions.map((predict, index) => {
            if (maxPred < predict) {
                maxIndex = index;
                maxPred = predict;
            }
        });
        setHighestIndex(maxIndex);
        setBar1Percentage(Math.floor(normalizedPredictions[0]));
        setBar2Percentage(Math.floor(normalizedPredictions[1]));
        setBar3Percentage(Math.floor(normalizedPredictions[2]));
        setBar4Percentage(Math.floor(normalizedPredictions[3]));
        setBar5Percentage(Math.floor(normalizedPredictions[4]));
        setBar6Percentage(Math.floor(normalizedPredictions[5]));
    }, [cumulativePredictions]);

    useEffect(() => {
        console.log(highestIndex);
    }, [highestIndex]);

    async function fetchFile(url, fileName) {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], fileName);
    }

    async function loadFiles() {
        setModelFile(await fetchFile(modelURL, "model.json"));
        setWeightsFile(await fetchFile(weightsURL, "weights.bin"));
        setMetadataFile(await fetchFile(metadataURL, "metadata.json"));
    }

    async function loadModel() {
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
        loadModel();
        setIsFinished(false);
        setCumulativePredictions([0, 0, 0, 0, 0, 0]);
        setBar1Percentage(0);
        setBar2Percentage(0);
        setBar3Percentage(0);
        setBar4Percentage(0);
        setBar5Percentage(0);
        setBar6Percentage(0);
        setHighestAnimal(null);

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
                            onClick={startPredicting}
                            content="시작"
                            buttonStyle={{
                                fontSize: "1rem",
                                fontWeight: "800",
                            }}
                        />
                    </div>
                    <div className="webcam_container" style={{ position: "relative" }}>
                        {isFinished ? (
                            <div style={{ textAlign: "center" }}>
                                <img
                                    src={animalData[highestIndex].image}
                                    alt={highestIndex}
                                    style={{ width: "50%", borderRadius: "20px" }}
                                />
                                <p style={{ fontSize: "1.5rem", marginTop: "10px" }}>{animalData[highestIndex].info}</p>
                            </div>
                        ) : (
                            <Webcam
                                ref={webcamRef}
                                mirrored={true}
                                height={"90%"}
                                // style={{ borderRadius: "100%" }}
                                muted={false}
                            />
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
                            bgColor="#FF99C8"
                            bgBaseColor="#f0bcd4"
                            percentage={bar1Percentage}
                        />
                        <PercentageBar
                            title="고양이상"
                            bgColor="#FCF6BD"
                            bgBaseColor="#faf7dd"
                            percentage={bar2Percentage}
                        />
                        <PercentageBar
                            title="여우상"
                            bgColor="#aef4c9"
                            bgBaseColor="#ddefe4"
                            percentage={bar3Percentage}
                        />
                        <PercentageBar
                            title="토끼상"
                            bgColor="#A9DEF9"
                            bgBaseColor="#ceeaf8"
                            percentage={bar4Percentage}
                        />
                        <PercentageBar
                            title="사슴상"
                            bgColor="#E4C1F9"
                            bgBaseColor="#ebd8f7"
                            percentage={bar5Percentage}
                        />
                        <PercentageBar
                            title="햄스터상"
                            bgColor="#fca951"
                            bgBaseColor="#ffe0c0"
                            percentage={bar6Percentage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AnimalTestPage;
