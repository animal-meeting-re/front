import styled from "styled-components";
import { Header } from "../components/header";
import Apply from "../components/apply/apply";
import NextButton from "../components/apply/nextButton";
import useProgressStore from "../components/apply/store/progressStore";

import { useEffect } from "react";

const ApplyPage = () => {
  const { reset } = useProgressStore();
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);
  return (
    <Container>
      <Header />
      <InnerContainer>
        <Apply />
        <NextButton />
      </InnerContainer>
    </Container>
  );
};

export default ApplyPage;
const Container = styled.div``;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  * {
    font-family: "Pretendard";
  }
`;
