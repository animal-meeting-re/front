import styled from "styled-components";
import { Header } from "../components/header";
import Choice from "../components/choice/choice";

const MeetingChoice = () => {
  return (
    <Container>
      <Header />
      <Choice />
    </Container>
  );
};
export default MeetingChoice;

const Container = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center; */
`;
