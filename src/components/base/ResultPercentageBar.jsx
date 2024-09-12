import React from "react";
import styled from "styled-components";
import ProgressBar from "@ramonak/react-progress-bar";

const ResultPercentageBar = ({
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
          height="3px"
          borderRadius="4px"
          customLabel=" "
        />

      </Content>
    </Container>
  );
};

export default ResultPercentageBar;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-family: Pretendard;
`;

const Icon = styled.img`
  width: 32px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid #E5E5E5;
  margin-right: 8px;
`;

const Content = styled.div`
    width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const Title = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.47;
`;

const Percentage = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

const StyledProgressBar = styled(ProgressBar)`
  && {
    height: 3px;
    border-radius: 4px;
  }
`;
