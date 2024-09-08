import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import GradientButton from "../components/base/GradientButton";
import PercentageBar from "../components/base/PercentageBar";
import RotatingImage from "../components/base/RotatingImage";
import { useRecoilValue, useRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { getAnimalTypeDetailsByIndex } from "../data/animalData";
import { fetchFile } from "../utils/FileUtil";
import styled from "styled-components";
import { Header } from "../components/header";

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
  const [cumulativePredictions, setCumulativePredictions] = useState([
    0, 0, 0, 0, 0, 0,
  ]);
  const [startMessage, setStartMessage] = useState("");
  const [resultIndex, setResultIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animalData, setAnimalData] = useState();

  const [showRotatingImage, setShowRotatingImage] = useState(true);

  const videoConstraints = {
    facingMode: "user",
    // advanced: [
    //   { width: { exact: 2560 }, height: { exact: 1440 } }, // QHD
    //   { width: { exact: 1920 }, height: { exact: 1080 } }, // Full HD
    //   { width: { exact: 1280 }, height: { exact: 720 } }, // HD
    //   { width: { exact: 1024 }, height: { exact: 576 } }, // 1024x576
    //   { width: { exact: 900 }, height: { exact: 506 } }, // 900x506
    //   { width: { exact: 800 }, height: { exact: 450 } }, // 800x450
    //   { width: { exact: 640 }, height: { exact: 360 } }, // nHD
    //   { width: { exact: 320 }, height: { exact: 180 } }, // QVGA
    // ],
  };

  const fakeWeightsRef = useRef([0, 0, 0, 0, 0, 0]);
  const focusRef = useRef(null);
  const startButtonRef = useRef(null);

  useEffect(() => {
    if (gender == null) {
      navigate("/");
    } else {
      loadFiles();
    }
    const handleKeyDown = (event) => {
      if (event.key >= "1" && event.key <= "6") {
        const index = parseInt(event.key) - 1;
        if (startButtonRef.current) {
          startButtonRef.current.click();
        }
        startFakeKeyInput(index);
      }

      if (event.key === "w" || event.key === "W") {
        if (startButtonRef.current) {
          startButtonRef.current.click();
        }
      }
      if (event.key === "q" || event.key === "Q") {
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
    const normalizedPredictions = cumulativePredictions.map(
      (value) => (value / sum) * 100
    );

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
      const loadedModel = await tmImage.loadFromFiles(
        modelFile,
        weightsFile,
        metadataFile
      );
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

        const newCumulativePredictions = cumulativePredictions.map(
          (value, index) =>
            prediction[index].probability +
            Math.random() * (0.2 + fakeWeightsRef.current[index])
        );

        setCumulativePredictions(newCumulativePredictions);
      } catch (error) {
        console.error("예측 중 에러:", error);
      }
    } else {
      console.log("모델이 정의되지 않았습니다.");
    }
  }

  function startPredicting() {
    loadModel()
      .then(() => {
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
      })
      .catch((error) => {
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
    <MainContainer ref={focusRef} tabIndex={-1}>
      <Header title="미동숲" />
      <ScreenContainer>
        <CenterContainer>
          {/* <OptionContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
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
          </OptionContainer> */}
          <WebcamContainer>
            {isFinished ? (
              <ResultContainer>
                {showRotatingImage ? (
                  <RotatingImage
                    height="28vh"
                    width="28vh"
                    front={process.env.PUBLIC_URL + animalData.image}
                    back={process.env.PUBLIC_URL + animalData.subImage}
                  />
                ) : (
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
                )}
                <ResultText>{animalData && animalData.type}</ResultText>
                <ResultDescription>
                  {animalData &&
                    animalData.characteristics.map((characteristic, index) => (
                      <p key={index}>{characteristic}</p>
                    ))}
                </ResultDescription>
                <ResultCelebrities>
                  {animalData && animalData.celebrities}
                </ResultCelebrities>
              </ResultContainer>
            ) : (
              <WebcamBox>
                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "8px" }}
                  muted={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  // onUserMediaError={onMediaSuccess}
                  // onUserMedia={onMediaError}
                />
              </WebcamBox>
            )}
            {countdown > 0 && <Countdown>{Math.ceil(countdown)}</Countdown>}
            {startMessage && <StartMessage>{startMessage}</StartMessage>}
          </WebcamContainer>
          <PercentageBarContainer>
            <div
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <PercentageBar
                title="강아지"
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/dog.png"
                    : "img/woman-animal/dog-woman.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar1Percentage}
              />
              <PercentageBar
                title="고양이"
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/cat-man.png"
                    : "img/woman-animal/cat-woman.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar2Percentage}
              />
              <PercentageBar
                title={gender === "MALE" ? "토끼" : "햄스터"}
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/rabbit-man.png"
                    : "img/woman-animal/hamster.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar6Percentage}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <PercentageBar
                title={gender === "MALE" ? "곰" : "여우"}
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/bear.png"
                    : "img/woman-animal/fox.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar3Percentage}
              />
              <PercentageBar
                title={gender === "MALE" ? "공룡" : "토끼"}
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/dinosaur.png"
                    : "img/woman-animal/rabbit-woman.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar4Percentage}
              />
              <PercentageBar
                title={gender === "MALE" ? "늑대" : "사슴"}
                iconSrc={
                  gender === "MALE"
                    ? process.env.PUBLIC_URL + "img/man-animal/wolf.png"
                    : "img/woman-animal/deer.png"
                }
                bgColor="#50CD7B"
                bgBaseColor="#d9d9d9"
                percentage={bar5Percentage}
              />
            </div>
          </PercentageBarContainer>
        </CenterContainer>
      </ScreenContainer>
      <div style={{ marginRight: "5px" }}>
        <GradientButton
          ref={startButtonRef}
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
    </MainContainer>
  );
};

export default AnimalTestPage;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ScreenContainer = styled.div`
  padding: 0px 32px;
`;

const CenterContainer = styled.div``;

const WebcamContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: white;
  padding-top: 80px;
  padding-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultText = styled.p`
  font-size: 3rem;
  margin-top: 100px;
  font-weight: bold;
  color: #333;
  text-decoration: underline;
  text-decoration-color: #0ea5e9;
  text-decoration-style: wavy;
  font-family: "Cafe24Ssurround";
`;

const ResultDescription = styled.p`
  font-size: 1.5rem;
  margin-top: 10px;
  color: #555;
  line-height: 1.6;
  margin: 0;
`;

const ResultCelebrities = styled.p`
  font-size: 1.5rem;
  margin-top: 10px;
  color: #555;
  line-height: 1.6;
  font-family: "Cafe24Ssurround";
`;

const WebcamBox = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  border: 2px solid black;
  border-radius: 8px;
  width: 100%;
  height: 360px;
`;

const Countdown = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const StartMessage = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const PercentageBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #111;
  gap: 10px;
`;
