import React from "react";
import USPImage from "../components/assets/usp.png";
import PicOne from "../components/assets/picone.png";
import PicTwo from "../components/assets/pictwo.png";
import PicThree from "../components/assets/picthree.png";
import Instagram from "../components/assets/instagram.png";
import Featured from "../components/Featured";
import NewProducts from "../components/NewProducts";
import HeaderPic from "../components/assets/header.png";
import styled from "styled-components";

const BG = styled.div`
  margin-bottom: 100px;
  position: relative;
  overflow-x: hidden;
`;
const HeaderImage = styled.img`
  width: 100%;
`;
const StoreInfo = styled.p`
  font-size: 18px;
  line-height: 2;
  text-align: right;
  padding: 20px;
  color: #fbff54;
  width: 60%;
  margin-left: auto;
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #fbff54;
`;
const SourcingInfo = styled.div`
  text-align: center;
  font-size: 25px;
  padding: 50px;
  color: #fbff54;
  font-family: "Kish", sans-serif;
`;
const SourcingHeader = styled.h1`
  color: white;
  font-size: 40px;
`;
const ProductDesc = styled.p`
  font-family: "Kish", sans-serif;
  white-space: pre-line;
  font-style: italic;
  font-size: 18px;
  line-height: 2;
  padding: 50px;
  color: #fbff54;
  width: 60%;
`;
const USPSection = styled.div`
  width: 40%;
  padding: 50px;
  text-align: center;
`;
const USPImageStyled = styled.img`
  margin-top: 50px;
  width: 100%;
  max-width: 400px;
`;
const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 3fr 3fr 3fr 1fr;
  gap: 50px;
  margin-left: 50px;
  margin-right: 50px;
  text-color: #fbff54;
  width: 100%;
`;
const ImagesCard = styled.img`
  display: flex;
  flex-direction: column;
  padding: 30px;
  width: 100%;
`;
const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 3fr;
  color: #fbff54;
  padding: 20px;
  text-align: left;
`;
const FooterSection = styled.div`
  padding: 50px;
  margin-bottom: 20px;
`;

export default function Home({ featuredProduct, newProducts }) {
  return (
    <BG>
      <HeaderImage src={HeaderPic} alt="Header" />
      <StoreInfo>
        The store is located in the heart of the arts and crafts community, and
        its primary focus is on creating one-of-a-kind pieces of jewelry. We
        offer custom engraving in a variety of fonts, and you can select the
        type of chain you want. Bracelets, necklaces, and even rings are
        available for everybody!
      </StoreInfo>
      <Line />
      <SourcingInfo>
        <SourcingHeader>Where do we source our products?</SourcingHeader>
        <p>MEYCAUAYAN, BULACAN</p>
        <p>”Jewelry Capital of the Philippines”</p>
      </SourcingInfo>
      <Line />
      <Featured featuredProduct={featuredProduct} />
      <NewProducts newProducts={newProducts} />

      <div style={{ display: "flex" }}>
        <ProductDesc>
          100% RECYCLABLE {"\n"} {"\n"}
          Environmentally neutral means that stainless steel doesn't release any
          harmful substances or toxins when it comes in contact with water,
          soil, or air. {"\n"}
          {"\n"}
          There are also no chemicals used in this process, so there is no
          chemical waste. {"\n"}
          {"\n"}
          Even if it's not biodegradable, as long as it doesn't hurt the
          environment, it's good for the environment. STAINLESS STEEL CONTAINS
          METALS THAT ARE GOOD FOR THE SOIL. So, if anything, this material has
          positive effects on the environment.
        </ProductDesc>
        <USPSection>
          <USPImageStyled src={USPImage} alt="USP" />
        </USPSection>
      </div>

      <ImagesGrid>
        <ImagesCard src={PicOne} alt="Pic 1" />
        <ImagesCard src={PicTwo} alt="Pic 2" />
        <ImagesCard src={PicThree} alt="Pic 3" />
        <ImagesCard src={Instagram} alt="Pic 4" />
      </ImagesGrid>

      <Footer>
        <FooterSection>
          <h3>NF! </h3>
        </FooterSection>

        <FooterSection>
          <h4>Never For Ever!</h4> <br />
          shopneverforever@gmail.com <br />
          Philippines <br />
          FAQ
        </FooterSection>

        <FooterSection>
          <h4>Socials</h4> <br />
          Instagram <br />
          Facebook <br />
          Twitter
        </FooterSection>

        <FooterSection>
          <h4>About</h4> <br />
          Our Company <br />
          Our Products <br />
          Why us?
        </FooterSection>
      </Footer>
    </BG>
  );
}
