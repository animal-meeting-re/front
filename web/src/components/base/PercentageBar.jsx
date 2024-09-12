import React from "react";
import styled from "styled-components";
import ProgressBar from "@ramonak/react-progress-bar";

const PercentageBar = ({
  iconSrc,
  title,
  percentage,
  bgColor,
  bgBaseColor,
}) => {
  return (
    <Container>
      <Icon src={iconSrc} alt="icon" />
      <Content>
        <TitleContainer>
          <Title>{title}</Title>
          <Percentage>{percentage}%</Percentage>
        </TitleContainer>
        <StyledProgressBar
          completed={percentage}
          bgColor={bgColor}
          baseBgColor={bgBaseColor}
          height="4px"
          borderRadius="4px"
          customLabel=" "
        />
      </Content>
    </Container>
  );
};

export default PercentageBar;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const Title = styled.span`
  font-family: "Pretendard";
  font-size: 10px;
  font-weight: 600;
`;

const Percentage = styled.span`
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
`;

const StyledProgressBar = styled(ProgressBar)`
  && {
    height: 3px;
    border-radius: 4px;
  }
`;
