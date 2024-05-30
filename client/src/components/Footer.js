import styled from "styled-components";
import StarIcon from "./StarIcon";
import React from "react";

const StyledFooter = styled.footer`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.2rem;
  background-color: black;
  color: #fbff54;
  border-top: 1px solid #fbff54;
  display: flex;
  align-items: center;
`;

const StarIconWithMargin = styled(StarIcon)`
  display: inline;
  color: #fbff54;
`;

const Middle = styled.p`
  display: inline;
  color: #fbff54;
  margin-left: 500px;
  margin-right: auto;
`;

const Logo = styled.h1`
  display: inline;
  margin: 0;
  font-weight: normal;
  font-size: 1.1rem;
  font-family: "Kish", sans-serif;
  color: white;
`;

const Corner = styled.div`
  display: inline;
  align-items: left;
  margin-left: 50px;
`;

function Footer() {
  return (
    <StyledFooter>
      <Corner>
        <StarIconWithMargin /> <Logo>NF!</Logo>
      </Corner>
      <Middle>© Copyright 2020 Never for Ever!</Middle>
    </StyledFooter>
  );
}

export default Footer;
