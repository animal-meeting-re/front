import styled from "styled-components";
import { COLORS } from "../../theme";

import phone2 from "../../assets/images/phone2.png";
import process2 from "../../assets/images/process2.png";

export const LandingPage2 = () => {
  return (
    <Container>
      <Text1>동물상 미팅</Text1>
      <TextContainer>
        <Text2>동물상으로 만나는</Text2>
        <Text2>
          <span
            style={{
              color: "#50CD7B",
            }}
          >
            나만의{" "}
          </span>
          이상형을
        </Text2>
      </TextContainer>
      <Phone src={phone2}></Phone>
      <Explain>
        측정한 동물상을 바탕으로 <br /> 선호하는 이상형과 미팅까지!
      </Explain>
      <Process src={process2}></Process>
      <Skip>건너뛰기</Skip>
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
  height: 373px;
  margin-top: 40px;
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

const Skip = styled.a`
  font-size: 1rem;
  font-weight: 600;
  color: ${COLORS.font03};
  margin-top: 20px;
  text-decoration: underline;
`;
