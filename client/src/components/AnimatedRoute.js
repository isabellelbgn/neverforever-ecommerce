import React from "react";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
`;

const AnimatedPageWrapper = styled.div`
  animation: ${({ fadingOut }) => (fadingOut ? fadeOut : fadeIn)} 0.3s
    ease-in-out;
`;

const AnimatedRoute = ({ element }) => {
  const location = useLocation();
  const fadingOut = location.state?.fadingOut || false;
  return (
    <AnimatedPageWrapper fadingOut={fadingOut}>{element}</AnimatedPageWrapper>
  );
};

export default AnimatedRoute;
