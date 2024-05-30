import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Center from "../components/Center";
import { Link } from "react-router-dom";

const StyledContainer = styled.div`
  background-color: #000;
  margin-top: 30px;
  margin-bottom: 100px;
`;

const FilterForm = styled.form`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  border: 1px;

  select {
    margin-left: 10px;
    width: auto;
    padding: 0.75em 1.5em;
    cursor: pointer;
    border-radius: 10px;
    background-color: transparent;
    color: white;
    border: 1px solid #ea33f3;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
`;

const ProductCardContainer = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  position: relative;
  overflow: hidden;

  img {
    max-width: 100%;
    transition: filter 0.3s ease-in-out;
    border-radius: 8px;
  }

  &:hover img {
    filter: blur(5px); // Adjust the blur value as needed
  }

  .overlay {
    position: absolute;
    top: 40%;
    bottom: 50%;
    left: 50%;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transform: translate(-50%, -50%);
    color: black;
    font-weight: bold;
    font-size: medium;
    text-align: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const ProductDetails = styled.div`
  text-align: center;
`;

const ProductName = styled.h3`
  color: white;
  font-family: "Kish", sans-serif;
  font-weight: 500;
`;

const ProductPrice = styled.p`
  color: white;
  margin-top: 0;
  font-weight: 300;
`;

export default function ProductsPage() {
  // eslint-disable-next-line
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [jewelryToneFilter, setJewelryToneFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/shop");
        setAllProducts(response.data.allProducts);
        applyFilters(
          response.data.allProducts,
          sortOption,
          jewelryToneFilter,
          categoryFilter
        );
      } catch (error) {
        console.error("Error fetching new products:", error);
      }
    };

    fetchAllProducts();
  }, [sortOption, jewelryToneFilter, categoryFilter]);

  const applyFilters = (products, sortOption, jewelryTone, category) => {
    let filteredProducts = [...products];

    filteredProducts.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date_added) - new Date(a.date_added);
        case "oldest":
          return new Date(a.date_added) - new Date(b.date_added);
        case "highestPrice":
          return b.product_unitPrice - a.product_unitPrice;
        case "lowestPrice":
          return a.product_unitPrice - b.product_unitPrice;
        default:
          return 0;
      }
    });

    if (jewelryTone !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.product_jewelryTone === jewelryTone
      );
    }

    if (category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.product_category_id_fk === parseInt(category, 10)
      );
    }

    setFilteredProducts(filteredProducts);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleJewelryToneChange = (e) => {
    setJewelryToneFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <StyledContainer>
      <Center>
        <div>
          <FilterForm>
            <select onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highestPrice">Highest Price</option>
              <option value="lowestPrice">Lowest Price</option>
            </select>
            <select onChange={handleJewelryToneChange}>
              <option value="all">All Jewelry Tones</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
            <select onChange={handleCategoryChange}>
              <option value="all">All Categories</option>
              <option value="2">Necklaces</option>
              <option value="6">Bracelets</option>
              <option value="1">Rings</option>
            </select>
          </FilterForm>

          {filteredProducts?.length > 0 ? (
            <ProductsGrid>
              {filteredProducts.map((product) => (
                <ProductCardContainer key={product.product_id}>
                  <ProductCard to={`/product/${product.product_id}`}>
                    <img
                      src={product.product_image}
                      alt={product.product_name}
                    />
                    <div className="overlay">
                      <p>READ MORE</p>
                    </div>
                    <ProductName>{product.product_name}</ProductName>
                  </ProductCard>
                  <ProductDetails>
                    <ProductPrice>
                      Price: P{product.product_unitPrice}
                    </ProductPrice>
                  </ProductDetails>
                </ProductCardContainer>
              ))}
            </ProductsGrid>
          ) : (
            <div>Loading products...</div>
          )}
        </div>
      </Center>
    </StyledContainer>
  );
}
