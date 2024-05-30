import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";
import CartIcon from "./CartIcon";

const Bg = styled.div`
  background-color: #000;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
  font-family: "Kish", sans-serif;
`;

const Desc = styled.p`
  color: #aaa;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 0.5fr;
  gap: 40px;
  img {
    width: 300px;
    max-width: 100%;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const CartIconWithMargin = styled(CartIcon)`
  margin-right: 8px;
`;

export default function Featured() {
  const [featuredProduct, setFeaturedProduct] = useState(null);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/featuredproduct"
        );
        console.log(response.data);
        setFeaturedProduct(response.data);
      } catch (error) {
        console.error("Error fetching featured product:", error);
      }
    };

    fetchFeaturedProduct();
  }, []);

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>
                {featuredProduct ? featuredProduct.product_name : "Loading..."}
              </Title>
              <Desc>
                {featuredProduct
                  ? featuredProduct.product_description
                  : "Loading..."}
              </Desc>
              <ButtonsWrapper>
                <ButtonLink
                  to={`/product/${
                    featuredProduct ? featuredProduct.product_id : ""
                  }`}
                  outline
                  white
                  size="m"
                >
                  Read More
                </ButtonLink>
                <ButtonLink
                  to={`/product/${
                    featuredProduct ? featuredProduct.product_id : ""
                  }`}
                  size="m"
                  primary
                >
                  {" "}
                  <CartIconWithMargin /> Add To Cart
                </ButtonLink>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            <img
              src={
                featuredProduct
                  ? featuredProduct.product_image
                  : "https://i.ibb.co/VMj0Pk2/dfc23792-b238-47ac-a79c-edf18c65870f.png"
              }
              alt={featuredProduct ? featuredProduct.product_name : ""}
            />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
