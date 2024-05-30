import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";

const StyledContainer = styled.div`
  background-color: #000;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 1.5em;
  font-weight: 500;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
`;

const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border: 1px solid #fbff54;
  border-radius: 8px;

  &:hover {
    background-color: #ea33f3;
    transition: background-color 0.7s;
  }
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  img {
    max-width: 100%;
    max-height: 150px;
  }
`;

const ProductDetails = styled.div`
  text-align: center;
`;

const ProductName = styled.h3`
  color: #fff;
  font-family: "Kish", sans-serif;
  font-weight: 400;
`;

const ProductPrice = styled.p`
  margin-top: 0;
  color: #fbff54;
`;

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/newproducts");
        setNewProducts(response.data.newProducts);
      } catch (error) {
        console.error("Error fetching new products:", error);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <StyledContainer>
      <Center>
        <div>
          <Title>New Products</Title>
          <ProductsGrid>
            {newProducts.map((product) => (
              <ProductCardContainer key={product.product_id}>
                <ProductCard to={`/product/${product.product_id}`}>
                  <img src={product.product_image} alt={product.product_name} />
                  <ProductName>{product.product_name}</ProductName>
                </ProductCard>
                <ProductDetails>
                  <ProductPrice>
                    Price: P{product.product_unitPrice}
                  </ProductPrice>

                  <ButtonLink
                    to={`/product/${product.product_id}`}
                    outline
                    white
                    size="m"
                  >
                    Read More
                  </ButtonLink>
                </ProductDetails>
              </ProductCardContainer>
            ))}
          </ProductsGrid>
        </div>
      </Center>
    </StyledContainer>
  );
}
