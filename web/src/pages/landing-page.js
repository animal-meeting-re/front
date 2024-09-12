import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LandingPage1 } from "../components/landing/landing-page1";
import { LandingPage2 } from "../components/landing/landing-page2";
import { LandingPage3 } from "../components/landing/landing-page3";
import { useSwipeable } from "react-swipeable";
import styled, { keyframes } from "styled-components";

export const LandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const step = searchParams.get("step") || "1";
  const [direction, setDirection] = useState("");

  useEffect(() => {
    if (!step) {
      setSearchParams({ step: "1" }, { replace: true });
    }
  }, [step, setSearchParams]);

  const handleSwipeLeft = () => {
    if (step === "1") {
      setDirection("left");
      navigate("/?step=2");
    } else if (step === "2") {
      setDirection("left");
      navigate("/?step=3");
    }
  };

  const handleSwipeRight = () => {
    if (step === "3") {
      setDirection("right");
      navigate("/?step=2");
    } else if (step === "2") {
      setDirection("right");
      navigate("/?step=1");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  let content;
  if (step === "1") {
    content = <LandingPage1 />;
  } else if (step === "2") {
    content = <LandingPage2 />;
  } else if (step === "3") {
    content = <LandingPage3 />;
  } else {
    content = <LandingPage1 />; // Default 값으로 첫 페이지
  }

  return (
    <SwipeContainer {...handlers} direction={direction}>
      {content}
    </SwipeContainer>
  );
};

// 슬라이드 애니메이션
const slideLeft = keyframes`
  0% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(0%);
  }
`;

const slideRight = keyframes`
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
`;

const SwipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: ${(props) => (props.direction === "left" ? slideLeft : slideRight)}
    0.5s ease;
`;
