import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import NoticeBoard from "../components/NoticeBoard";
import GradientButton from "../components/base/GradientButton";
import PercentageBar from "../components/base/PercentageBar";
import RegistrationForm from "../components/modal/RegistrationForm";
import RotatingImage from "../components/base/RotatingImage";
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

    const [showRotatingImage, setShowRotatingImage] = useState(true);

    const fakeWeightsRef = useRef([0, 0, 0, 0, 0, 0]);
    const intervalRef = useRef(null);
    const focusRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {

        if (gender == null) {
            navigate("/");
        } else {
            loadFiles();
        }
        const handleKeyDown = (event) => {
            if (event.key >= "1" && event.key <= "6") {
                // 1부터 6까지의 숫자 키가 눌리면 해당 인덱스의 가중치 추가을 시작합니다.
                const index = parseInt(event.key) - 1; // 인덱스는 0부터 시작하므로 입력된 키에서 1을 빼줍니다.

                // 버튼 클릭 트리거
                if (buttonRef.current) {
                    buttonRef.current.click();
                }
                startFakeKeyInput(index);

            }
            if (event.key === 'q' || event.key === 'Q') {

                // 뒤로가기
                setGender(null);
                navigate("/");
            }
        };

        const handleWindowFocus = () => {
            if (focusRef.current) {
                focusRef.current.focus();
            }
        };


        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("focus", handleWindowFocus);

        // 컴포넌트가 마운트될 때 포커스를 설정합니다.
        if (focusRef.current) {
            focusRef.current.focus();
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("focus", handleWindowFocus);
        };

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
        fakeWeightsRef.current = [0, 0, 0, 0, 0, 0];
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
        try {
            const modelFile = await fetchFile(modelURL, "model.json");
            const weightsFile = await fetchFile(weightsURL, "weights.bin");
            const metadataFile = await fetchFile(metadataURL, "metadata.json");

            console.log("modelFileBlob:", modelFile);
            console.log("weightsFileBlob:", weightsFile);
            console.log("metadataFileBlob:", metadataFile);

            setModelFile(modelFile);
            setWeightsFile(weightsFile);
            setMetadataFile(metadataFile);
        } catch (error) {
            console.error("파일 로드 에러:", error);
        }
    }

    async function loadModel() {
        console.log("init model");
        try {

            await Promise.all([modelFile, weightsFile, metadataFile]);
            console.log("modelFile:", modelFile);
            console.log("weightsFile:", weightsFile);
            console.log("metadataFile:", metadataFile);

            const loadedModel = await tmImage.loadFromFiles(modelFile, weightsFile, metadataFile);
            setModel(loadedModel);
        } catch (error) {
            console.error("모델 로드 중 에러:", error);
        }
    }

    function startFakeKeyInput(index) {

        fakeWeightsRef.current = fakeWeightsRef.current.map((weight, i) =>
            i === index ? weight + 2 : weight
        );
        console.log("즉시 가중치 업데이트:", fakeWeightsRef.current);

        // 1초 후에 한 번 더 업데이트
        setTimeout(() => {
            fakeWeightsRef.current = fakeWeightsRef.current.map((weight, i) =>
                i === index ? weight + 2 : weight
            );
            console.log("1초 후 가중치 업데이트:", fakeWeightsRef.current);
        }, 1000);
    }



    async function predict() {
        if (model) {
            try {
                const prediction = await model.predict(webcamRef.current.video);
                console.log(prediction);

                // const newCumulativePredictions = cumulativePredictions.map(
                //     (value, index) => value + prediction[index].probability + (Math.random()) * (0.1 + fakeWeightsRef.current[index])//.toFixed(2)*100 //+ (Math.random() - 0.4) * 0.05
                // );

                //누적값 빼기
                const newCumulativePredictions = cumulativePredictions.map(
                    (value, index) => prediction[index].probability + (Math.random()) * (0.2 + fakeWeightsRef.current[index])
                );

                console.log("실제로 적용된 값 ", fakeWeightsRef.current)
                setCumulativePredictions(newCumulativePredictions);

                console.log("예측 업데이트:", newCumulativePredictions);

            } catch (error) {
                console.error("예측 중 에러:", error);
            }
        } else {
            console.log("모델이 정의되지 않았습니다.");
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
        }).catch(error => {
            console.error("예측 시작 중 에러:", error);
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
        <div className="main_container" ref={focusRef} tabIndex={-1} style={{ outline: "none" }}>
            <div className="screen_container">
                <div className="center_container">
                    <div className="header_container_v1">
                        <img style={{
                            width: "450px",
                            marginTop: "45px"
                        }}
                            src={`${process.env.PUBLIC_URL}/img/mainLogoNew.png`} />
                    </div>
                    <div className="header_container_v2">
                        <GradientButton
                            content="Ai Animal Test"
                            buttonStyle={{ display: "none" }}
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
                                {/* <GradientButton
                                    onClick={() => {
                                        setResultIndex((resultIndex + 1) % 6);
                                    }}
                                    content="TEST"
                                    buttonStyle={{
                                        fontSize: "1rem",
                                        fontWeight: "800",
                                        // display: "none"
                                    }}
                                /> */}
                            </div>
                            <div style={{ marginRight: "5px" }}>
                                <GradientButton
                                    ref={buttonRef}
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
                                showRotatingImage={showRotatingImage}
                                setShowRotatingImage={setShowRotatingImage}
                            />
                        </div>
                    </div>
                    <div className="webcam_container">
                        {isFinished ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    paddingTop: "80px",
                                    paddingBottom: "20px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",

                                }}
                            >
                                {showRotatingImage ? (
                                    <RotatingImage
                                        height="28vh"
                                        width="28vh"
                                        front={process.env.PUBLIC_URL + animalData.image}
                                        back={process.env.PUBLIC_URL + animalData.subImage}
                                    />
                                ) : (
                                    <span>
                                        {/* <img
                                            src={process.env.PUBLIC_URL + animalData.image}
                                            alt={animalData.type}
                                            style={{
                                                width: "24vh",
                                                height: "24vh",
                                                objectFit: "cover",
                                                borderRadius: "20px",
                                                border: "5px solid gainsboro",
                                                marginRight: "10px",
                                            }}
                                        /> */}
                                        <img
                                            src={process.env.PUBLIC_URL + animalData.subImage}
                                            alt={animalData.type}
                                            style={{
                                                width: "30vh",
                                                height: "30vh",
                                                objectFit: "cover",
                                                borderRadius: "20px",
                                                border: "5px solid gainsboro",
                                                marginLeft: "10px",
                                            }}
                                        />
                                    </span>
                                )}

                                <p style={{
                                    fontSize: "3rem",
                                    marginTop: "100px",
                                    fontWeight: "bold",
                                    color: "#333",
                                    textDecoration: "underline",
                                    textDecorationColor: "#0ea5e9",
                                    textDecorationStyle: "wavy",
                                    fontFamily: "Cafe24Ssurround"
                                }}>
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
                                            <p key={index} style={{
                                                margin: "0",
                                            }}>
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
                                    paddingBottom: "30px",
                                    paddingTop: "30px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                }}

                            >
                                <Webcam
                                    ref={webcamRef}
                                    mirrored={true}
                                    width={"95%"}
                                    height={"95%"}
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
                                    top: "40%",
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
                                    top: "40%",
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
