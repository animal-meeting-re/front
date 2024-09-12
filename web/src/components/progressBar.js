import React from "react";
import styled from "styled-components";
import { COLORS } from "../theme";

const ProgressBar = ({ step }) => {
  return (
    <ProgressBarContainer>
      <ButtonContainer>
        <BackButton>뒤로</BackButton>
        <NextButton>다음</NextButton>
      </ButtonContainer>
      <Bar>
        <Progress width={(step / 3) * 100 + "%"} />
      </Bar>
    </ProgressBarContainer>
  );
};

export default ProgressBar;

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
`;

const BackButton = styled.button`
  background-color: white;
  border: 1px solid #d3d3d3;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 1rem;
  cursor: pointer;
`;

const NextButton = styled.button`
  background-color: #8ce99a;
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 1rem;
  color: white;
  cursor: pointer;
`;

const Bar = styled.div`
  position: relative;
  height: 5px;
  width: 100%;
  background-color: #d3d3d3;
  margin-top: 10px;
`;

const Progress = styled.div`
  height: 5px;
  background-color: ${COLORS.main};
  width: ${(props) => props.width};
  transition: width 0.3s ease-in-out;
`;
