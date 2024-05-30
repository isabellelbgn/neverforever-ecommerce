import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Center from "../components/Center";
import { PRODUCTS } from "../components/ChainProducts.js";
import neckGuide from "../components/assets/chains/NecklaceGuide.jpeg";
// import braceletGuide from "../components/assets/chains/HandGuide.png";
// import ringGuide from "../components/assets/chains/RingGuide.png";
import Input from "../components/Input";
import Button from "../components/Button";
import CartIcon from "../components/CartIcon";
import Swal from "sweetalert2";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  padding: 50px;
  margin-bottom: 100px;
`;

const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  img {
    border-radius: 8px;
  }
`;

const ProductCardContainerRight = styled.div`
  background-color: black;
  display: flex;
  color: white;

  flex-direction: column;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
`;

const ChainDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px 150px 150px 150px;
  gap: 20px;
  padding: 1px;
`;

const GuideDisplay = styled.div`
  align-items: center;
  margin-left: 50px;
  margin-top: 40px;
`;

const ChainCard = styled.p`
  img {
    max-height: 100px;
    border-radius: 8px;
  }
`;

const ChainName = styled.p`
  text-align: left;
  margin-top: -30px;
  margin-bottom: -50px;
  font-size: small;
  font-weight: 300;
  display: flex;
`;

const ChainRadioButton = styled.input`
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid #ea33f3;
  border-radius: 50%;
  outline: none;
  transition: 0.2s;
  display: inline;

  &:checked {
    background-color: #ea33f3;
    border: 2px solid #ea33f3;
  }
`;

const ChainNameContainer = styled.div`
  display: inline;
  margin-top: 3px;
`;

const ProductCard = styled.p`
  img {
    max-width: 100%;
    max-height: 500px;
  }
`;

const ProductDetails = styled.div`
  text-align: left;
  font-size: small;
`;

const ProductName = styled.h3`
  color: white;
  font-size: 25px;
  font-family: "Kish", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
`;

const ProductPrice = styled.p`
  font-weight: 200;
`;

const ChainLengthSelect = styled.select`
  display: flex;
  width: 100%;
  border: 1px solid #ea33f3;
  border-radius: 4px;
  background-color: black;
  color: white;
  padding: 8px;
`;

const ChainLengthOption = styled.option`
  background-color: black;
  color: white;
`;

const CustomHeader = styled.div`
  text-align: left;
  font-size: medium;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CustomName = styled.div`
  text-align: left;
  font-size: small;
  font-weight: 300;
`;

const SubCustomName = styled.div`
  text-align: left;
  font-size: small;
  font-weight: 300;
  color: #bbbfbd;
  margin-bottom: 10px;
`;

const QuantityInput = styled.input`
  display: flex;
  width: 180%;
  background-color: black;
  border: 1px solid #ea33f3;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 20px;
  color: white;
  text-align: center;
`;

const CartButton = styled(Button)`
  margin-top: 40px;
  font-weight: bold;
  height: 5%;
  width: 100%;
`;

const ErrorText = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: red;
`;

const SizeGuideButton = styled(Button)`
  font-weight: 300;
  font-size: medium;
  color: white;
  font-style: italic;
  background-color: black;
  text-decoration: underline;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
`;

const ReviewTable = styled.h1`
  background-color: black;
  border: 1px solid #ea33f3;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  width: 100%;
`;

const ReviewTitle = styled.h1`
  text-align: left;
  color: #ea33f3;
  font-weight: 200;
  font-size: 20px;
  font-style: italic;
  background-color: black;
  padding: 8px;
  width: 16%;
  margin-top: -30px;
  margin-bottom: -20px;
`;

const ReviewDetail = styled.p`
  color: white;
  margin-right: 40px;
  text-align: justify;
  font-weight: 300;
  font-size: small;
`;

const NoReview = styled.p`
  color: white;
  margin-right: 40px;
  text-align: center;
  font-weight: 300;
  font-size: small;
`;
const ReviewName = styled.p`
  color: white;
  margin-right: 40px;
  font-style: italic;
  text-align: right;
  font-weight: 300;
  font-size: small;
