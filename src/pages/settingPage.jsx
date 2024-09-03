import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GENDER, MODEL_URL, METADATA_URL, WEIGHTS_URL } from "../recoil/Atoms";
import { Header } from "../components/header";
import "./settingPage.css";
import styled from "styled-components";

const SettingPage = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useRecoilState(GENDER);
  const setModelURL = useSetRecoilState(MODEL_URL);
  const setMetadataURL = useSetRecoilState(METADATA_URL);
  const setWeightsURL = useSetRecoilState(WEIGHTS_URL);
  const [isPreviousTypingFinished, setPreviousTypingFinished] = useState(false);

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
    navigate("/test");
  };

  return (
    <div className="container">
      <Header title="미팅숲" />
      <Choose>성별을 선택해 주세요</Choose>
      <div className="select-text">
        <Gender
          onClick={() => handleGenderSelect("MALE")}
          onMouseEnter={() => setSelectedGender("MALE")}
          onMouseLeave={() => setSelectedGender(null)}
          className={
            selectedGender === "MALE"
              ? "pointer selected-gender-text selected"
              : "pointer selected-gender-text"
          }
        >
          남자
        </Gender>
        <Gender
          onClick={() => handleGenderSelect("FEMALE")}
          onMouseEnter={() => setSelectedGender("FEMALE")}
          onMouseLeave={() => setSelectedGender(null)}
          className={
            selectedGender === "FEMALE"
              ? "pointer selected-gender-text selected"
              : "pointer selected-gender-text"
          }
        >
          여자
        </Gender>
      </div>
    </div>
  );
};

export default SettingPage;

const Choose = styled.p`
  font-family: "jalnan";
  font-size: 1.3rem;
`;

const Gender = styled.button`
  width: 151px;
  height: 151px;
`;
