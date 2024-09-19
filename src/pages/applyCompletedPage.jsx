import styled from "styled-components";
import { Header } from "../components/header";
import { COLORS } from "../theme";
import { useNavigate } from "react-router-dom";

const ApplyCompletedPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };
  return (
    <Container>
      <Header />
      <InnerContainer>
        <Title>신청 완료!</Title>
        <Content>
          신청 당일 18시 이후에
          <br />
          매칭 결과가 문자로 전달됩니다:)
        </Content>
      </InnerContainer>
      <BottomBox>
        <Button onClick={goHome}>처음으로 돌아가기</Button>
      </BottomBox>
    </Container>
  );
};
export default ApplyCompletedPage;

const Container = styled.div`
  height: calc(100vh - 96px);
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  * {
    font-family: "Pretendard";
  }
`;
const Title = styled.p`
  font-weight: bold;
  font-size: 20px;
`;
const Content = styled.p`
  text-align: center;
  margin-bottom: 12px;
  font-size: 16px;
`;
const BottomBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  text-decoration-line: underline;
  color: ${COLORS.font_03};
`;
