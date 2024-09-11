import styled from "styled-components";
// import { COLORS } from "../../theme";

import useProgressStore from "./store/progressStore";
import Agreement from "./pages/ agreement";
import Certification from "./pages/certification";
import EnterInfo from "./pages/enterInfo";

const Apply = () => {
  const { pageNum, setPageNum } = useProgressStore();
  const pages = [Agreement, Certification, EnterInfo];
  const ViewPage = pages[pageNum];

  return (
    <Container>
      <ViewPage />
    </Container>
  );
};
export default Apply;

const Container = styled.div``;
