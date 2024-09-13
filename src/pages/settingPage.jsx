import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { Header } from "../components/header";
import styled from "styled-components";
import Male from "../assets/images/male.png";
import Female from "../assets/images/female.png";
import Checked from "../assets/images/checked.png";
import UnChecked from "../assets/images/unChecked.png";
import { COLORS } from "../theme";

const SettingPage = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useRecoilState(GENDER);
  const setModelURL = useSetRecoilState(MODEL_URL);
  const setMetadataURL = useSetRecoilState(METADATA_URL);
  const setWeightsURL = useSetRecoilState(WEIGHTS_URL);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setSelectedGender(null);

    // 키보드 입력
    const handleKeyDown = (event) => {
      if (event.key === "q" || event.key === "Q") {
        setSelectedGender("FEMALE");
        handleGenderSelect("FEMALE");
      } else if (event.key === "w" || event.key === "W") {
        setSelectedGender("MALE");
        handleGenderSelect("MALE");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleGenderSelect = (gender) => {
    let modelURL, metadataURL, weightsURL;
    if (gender === "FEMALE") {
      modelURL = process.env.PUBLIC_URL + "/models/girl/model.json";
      metadataURL = process.env.PUBLIC_URL + "/models/girl/metadata.json";
      weightsURL = process.env.PUBLIC_URL + "/models/girl/weights.bin";
    } else if (gender === "MALE") {
      modelURL = process.env.PUBLIC_URL + "/models/boy/model.json";
      metadataURL = process.env.PUBLIC_URL + "/models/boy/metadata.json";
      weightsURL = process.env.PUBLIC_URL + "/models/boy/weights.bin";
    }
    setModelURL(modelURL);
    setMetadataURL(metadataURL);
    setWeightsURL(weightsURL);
    setSelectedGender(gender);
    navigate("/test");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // navigate("/next-page");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <Header />
      <Container2>
        <Choose>성별을 알려주세요!</Choose>
        <Choose2>성별에 따라 측정 결과가 달라질 수 있어요</Choose2>
        <GenderContainer>
          <Gender
            onClick={() => handleGenderSelect("MALE")}
            className="pointer selected-gender-text"
          >
            <GenderImg src={Male} />
            <GenderText>남자</GenderText>
            <CheckmarkImg
              src={selectedGender === "MALE" ? Checked : UnChecked}
            />
          </Gender>
          <Gender
            onClick={() => handleGenderSelect("FEMALE")}
            className="pointer selected-gender-text"
          >
            <GenderImg src={Female} />
            <GenderText>여자</GenderText>
            <CheckmarkImg
              src={selectedGender === "FEMALE" ? Checked : UnChecked}
            />
          </Gender>
        </GenderContainer>
        <NextButton onClick={handleNext} disabled={currentStep === 3}>
          다음
        </NextButton>
      </Container2>
    </>
  );
};

export default SettingPage;

const Container2 = styled.div`
  padding: 0px 24px;
`;

const Choose = styled.p`
  font-family: "pretendard";
  font-size: 1.3rem;
  font-weight: 800;
  margin: 23px 0px 0px 0px;
`;
const Choose2 = styled.p`
  font-family: "pretendard";
  font-size: 1rem;
  margin-top: 4px;
  color: ${COLORS.font_03};
`;

const GenderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* gap: 25px; */
  margin-top: 28px;
`;

const Gender = styled.button`
  width: 45%;
  height: 25vh;
  color: black;
  border-radius: 40px;
  border: 1px solid var(--line_02, #e5e5e5);
  background: var(--back_02, #fff);
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
`;

const GenderImg = styled.img`
  width: 128px;
  height: auto;
  padding-top: 15px;
`;

const GenderText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin: 0px;
`;

const CheckmarkImg = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 10px;
  right: 20px;
`;

const NextButton = styled.button`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.animal_main};
  color: white;
  border: none;
  border-radius: 26px;
  padding: 5px 15px;
  font-size: 1.175rem;
  font-weight: 800;
  color: white;
  cursor: pointer;
  margin-top: 30vh;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
