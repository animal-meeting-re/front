import styled from "styled-components";

import { useState, useRef } from "react";
import { COLORS } from "../../../theme";

import { SendAuthNum } from "../apis/sendAuthNum";
import { CheckAuthNum } from "../apis/checkAuthNum";

import useProgressStore from "../store/progressStore";
import useResultStore from "../../../pages/useResultStore";
const Certification = () => {
  const { setProgress } = useProgressStore();
  const { setPhoneNumber } = useResultStore();

  const phoneNumberRef = useRef(null);
  const authCodeRef = useRef(null);
  const [isPhoneFalse, setIsPhoneFalse] = useState(null);
  const [isCheckNumFalse, setIsCheckNumFalse] = useState(null);
  const [authCode, setAuthCode] = useState("");
  const validatePhoneNum = (phoneNumber) => {
    const isValid = phoneNumber.length === 11 && phoneNumber.startsWith("010");
    return isValid;
  };

  const handleSendNum = async () => {
    const phoneNumber = phoneNumberRef.current.value;
    if (!validatePhoneNum(phoneNumber)) {
      setIsPhoneFalse(true);
    } else {
      setIsPhoneFalse(false);
      setPhoneNumber(phoneNumber);
      try {
        const response = await SendAuthNum(phoneNumber);
        console.log("응답:", response);
      } catch (error) {
        console.log("코드 요청 중 오류 발생: ", error);
      }
    }
  };
  const handleAuthCodeChange = (event) => {
    setAuthCode(event.target.value);
  };
  const handleCheckNum = async () => {
    const authCode = authCodeRef.current.value;
    if (authCode.length === 4) {
      try {
        const response = await CheckAuthNum(authCode);
        console.log("응답:", response.data.data.isPassed);
        if (response.data.data.isPassed) {
          setIsCheckNumFalse(false);
          setProgress(1, true);
        } else setIsCheckNumFalse(true);
      } catch (error) {
        console.log("코드 요청 중 오류 발생: ", error);
      }
    }
  };
  return (
    <Container>
      <Title>
        <h3>휴대폰 인증</h3>
        <p>전화번호로 매칭결과(카카오톡ID)가 전달돼요!</p>
      </Title>
      <ContentBox>
        <Box>
          <Input ref={phoneNumberRef} placeholder="전화번호 - 없이 입력" />
          <Btn size="110px" onClick={handleSendNum} isActive={true}>
            인증번호 전송
          </Btn>
        </Box>
        {isPhoneFalse && <WranMSG>*전화번호 11자리를 입력해주세요</WranMSG>}
        <Box>
          <Input
            ref={authCodeRef}
            placeholder="인증번호 4자리를 입력해주세요"
            value={authCode}
            onChange={handleAuthCodeChange}
          />
          <Btn
            size="56px"
            onClick={handleCheckNum}
            isActive={authCode.length === 4}
          >
            확인
          </Btn>
        </Box>
        {isCheckNumFalse && (
          <WranMSG>*인증번호가 정확하지 않습니다. 다시 시도해주세요.</WranMSG>
        )}
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
    props.isActive ? `${COLORS.animal_main}` : `${COLORS.line_02}`};
  height: 36px;
  border-radius: 35px;
  color: ${COLORS.back_02};
  border: none;
  font-size: 15px;
  width: ${(props) => props.size};
`;

const WranMSG = styled.div`
  color: #ff4b4b;
  font-size: 14px;
  margin: 2px 0 8px 8px;
`;
