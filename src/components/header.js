import { COLORS } from "../theme";
import styled from "styled-components";

import backArrow from "../assets/images/backArrow.png";

export const Header = ({ title }) => {
  return (
    <Container>
      <Back src={backArrow}></Back>
      <Title>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 48px;
  background-color: white;
  display: flex;
  align-items: center;
`;

const Back = styled.img`
  width: 20px;
  height: auto;
  margin-left: 16px;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin: 0;
  font-family: "jalnan";
  color: ${COLORS.main};
`;
