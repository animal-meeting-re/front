import styled from "styled-components";

import { useRef, useEffect } from "react";
import { COLORS } from "../../../theme";

import useProgressStore from "../store/progressStore";
import useResultStore from "../../../pages/useResultStore";
import { ApplyMeeting } from "../apis/applyMeeting";
import { useNavigate } from "react-router-dom";

import arrow from "../../../assets/images/downArrow.png";
const EnterInfo = () => {
  const { isClickedLast, setProgress } = useProgressStore();
  const { phonNum, userGender, animal } = useResultStore();
  const navigate = useNavigate();
  const kakaoID = useRef(null);
  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);
  // useEffect(() => {
  //   setProgress(2, true);
  // }, []);

  const changeAnimalToENG = (ani) => {
    switch (ani) {
      case "강아지":
        return "DOG";
      case "고양이":
        return "CAT";
      case "토끼":
        return "RABBIT";
      case "사막여우":
        return "DESERT_FOX";
      case "사슴":
        return "DEER";
      case "햄스터":
        return "HAMSTER";
      case "공룡":
        return "DINOSAUR";
      case "곰":
        return "BEAR";
      case "늑대":
        return "WOLF";
      default:
        return "UNKOWN";
    }
  };

  useEffect(() => {
    if (
      phonNum &&
      userGender &&
      animal &&
      kakaoID &&
      selectRef1 &&
      selectRef2
    ) {
      setProgress(2, true);
    }
  }, [kakaoID, selectRef1, selectRef2]);
  useEffect(() => {
    const applyMeetingAsync = async () => {
      if (isClickedLast) {
        const requestData = [
          {
            phoneNumber: phonNum,
            kakao: kakaoID.current.value,
            gender: userGender,
            firstAnimalType: selectRef1.current.value,
            secondAnimalType: selectRef2.current.value,
            selfAnimalType: changeAnimalToENG(animal),
          },
        ];
        try {
          const response = await ApplyMeeting(requestData);
          console.log("응답:", response);
          navigate("/completed");
        } catch (error) {
          console.log("코드 요청 중 오류 발생: ", error);
        }
      }
    };

    applyMeetingAsync();
  }, [isClickedLast]);

  return (
    <Container>
      <Title>
        <h3>기본 정보 입력</h3>
      </Title>
      <ContentBox>
        <Box>
          <label>본인 동물상</label>
          <Animal value={`${animal} 상`} disabled />
        </Box>
        <Box>
          <label>카카오톡ID</label>
          <Input placeholder="매칭 상대에게 전달됩니다" ref={kakaoID} />
        </Box>
        <label>이상형 동물상</label>
        <SelectBox>
          <select ref={selectRef1}>
            <option selected disabled hidden>
              1순위 선택
            </option>
            <option value="DOG">강아지</option>
            <option value="CAT">고양이</option>
            <option value="RABBIT">토끼</option>
            <option value="DESERT_FOX">사막여우</option>
            <option value="DEER">사슴</option>
            <option value="HAMSTER">햄스터</option>
            <option value="DINOSAUR">공룡</option>
            <option value="BEAR">곰</option>
            <option value="WOLF"> 늑대</option>
          </select>
          <select ref={selectRef2}>
            <option selected disabled hidden>
              2순위 선택
            </option>
            <option value="DOG">강아지</option>
            <option value="CAT">고양이</option>
            <option value="RABBIT">토끼</option>
            <option value="DESERT_FOX">사막여우</option>
            <option value="DEER">사슴</option>
            <option value="HAMSTER">햄스터</option>
            <option value="DINOSAUR">공룡</option>
            <option value="BEAR">곰</option>
            <option value="WOLF"> 늑대</option>
          </select>
        </SelectBox>
      </ContentBox>
    </Container>
  );
};
export default EnterInfo;

const Container = styled.div`
  width: 100%;
`;
const Title = styled.div`
  margin-bottom: 19px;
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
`;
const ContentBox = styled.div`
  margin-bottom: 248px;
  display: flex;
  flex-direction: column;
  label {
    margin-left: 8px;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 2px;
  }
`;
const Box = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
`;
const Animal = styled.input`
  border: 1px solid ${COLORS.line_01};
  padding: 10px 21px;
  height: 70%;
  border-radius: 24px;
  color: #000000;
  font-weight: 600;
`;
const Input = styled.input`
  border: 1px solid ${COLORS.line_01};
  padding: 10px 21px;
  height: 70%;
  border-radius: 24px;
  background-color: ${COLORS.back_02};

  ::placeholder {
    color: black;
    font-size: 15px;
  }
`;

const SelectBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #505050;

  select {
    width: 48%;
    height: 44px;
    border-radius: 24px;
    border: 1px solid ${COLORS.line_01};
    padding: 10px 12px 10px 20px;
    appearance: none;

    background: url(${arrow}) no-repeat 86% 50%;
    background-color: white;
    background-size: 16px;

    padding-right: 40px;
  }
`;
