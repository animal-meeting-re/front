import useProgressStore from "./store/progressStore";
import { COLORS } from "../../theme";
import styled from "styled-components";

import useApplyStore from "./store/applyStore";
const NextButton = (state) => {
  const { pageNum, setPageNum, setIsClickedLast, progress } =
    useProgressStore();
  const { choiced } = useApplyStore();
  const handleNextPage = () => {
    if (progress[pageNum]) {
      if (pageNum === 2) {
        setIsClickedLast(true);
      } else setPageNum(pageNum + 1);
    }
  };

  const handleLink = (e) => {
    if (!progress[pageNum]) e.preventDefault();
  };
  const msg = ["동의하고 진행하기", "다음", "동물상 미팅 시작하기"];
  return (
    <Containter>
      {choiced === "party" ? (
        <NextLink
          isActive={progress[pageNum] ? true : undefined}
          href="https://forms.gle/L9D9zNB7o96hAk1B9"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLink}
        >
          {msg[pageNum]}
        </NextLink>
      ) : (
        <NextBtn
          onClick={handleNextPage}
          isActive={progress[pageNum] ? true : undefined}
        >
          {msg[pageNum]}
        </NextBtn>
      )}
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
const NextLink = styled.a`
  width: 100%;
  height: 52px;
  border-radius: 26px;
  border: none;
  background-color: ${(props) =>
    props.isActive ? `${COLORS.animal_main}` : `${COLORS.line_02}`};
  color: ${COLORS.back_02};
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-content: center;
  line-height: 52px;
`;
