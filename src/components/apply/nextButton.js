import useProgressStore from "./store/progressStore";
import { COLORS } from "../../theme";
import styled from "styled-components";

const NextButton = (state) => {
  const { pageNum, setPageNum, setIsClickedLast, progress } =
    useProgressStore();
  const handleNextPage = () => {
    if (progress[pageNum]) {
      if (pageNum === 2) {
        setIsClickedLast(true);
      } else setPageNum(pageNum + 1);
    }
  };

  const msg = ["동의하고 진행하기", "다음", "동물상 미팅 시작하기"];
  return (
    <Containter>
      <NextBtn
        onClick={handleNextPage}
        isActive={progress[pageNum] ? true : undefined}
      >
        {msg[pageNum]}
      </NextBtn>
    </Containter>
  );
};
export default NextButton;

const Containter = styled.div``;
const NextBtn = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 26px;
  border: none;
  background-color: ${(props) =>
    props.isActive ? `${COLORS.animal_main}` : `${COLORS.line_02}`};
  color: ${COLORS.back_02};
  font-size: 18px;
  font-weight: bold;
`;
