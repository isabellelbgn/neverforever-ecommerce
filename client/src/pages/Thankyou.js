import React from "react";
import styled from "styled-components";
import ThankYouNecklace from "../components/assets/ThankYouNecklace.png";
import ButtonLink from "../components/ButtonLink";

const StyledContainer = styled.div`
  background-color: #000;
  margin-bottom: 100px;
  text-align: center;
`;

const NecklaceImg = styled.p`
  img {
    width: 500px;
    height: 500px;
    border-radius: 8px;
  }
`;

const ButtonBottomSyle = styled(ButtonLink)`

font-size: small;
color: white;
font-weight: bold;
text-transform: uppercase;
display: inline;
}
`;

const Header = styled.p`
  color: white;
  font-size: 25px;
  font-weight: bold;
  margin-top: -30px;
  margin-bottom: 50px;
`;

export default function Thankyou() {
  return (
    <StyledContainer>
      <NecklaceImg>
        <img src={ThankYouNecklace} alt="guide" />
      </NecklaceImg>
      <Header>THANK YOU FOR SHOPPING WITH US!</Header>
      <ButtonBottomSyle to="/" checkout size={"m"}>
        BACK TO HOMEPAGE
      </ButtonBottomSyle>
    </StyledContainer>
  );
}
