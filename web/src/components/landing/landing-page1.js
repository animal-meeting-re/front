import styled from "styled-components";
import { COLORS } from "../../theme";

import phone from "../../assets/images/phone.png";
import process1 from "../../assets/images/process1.png";
import { useNavigate } from "react-router-dom";

export const LandingPage1 = () => {
  const navigate = useNavigate();
  const skip = () => {
    navigate("/?step=3");
  };
  return (
    <Container>
      <Text1>동물상 측정</Text1>
      <TextContainer>
        <Text2>AI가 측정하는</Text2>
        <Text2>
          당신의{" "}
          <span
            style={{
              color: "#50CD7B",
            }}
          >
            동물상
          </span>
          을
        </Text2>
        <Text2>확인해보세요!</Text2>
      </TextContainer>
      <Phone src={phone}></Phone>
      <Explain>
        약 7000개의 연예인 사진을 학습한 <br /> AI 모델이 닮은 동물상의 비율까지
        측정!
      </Explain>
      <Process src={process1}></Process>
      <Skip onClick={skip}>건너뛰기</Skip>
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

const Text1 = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${COLORS.main};
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
`;

const Phone = styled.img`
  width: 200px;
  height: 350px;
`;

const Explain = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #000;
  text-align: center;
`;

const Process = styled.img`
  width: 48px;
  /* height: 19px; */
`;

const Skip = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${COLORS.font03};
  margin-top: 20px;
  text-decoration: underline;
`;