`;

function ProductPage() {
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.type = "text/css";
  linkElement.href =
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";

  document.head.appendChild(linkElement);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [customTextFront, setCustomTextFront] = useState("");
  const [customTextBack, setCustomTextBack] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedChainLength, setSelectedChainLength] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const { productId } = useParams();
  const [errorMessages, setErrorMessages] = useState({
    customTextFront: "",
    customTextBack: "",
    selectedFont: "",
    selectedChainLength: "",
    quantity: "",
    selectedChain: "",
  });

  const validateForm = () => {
    const errors = {
      customTextFront: "",
      customTextBack: "",
      selectedFont: "",
      selectedChainLength: "",
      quantity: "",
      selectedChain: "",
    };

    if (!customTextFront) {
      errors.customTextFront = "Please enter first name";
    }

    if (!customTextBack) {
      errors.customTextBack = "Please enter last name";
    }

    if (!selectedFont) {
      errors.selectedFont = "Please select a font";
    }

    if (!selectedChainLength) {
      errors.selectedChainLength = "Please select a chain length";
    }

    if (!quantity) {
      errors.quantity = "Please enter quantity";
    }

    if (!selectedChain) {
      errors.selectedChain = "Please select a chain type";
    }

    return errors;
  };

  const addToCart = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrorMessages(validationErrors);
      return;
    }

    Swal.fire({
      title: "Success!",
      text: "Added to cart!",
      icon: "success",
      background: "black",
      color: "white",
      confirmButtonColor: "#ea33f3",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            quantity,
            selectedChain,
            selectedChainLength,
            customTextFront,
            customTextBack,
            selectedFont,
          };

          const response = await axios.post(
            `http://localhost:8082/addtocart/${productId}`,
            data
          );

          console.log("Response from adding to cart:", response.data);
        } catch (error) {
          console.error("Error adding product to cart:", error);
        }
      }
    });
  };

  const showSizeGuide = () => {
    Swal.fire({
      imageUrl: neckGuide,
      imageHeight: 500,
      imageAlt: "A tall image",
      background: "black",
      confirmButtonColor: "#ea33f3",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/product/${productId}`
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();

    const sizeGuideButton = document.getElementById("sizeGuideButton");

    if (sizeGuideButton) {
      sizeGuideButton.addEventListener("click", showSizeGuide);
    }

    return () => {
      if (sizeGuideButton) {
        sizeGuideButton.removeEventListener("click", showSizeGuide);
      }
    };
  }, [productId]);

  useEffect(() => {
    axios
      .get(`http://localhost:8082/reviews/${productId}`)
      .then((response) => {
        setReviews(response.data.productReviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [productId]);

  if (!product) {
    return <h1>Loading...</h1>;
  }

  return (
    <Center>
      <ColumnsWrapper>
        <ProductCardContainer key={product.product_id}>
          <ProductCard>
            <img src={product.product_image} alt={product.product_name} />
          </ProductCard>
          <ReviewTable>
            <ReviewTitle>REVIEWS!</ReviewTitle>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review) => (
                  <li key={review.review_id}>
                    <ReviewDetail>{review.review_comment}</ReviewDetail>
                    <ReviewName>-{review.customer_name}</ReviewName>
                  </li>
                ))}
              </ul>
            ) : (
              <NoReview>This product has no reviews yet.</NoReview>
            )}
          </ReviewTable>
        </ProductCardContainer>

        <form onSubmit={(event) => addToCart(event)}>
          <ProductCardContainerRight>
            <ProductName>{product.product_name}</ProductName>
            <ProductDetails>
              <ProductPrice>Price: P{product.product_unitPrice}</ProductPrice>
              <i>*PRICE INCLUDES LASER ENGRAVING</i>
              <br />
              <br />
              MATERIAL: STAINLESS STEEL (HYPOALLERGENIC, WATER-RESISTANT)
              <br />
              14K GOLD-PLATED
            </ProductDetails>

            <ProductsGrid>
              <ProductCardContainerRight>
                <ErrorText>{errorMessages.selectedChain}</ErrorText>
                <ChainDisplay>
                  {PRODUCTS.map((chainProduct) => (
                    <div key={chainProduct.Cid}>
                      <label>
                        <br />
                        <ChainCard>
                          <img
                            src={chainProduct.chainImage}
                            alt={chainProduct.chainName}
                          />
                        </ChainCard>
                        <br />
                        <ChainName>
                          <ChainRadioButton
                            type="radio"
                            name="chain"
                            as={ChainRadioButton}
                            value={chainProduct.chainName}
                            checked={selectedChain === chainProduct.chainName}
                            onChange={(ev) => setSelectedChain(ev.target.value)}
                          />
                          <ChainNameContainer>
                            {" "}
                            {chainProduct.chainName.toUpperCase()}
                          </ChainNameContainer>
                        </ChainName>
                      </label>
                    </div>
                  ))}
                  <br />
                </ChainDisplay>
              </ProductCardContainerRight>

              <GuideDisplay>
                <CustomHeader>CUSTOM OPTIONS:</CustomHeader>
                <CustomName>CUSTOM TEXT:</CustomName>
                <SubCustomName>
                  FOR ENGRAVED BAR NECKLACE OR BRACELET
                </SubCustomName>

                <ProductCardContainerRight>
                  <SubCustomName> Front </SubCustomName>
                  <ErrorText>{errorMessages.customTextFront}</ErrorText>
                  <Input
                    type="text"
                    value={customTextFront}
                    onChange={(ev) => setCustomTextFront(ev.target.value)}
                  />
                  <SubCustomName> Back </SubCustomName>
                  <ErrorText>{errorMessages.customTextBack}</ErrorText>
                  <Input
                    type="text"
                    value={customTextBack}
                    onChange={(ev) => setCustomTextBack(ev.target.value)}
                  />

                  <CustomName>FONT OF CHOICE:</CustomName>

                  <SubCustomName>
                    OPTION 1: YOU MAY VISIT DAFONT.COM FOR FREE FONTS AND
                    'PASTE' THE URL BELOW.
                  </SubCustomName>
                  <ErrorText>{errorMessages.selectedFont}</ErrorText>
                  <Input
                    type="text"
                    value={selectedFont}
                    onChange={(ev) => setSelectedFont(ev.target.value)}
                  />
                </ProductCardContainerRight>

                <br />

                <SizeGuideButton
                  type="button"
                  id="sizeGuideButton"
                  onClick={showSizeGuide}
                >
                  SIZE GUIDE
                </SizeGuideButton>

                <SubCustomName for="Neck Guide">
                  CHAIN LENGTH:
                  <br /> (IN INCHES)
                </SubCustomName>

                <ErrorText>{errorMessages.selectedChainLength}</ErrorText>
                <ChainLengthSelect
                  id="chainsize"
                  value={selectedChainLength}
                  onChange={(ev) => setSelectedChainLength(ev.target.value)}
                >
                  <ChainLengthOption value="Not Selected">
                    Select Chain Length
                  </ChainLengthOption>
                  <ChainLengthOption value="14 inches">
                    14 inches
                  </ChainLengthOption>
                  <ChainLengthOption value="16 inches">
                    16 inches
                  </ChainLengthOption>
                  <ChainLengthOption value="20 inches">
                    20 inches
                  </ChainLengthOption>
                  <ChainLengthOption value="24 inches">
                    24 inches
                  </ChainLengthOption>
                  <ChainLengthOption value="30 inches">
                    30 inches
                  </ChainLengthOption>
                  <ChainLengthOption value="36 inches">
                    36 inches
                  </ChainLengthOption>
                </ChainLengthSelect>
                <br />

                <ProductsGrid>
                  <CustomName>QUANTITY:</CustomName>
                  <ErrorText>{errorMessages.quantity}</ErrorText>

                  <QuantityInput
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(ev) => setQuantity(parseInt(ev.target.value))}
                    required
                  />
                </ProductsGrid>
              </GuideDisplay>
            </ProductsGrid>
          </ProductCardContainerRight>
          <CartButton onClick={(event) => addToCart(event)} block primary>
            <CartIcon /> ADD TO CART
          </CartButton>
        </form>
      </ColumnsWrapper>
    </Center>
  );
}

export default ProductPage;
