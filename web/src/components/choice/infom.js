import styled from "styled-components";
import { COLORS } from "../../theme";

const InformUL = styled.ul`
  padding: 0px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const InformLi = styled.li`
  color: ${COLORS.font_01};
  /* background-color: aliceblue; */
  list-style: none;
`;

export const partyContent = (
  <InformUL>
    <InformLi>😿 혼자 연락해서 만나는 건 조금 부담스러워요</InformLi>
    <InformLi>🎉 자연스럽게 미팅을 할 수 있는 분위기가 필요해요</InformLi>
    <InformLi>📍 미팅 장소예약부터 약속까지, 다 해줬으면 좋겠어요</InformLi>
  </InformUL>
);

export const meetingContent = (
  <InformUL>
    <InformLi>🛝 무료로 간단하게 체험해보고 싶어요</InformLi>
    <InformLi>🤝 먼저 깊게 연락해본 후에 만나보고 싶어요</InformLi>
  </InformUL>
);
