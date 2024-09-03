import styled from "styled-components";
import { COLORS } from "../../theme";

import logo from "../../assets/images/logo.png";
import backimg from "../../assets/images/back.png";
import { useNavigate } from "react-router-dom";

export const LandingPage3 = () => {
  const navigate = useNavigate();
  const goMeasure = () => {
    navigate("/setting");
  };
  return (
    <Container>
      <Logo src={logo}></Logo>
      <TextContainer>
        <Text2>
          동물상 측정부터 <br />
          이상형과 미팅까지 <br />
          AI로 간편하게!
        </Text2>
        <Button onClick={goMeasure}>동물상 측정하기</Button>
        <BackImg src={backimg}></BackImg>
      </TextContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease-in-out;
`;

const Logo = styled.img`
  width: 120px;
  height: 60px;
  margin-top: 32px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text2 = styled.p`
  font-family: "Jalnan", sans-serif;
  font-size: 1.5rem;
  margin: 0px;
  text-align: center;
  margin-top: 24px;
`;

const Button = styled.button`
  width: 173px;
  height: 52px;
  background-color: #50cd7b;
  color: white;
  font-size: 1rem;
  font-weight: 800;
  border-radius: 26px;
  border: none;
  margin-top: 26px;
`;

const BackImg = styled.img`
  width: 100%;
  z-index: 100;
  top: 0;
`;
