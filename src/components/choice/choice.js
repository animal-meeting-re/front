import styled from "styled-components";
import { COLORS } from "../../theme";
import { useState } from "react";

import partyImg from "../../assets/images/partyImg.png";
import meetingImg from "../../assets/images/meetingImg.png";
import checked from "../../assets/images/checked.png";
import unChecked from "../../assets/images/unChecked.png";

import { partyContent, meetingContent } from "./infom";

import { useNavigate } from "react-router-dom";
import useApplyStore from "../apply/store/applyStore";
const Choice = () => {
  const navigate = useNavigate();
  const [clickState, setClickState] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { setChoiced } = useApplyStore();
  const handleChoice = (state) => {
    setClickState(state);
    setChoiced(state);
    setIsVisible(true);
  };
  const moveToNext = () => {
    navigate("/apply");
  };

  return (
    <ChoiceContainer>
      <Title>
        <h3>미팅 방법</h3>
        <p>선호하는 미팅 방식을 선택해주세요!</p>
      </Title>

      <BtnContainer>
        <ChoiceBtn
          onClick={() => {
            handleChoice("party");
          }}
          isSelected={clickState === "party"}
        >
          <InnerBox>
            <ChoiceImg src={partyImg} />
            <Span state="Title">동숲 파티</Span>
            <Span state="Content">
              오프라인 파티룸에서
              <br /> n 대 n 미팅 진행
            </Span>
            <Span state="Price">19,000원</Span>
          </InnerBox>
          <Check src={clickState === "party" ? checked : unChecked} />
        </ChoiceBtn>
        <ChoiceBtn
          onClick={() => {
            handleChoice("meeting");
          }}
          isSelected={clickState === "meeting"}
        >
          <InnerBox>
            <ChoiceImg src={meetingImg} />
            <Span state="Title">동물상 미팅</Span>
            <Span state="Content">
              온라인 1:1 매칭
              <br /> 카카오톡ID만 전달
            </Span>
            <Span>무료</Span>
          </InnerBox>
          <Check src={clickState === "meeting" ? checked : unChecked} />
        </ChoiceBtn>
      </BtnContainer>
      <InformBox isVisible={isVisible}>
        <h4>이런 분들께 추천해요!</h4>
        <p>
          {clickState === "party" && partyContent}
          {clickState === "meeting" && meetingContent}
        </p>
      </InformBox>
      <Next isVisible={isVisible} onClick={moveToNext}>
        다음
      </Next>
    </ChoiceContainer>
  );
};

export default Choice;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 24px;
  * {
    font-family: "Pretendard";
  }
`;

const Title = styled.div`
  width: 100%;
  h3 {
    margin: 0;
  }
  p {
    margin-top: 4px;
  }
`;
const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ChoiceBtn = styled.button`
  border: 1px solid ${COLORS.line_02};
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
  width: 45%;
  height: 210px;
  border-radius: 40px;
  position: relative;
  background-color: ${(props) =>
    props.isSelected ? `${COLORS.animal_background}` : `${COLORS.back_02}`};
`;

const ChoiceImg = styled.img`
  width: 80px;
  height: 80px;
  background-image: url("../../assets/images/partyImg.png");
`;
const InnerBox = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Span = styled.span`
  font-size: ${(props) => (props.state === "Title" ? "16px" : "12px")};
  font-weight: ${(props) => (props.state === "Content" ? null : "700")};
  color: ${(props) =>
    props.state === "Title"
      ? `${COLORS.font_01}`
      : props.state === "Content"
      ? `${COLORS.font_02}`
      : `${COLORS.animal_main}`};
  margin-top: ${(props) =>
    props.state === "Content"
      ? "2px"
      : props.state === "Price"
      ? "8px"
      : "5px"};
`;

const Check = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  top: 14px;
  right: 24px;
`;

const InformBox = styled.div`
  width: 100%;
  height: 20vh;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  h4 {
    font-size: 18px;
    margin-bottom: 0;
  }
`;

const Next = styled.button`
  width: 100%;
  height: 52px;
  background-color: ${(props) =>
    props.isVisible ? `${COLORS.animal_main}` : `${COLORS.line_02}`};
  border-radius: 26px;
  border: none;
  color: ${COLORS.back_02};
  font-size: 1.2rem;
  font-weight: 700;
`;
