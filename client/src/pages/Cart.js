import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import StarIcon from "../components/StarIcon";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  color: #fff;
  margin-bottom: 200px;
`;

const ColumnsWrapper = styled.div`
  margin-top: 40px;
`;

const Box = styled.div`
  padding: 20px;
  border-bottom: 0.01em dotted yellow;
  background-color: black;
  text-transform: uppercase;
  text-color: white;
  width: 1000px;
  margin: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 100px;
`;

const ProductImageBox = styled.div`
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 130px;
    max-height: 130px;
    border-radius: 10px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const QuantityDetail = styled.div`
  display: flex;
  align-items: center;
`;

const Subtotal = styled.div`
  display: inline;
  font-size: medium;
  font-weight: 600;
`;

const CheckoutButton = styled(ButtonLink)`
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 50px;
  margin-left: 45%;
`;

const CustomDetail = styled.div`
  margin: 1px 0;
  font-weight: 200;
  font-size: 12px;
  color: white;
`;

const TotalText = styled.p`
  display: inline;
  color: yellow;
  font-size: small;
  font-weight: medium;
  text-align: right;
  margin-right: 20px;
`;

const BottomContent = styled.div`
  margin-top: 40px;
  margin-left: 80%;
`;

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/cart`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      console.log("Removing item with itemId:", itemId);
      await axios.delete(`http://localhost:8082/removefromcart/${itemId}`);
      await axios.put("http://localhost:8082/updatecarttotal");
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const addQtyToCart = async (itemId) => {
    try {
      console.log("Incrementing quantity for item with itemId:", itemId);
      await axios.put(`http://localhost:8082/addquantitytocart/${itemId}`);
      await axios.put("http://localhost:8082/updatecarttotal");
      fetchCartItems();
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  function calculateTotalPrice(unitPrice, quantity) {
    return unitPrice * quantity;
  }

  function calculateSubtotal(items) {
    return items.reduce((acc, item) => {
      const totalPrice = calculateTotalPrice(
        item.product_unitPrice,
        item.so_item_quantity
      );
      return acc + totalPrice;
    }, 0);
  }

  const handleCheckout = async () => {
    try {
      const response = await axios.get("http://localhost:8082/account");

      if (response.data.valid) {
        navigate("/checkout");
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Error checking account:", error);
    }
  };

  return (
    <PageContainer>
      <ColumnsWrapper>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <Box key={item.product_id} className="cart-item">
                  <ProductImageBox>
                    <img src={item.product_image} alt={item.product_name} />
                  </ProductImageBox>
                  <ProductInfo>
                    <h4>{item.product_name}</h4>
                    <CustomDetail>
                      Price: P{item.product_unitPrice}
                    </CustomDetail>
                    <CustomDetail>
                      Quantity: {item.so_item_quantity}
                    </CustomDetail>
                    <CustomDetail>
                      Chain: {item.so_item_jewelryChain}
                    </CustomDetail>
                    <CustomDetail>
                      Length: {item.so_item_jewelryLength}
                    </CustomDetail>
                    <CustomDetail>
                      Front Text: {item.so_item_jewelryTextFront}
                    </CustomDetail>
                    <CustomDetail>
                      Back Text: {item.so_item_jewelryTextBack}
                    </CustomDetail>
                    <CustomDetail>
                      Font: {item.so_item_jewelryFont}
                    </CustomDetail>
                  </ProductInfo>

                  <QuantityDetail>
                    <Button onClick={() => removeFromCart(item.so_item_id)}>
                      -
                    </Button>
                    <QuantityLabel>{item.so_item_quantity}</QuantityLabel>
                    <Button onClick={() => addQtyToCart(item.so_item_id)}>
                      +
                    </Button>
                  </QuantityDetail>
                  <p>
                    P
                    {calculateTotalPrice(
                      item.product_unitPrice,
                      item.so_item_quantity
                    ).toFixed(2)}
                  </p>
                  <div>
                    <StarIcon></StarIcon>
                    <StarIcon></StarIcon>
                  </div>
                </Box>
              ))}
              <BottomContent>
                <Subtotal>
                  <TotalText>SUBTOTAL:</TotalText> P
                  {calculateSubtotal(cartItems).toFixed(2)}
                </Subtotal>{" "}
                <CheckoutButton
                  onClick={handleCheckout}
                  block
                  checkout
                  size="m"
                  type="submit"
                >
                  CHECKOUT{" "}
                </CheckoutButton>
              </BottomContent>
            </>
          )}
        </div>
      </ColumnsWrapper>
    </PageContainer>
  );
}
