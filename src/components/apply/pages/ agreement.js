import styled from "styled-components";
import checked from "../../../assets/images/checked.png";
import unChecked from "../../../assets/images/unChecked.png";
import arrow from "../../../assets/images/rightArrow_gray.png";

import { useState, useEffect } from "react";
import { COLORS } from "../../../theme";

import useProgressStore from "../store/progressStore";
const Agreement = () => {
  const [clickAll, setClickAll] = useState(false);
  const [useClicked, setisUseClicked] = useState(false);
  const [collectionClicked, setCollectionClicked] = useState(false);
  const { setProgress } = useProgressStore();
  const handleClick = (clickChange) => {
    if (clickAll) setClickAll(false);
    clickChange((e) => !e);
  };
  const handleAllClick = () => {
    if (clickAll) {
      setClickAll(false);
      setisUseClicked(false);
      setCollectionClicked(false);
    } else {
      setClickAll(true);
      setisUseClicked(true);
      setCollectionClicked(true);
    }
  };
  useEffect(() => {
    if (useClicked && collectionClicked) setProgress(0, true);
    else setProgress(0, false);
  }, [useClicked, collectionClicked]);
  return (
    <Container>
      <Title>
        <h3>동물상 미팅 이용약관 동의</h3>
        <p>개인정보는 미팅 매칭 이후 바로 폐기됩니다</p>
      </Title>
      <ContentBox>
        <EntireBtn onClick={handleAllClick}>
          <span>전체 약관 동의</span>
          <Check src={clickAll ? checked : unChecked} />
        </EntireBtn>

        <ElseBtn onClick={() => handleClick(setisUseClicked)}>
          <LeftBox>
            <Required>[필수] </Required>
            이용약관 동의
            <Arrow src={arrow} />
          </LeftBox>
          <Check src={useClicked ? checked : unChecked} />
        </ElseBtn>
        <ElseBtn onClick={() => handleClick(setCollectionClicked)}>
          <LeftBox>
            <Required>[필수] </Required>
            개인정보 수집 및 이용약관
            <Arrow src={arrow} />
          </LeftBox>
          <Check src={collectionClicked ? checked : unChecked} />
        </ElseBtn>
      </ContentBox>
    </Container>
  );
};
export default Agreement;

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
const EntireBtn = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 52px;

  background-color: ${COLORS.back_02};

  border: 1px solid ${COLORS.line_02};
  border-radius: 28px;
  padding: 14px 20px;
  margin-bottom: 8px;

  span {
    font-size: 18px;
    font-weight: 700;
  }
  img {
    width: 28px;
    height: 28px;
  }
`;
const ElseBtn = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 52px;
  border: none;
  padding: 14px 20px;
  background-color: ${COLORS.back_02};
  margin-bottom: 4px;
`;

const Check = styled.img`
  width: 28px;
  height: 28px;
`;
const LeftBox = styled.span`
  font-size: 16px;
`;
const Required = styled.span`
  color: ${COLORS.animal_main};
  font-weight: 700;
`;
const Arrow = styled.img`
  width: 4px;
  height: 11px;
  margin-left: 4px;
`;
