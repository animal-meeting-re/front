import styled from "styled-components";

import { useState, useEffect } from "react";
import { COLORS } from "../../../theme";

import useProgressStore from "../store/progressStore";
const Certification = () => {
  const { setProgress } = useProgressStore();

  return (
    <Container>
      <Title>
        <h3>휴대폰 인증</h3>
        <p>전화번호로 매칭결과(카카오톡ID)가 전달돼요!</p>
      </Title>
      <ContentBox>
        <Box>
          <Input placeholder="전화번호 - 없이 입력" />
          <Btn size="110px" value="send">
            인증번호 전송
          </Btn>
        </Box>
        <Box>
          <Input placeholder="인증번호 4자리를 입력해주세요" />
          <Btn size="56px" value="check">
            확인
          </Btn>
        </Box>
      </ContentBox>
    </Container>
  );
};
export default Certification;

const Container = styled.div`
  width: 100%;
`;
const Title = styled.div`
  margin-bottom: 20px;
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  p {
    font-size: 15px;
    margin: 0;
  }
`;
const ContentBox = styled.div`
  margin-bottom: 248px;
`;
const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  border-radius: 35px;
  border: 1px solid ${COLORS.line_02};
  padding: 0 4px 0 16px;
  box-sizing: border-box;
  margin-bottom: 8px;
`;
const Input = styled.input`
  border: none;
  width: 60%;
  height: 70%;
  ::placeholder {
    color: #777777;
    font-size: 15px;
  }
`;
const Btn = styled.button`
  background-color: ${(props) =>
    props.value === "send" ? `${COLORS.animal_main}` : `${COLORS.line_02}`};
  height: 36px;
  border-radius: 35px;
  color: ${COLORS.back_02};
  border: none;
  font-size: 15px;
  width: ${(props) => props.size};
`;
