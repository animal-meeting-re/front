import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import GradientButton from "../components/base/GradientButton";
import PercentageBar from "../components/base/PercentageBar";
import ResultPercentageBar from "../components/base/ResultPercentageBar";
import RotatingImage from "../components/base/RotatingImage";
import { useRecoilValue, useRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { getAnimalTypeDetailsByIndex } from "../data/animalData";
import { fetchFile } from "../utils/FileUtil";
import styled from "styled-components";
import { Header } from "../components/header";
import useResultStore from "./useResultStore";

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

  const { setUserGender, setAnimal, animal } = useResultStore();

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
    setUserGender(gender);
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

  const percentageBarsData = [
    {
      title: "강아지",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_dog.png"
          : "img/woman-animal/dog-woman.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar1Percentage,
    },
    {
      title: "고양이",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_cat.png"
          : "img/woman-animal/cat-woman.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar2Percentage,
    },
    {
      title: gender === "MALE" ? "토끼" : "햄스터",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_rabbit.png"
          : "img/woman-animal/hamster.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar6Percentage,
    },
    {
      title: gender === "MALE" ? "곰" : "여우",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_bear.png"
          : "img/woman-animal/fox.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar3Percentage,
    },
    {
      title: gender === "MALE" ? "공룡" : "토끼",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_dino.png"
          : "img/woman-animal/rabbit-woman.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar4Percentage,
    },
    {
      title: gender === "MALE" ? "늑대" : "사슴",
      iconSrc:
        gender === "MALE"
          ? process.env.PUBLIC_URL + "img/man-animal/man_wolf.png"
          : "img/woman-animal/deer.png",
      bgColor: "#50CD7B",
      bgBaseColor: "#d9d9d9",
      percentage: bar5Percentage,
    },
  ];
  const sortedBars = [...percentageBarsData].sort(
    (a, b) => b.percentage - a.percentage
  );

  useEffect(() => {
    if (sortedBars[0]?.title !== animal) {
      setAnimal(sortedBars[0].title);
    }
    console.log(animal);
  }, [sortedBars, animal]);

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
                <FinishText>측정완료!</FinishText>
                <ResultImg
                  src={process.env.PUBLIC_URL + animalData.subImage}
                  alt="동물상 결과 이미지"
                />

                <ResultText>{animalData && animalData.type}</ResultText>

                <ResultDescriptionWrapper>
                  <ResultDescriptionTitle>동물상 특징</ResultDescriptionTitle>
                  {animalData &&
                    animalData.characteristics.map((characteristic, index) => (
                      <ResultDescription key={index}>
                        {characteristic}
                      </ResultDescription>
                    ))}
                </ResultDescriptionWrapper>

                <ResultDescriptionWrapper>
                  <ResultDescriptionTitle>대표 연예인</ResultDescriptionTitle>
                  <ResultDescription>
                    {animalData && animalData.celebrities}
                  </ResultDescription>
                </ResultDescriptionWrapper>
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
          {isFinished ? (
            <ResultDescriptionWrapper>
              <ResultDescriptionTitle>닮은 동물 비율</ResultDescriptionTitle>
              <PercentageBarContainer2>
                {sortedBars.map((bar, index) => (
                  <ResultPercentageBar
                    key={index}
                    title={bar.title}
                    iconSrc={bar.iconSrc}
                    bgColor={bar.bgColor}
                    bgBaseColor={bar.bgBaseColor}
                    percentage={bar.percentage}
                  />
                ))}
              </PercentageBarContainer2>
            </ResultDescriptionWrapper>
          ) : (
            <PercentageBarContainer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  gap: "15px",
                }}
              >
                <PercentageBar
                  title="강아지"
                  iconSrc={
                    gender === "MALE"
                      ? process.env.PUBLIC_URL + "img/man-animal/man_dog.png"
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
                      ? process.env.PUBLIC_URL + "img/man-animal/man_cat.png"
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
                      ? process.env.PUBLIC_URL + "img/man-animal/man_rabbit.png"
                      : "img/woman-animal/hamster.png"
                  }
                  bgColor="#50CD7B"
                  bgBaseColor="#d9d9d9"
                  percentage={bar6Percentage}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  gap: "15px",
                }}
              >
                <PercentageBar
                  title={gender === "MALE" ? "곰" : "여우"}
                  iconSrc={
                    gender === "MALE"
                      ? process.env.PUBLIC_URL + "img/man-animal/man_bear.png"
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
                      ? process.env.PUBLIC_URL + "img/man-animal/man_dino.png"
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
                      ? process.env.PUBLIC_URL + "img/man-animal/man_wolf.png"
                      : "img/woman-animal/deer.png"
                  }
                  bgColor="#50CD7B"
                  bgBaseColor="#d9d9d9"
                  percentage={bar5Percentage}
                />
              </div>
            </PercentageBarContainer>
          )}
        </CenterContainer>
      </ScreenContainer>
      {isFinished ? (
        <ResultBtnContainer>
          <GoMeetingBtn>동물상 이상형과 미팅하러 가기!</GoMeetingBtn>
          <RetryBtn
            onClick={() => {
              setIsFinished(false);
            }}
          >
            동물상 다시 측정하기
          </RetryBtn>
        </ResultBtnContainer>
      ) : (
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
              margin: "auto",
            }}
          />
        </div>
      )}
    </MainContainer>
  );
};

export default AnimalTestPage;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: Pretendard;
  color: #111;
`;

const ScreenContainer = styled.div`
  max-width: 400px;
  margin: auto;
`;

const CenterContainer = styled.div`
  padding: 27px 32px;
`;

const WebcamContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const FinishText = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;
const ResultImg = styled.img`
  width: 215px;
  margin: 4px 0 8px;
  aspect-ratio: 1 / 1;
`;

const ResultText = styled.p`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
`;

const ResultDescriptionWrapper = styled.article`
  margin-top: 24px;
  width: 100%;
`;
const ResultDescriptionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
`;
const ResultDescription = styled.p`
  font-size: 15px;
  line-height: 1.47;
  margin: 0;
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

const PercentageBarContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  gap: 16px;
`;

const ResultBtnContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;
const GoMeetingBtn = styled.button`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  padding: 13px 48px;
  border: none;
  background-color: #50cd7b;
  border-radius: 26px;
  font-family: Pretendard;
  line-height: 1.44;
`;
const RetryBtn = styled.button`
  border: none;
  background-color: none;
  text-decoration: underline;
  font-size: 16px;
  font-weight: 600;
  color: #999;
  background-color: transparent;
  font-family: Pretendard;
  margin-bottom: 20px;
`;
