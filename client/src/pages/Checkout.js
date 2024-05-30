import styled from "styled-components";
import Center from "../components/Center";
import ButtonLink from "../components/ButtonLink";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";
import Input from "../components/Input";
import Swal from "sweetalert2";

const StyledContainer = styled.div`
  background-color: #000;
  margin-bottom: 100px;
`;

const ColumnsWrapper = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  color: #fff;
`;

const Box = styled.div`
  padding: 2px;
  border-left: 0.01em dotted #fbff54;
`;

const BoxLeft = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const LeftContainerBox = styled.td`
  background-color: black;
  border: 2px solid #ea33f3;
  padding: 20px;
  border-radius: 4px;
  width: 100%;
`;

const TotalContainerBox = styled.td`
  display: flex;
  flex-direction: column;
  background-color: black;
  border-top: 0.01em dotted yellow;
  border-bottom: 0.01em dotted yellow;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10%;
  margin-right: auto;
  padding: 40px;
  width: 70%;
  gap: 20px;
`;

const TotalContainerBox1 = styled.td`
  display: flex;
  flex-direction: column;
  background-color: black;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 70%;
  margin-left: 10%;
  margin-right: auto;
  padding: 40px;
`;

const ContainerBox = styled.td`
  display: flex;
  margin-top: 20px;
`;

const ProductInfoCell = styled.td`
  display: flex;
  align-items: center;
`;

const ProductImageBox = styled.div`
  width: 200px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100px;
    max-height: 100px;
    border-radius: 10px;
  }
`;

const ProductDetails = styled.div`
  text-align: left;
  font-weight: 200;
  font-size: 12px;
`;

const ProductName = styled.div`
  font-weight: 600;
  text-transform: uppercase;
`;

const QuantityLabel = styled.span`
  display: inline;
  font-weight: 300;
  font-size: small;
  align-items: center;
`;

const PriceLabel = styled.span`
  font-weight: 600;
  display: inline;
  font-size: small;
  text-align: center;
`;

const ApplyButton = styled.button`
  margin-left: 30px;
  background-color: black;
  color: yellow;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline;
`;

const LeftTitles = styled.div`
  background-color: black;
  color: yellow;
  font-weight: bold;
  font-size: small;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: inline;
`;

const TextInLeftContainerBox = styled.div`
  color: white;
  font-weight: 300;
  font-size: 12px;
  border: none;
  cursor: pointer;
  align-items: left;
  display: inline;
  width: 45%;
  margin-left: 10px;
`;

const TextInRightContainerBox = styled.div`
  color: white;
  font-weight: bold;
  margin-left: 45%;
  font-size: 12px;
  border: none;
  align-items: right;
  cursor: pointer;
  display: inline;
`;

const TextInCenterContainerBox = styled.div`
  color: white;
  font-weight: small;
  font-size: 12px;
  border: none;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
`;

const ProofOfPaymentText = styled.div`
  color: #ea33f3;
  display: inline;
`;

const InputContainer = styled.div`
  position: relative;
  width: 2000%;
  gap: 20px;
`;

const DiscountContainer = styled.div`
  position: flex;
`;

const CheckoutInput = styled(Input)`
  margin-left: 20px;
  width: 76%;
  display: inline;
`;

const NameHolder = styled.div`
  display: flex;
  gap: 10px;
`;

const RadioHolder = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 10px;
`;

const Totals = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
`;

const TotalsHead = styled.div`
  font-size: small;
  color: grey;
`;

const TotalsPrice = styled.div`
  color: white;
  font-weight: 600;
  font-size: small;
`;

const OverallTotal = styled.div`
  color: white;
  font-weight: 700;
  font-size: medium;
`;

const InfoInput = styled(Input)`
  gap: 20px;
  width: 100%;
`;

const ChainRadioButton = styled.input`
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
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

const ButtonsBottom = styled.div`
  justify-content: space-between;
  display: flex;
  margin-top: 100px;
`;

const ButtonBottomSyle = styled(ButtonLink)`
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  display: inline;
`;

const ReturnButton = styled.div`
  border: 1px solid black;
  margin-left: 50px;
  margin-top: 10px;
`;
const InputTextTop = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: red;
  position: absolute;
  top: -18px;
`;

const StyledInput = styled(InfoInput)`
  width: 100%;
`;

const ContainerTextTop = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: red;
`;

export default function CheckoutPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressTwo, setStreetAddressTwo] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [discountValidation, setDiscountValidation] = useState({
    code: "",
    percentage: 0,
    isValid: true,
  });

  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);

  const [shippingMethodError, setShippingMethodError] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNum: "",
    streetAddress: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
    shippingMethod: "",
    paymentMethod: "",
  });

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8082/cart");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartItems();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrorMessages(validationErrors);
      setShippingMethodError(validationErrors.shippingMethod);
      setPaymentMethodError(validationErrors.paymentMethod);
      return;
    }

    try {
      const checkoutData = {
        firstName,
        lastName,
        email,
        contactNum,
        streetAddress,
        streetAddressTwo,
        city,
        province,
        zip,
        notes,
        shippingMethod,
        paymentMethod,
        grandTotal: grandTotal.toFixed(2),
        discountValidation,
      };

      const response = await axios.post(
        "http://localhost:8082/checkout",
        checkoutData
      );

      console.log(response.data.message);
      console.log("About to navigate to /thankyou");
      window.location.href = "/thankyou";
    } catch (error) {
      console.error("Error during checkout:", error.response.data.error);
    }
  };

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      contactNum: "",
      streetAddress: "",
      city: "",
      province: "",
      zip: "",
      notes: "",
      shippingMethod: "",
      paymentMethod: "",
    };

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!contactNum.trim()) {
      errors.contactNum = "Contact number is required";
    }

    if (!streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!city.trim()) {
      errors.city = "City is required";
    }
    if (!province.trim()) {
      errors.province = "Province is required";
    }
    if (!zip.trim()) {
      errors.zip = "Zip code is required";
    }

    if (!shippingMethod) {
      console.log(shippingMethod);
      errors.shippingMethod = "Please select a shipping method";
    }

    if (!paymentMethod) {
      errors.paymentMethod = "Please select a payment method";
    }

    return errors;
  };

  const isValidEmail = (email) => {
    // Add your email validation logic here
    return true; // Replace with your actual validation logic
  };

  useEffect(() => {
    if (discountValidation.isValid) {
      setDiscountValidation(discountValidation);
    }
  }, [discountValidation]);

  const handleApplyDiscount = async () => {
    console.log("Apply button clicked");
    try {
      console.log("Applying discount...");
      const discountResponse = await axios.post(
        "http://localhost:8082/validateDiscount",
        { discountCode: discountValidation.code }
      );

      console.log("Before setting state:", discountValidation);

      console.log("Discount response:", discountResponse.data);

      if (discountResponse.data.valid) {
        const discountPercentage = parseFloat(discountResponse.data.percentage);
        setDiscountValidation((prevDiscount) => ({
          ...prevDiscount,
          percentage: discountPercentage,
          isValid: true,
        }));

        Swal.fire({
          icon: "success",
          title: "Discount Applied",
          text: `Discount of ${discountPercentage}% applied successfully.`,
          showConfirmButton: false,
          timer: 1500,
          background: "black",
          color: "white",
          confirmButtonColor: "#ea33f3",
        });

        const updatedGrandTotal = calculateGrandTotal();
        setGrandTotal(updatedGrandTotal);
        console.log("After setting state:", discountValidation);
      } else {
        setDiscountValidation((prevDiscount) => ({
          ...prevDiscount,
          isValid: false,
        }));

        Swal.fire({
          icon: "error",
          title: "Invalid Discount",
          text: "The discount code is not valid.",
          background: "black",
          color: "white",
          confirmButtonColor: "#ea33f3",
        });
      }
    } catch (error) {
      console.error("Error validating discount:", error);
    }
  };

  function calculateTotalPrice(unitPrice, quantity) {
    return unitPrice * quantity;
  }

  function calculateSubtotal(items) {
    return items.reduce((acc, item) => {
      const quantityInCart = item.so_item_quantity;
      const totalPrice = calculateTotalPrice(
        item.product_unitPrice,
        quantityInCart
      );
      return acc + totalPrice;
    }, 0);
  }

  function getShippingFee(method) {
    switch (method) {
      case "Pickup":
        return 0;
      case "Delivery":
        return 70;
      case "Courier":
        return 160;
      default:
        return 0;
    }
  }

  function calculateGrandTotal() {
    const subtotal = calculateSubtotal(cartItems);
    const selectedShippingFee = getShippingFee(shippingMethod);

    const discountPercentage =
      parseFloat(discountValidation.percentage) / 100 || 0;
    console.log(discountPercentage);

    const discountAmount = subtotal * discountPercentage;

    console.log("Subtotal:", subtotal);
    console.log("Discount Amount:", discountAmount);

    const discountedTotal = subtotal - discountAmount;

    if (!shippingMethod) {
      console.log("Grand Total without Shipping Fee:", discountedTotal);
      return discountedTotal;
    }

    const grandTotalWithShipping = discountedTotal + selectedShippingFee;
    console.log("Grand Total with Shipping Fee:", grandTotalWithShipping);
    return grandTotalWithShipping;
  }

  useEffect(() => {
    const updatedGrandTotal = calculateGrandTotal();
    console.log("Updated Grand Total:", updatedGrandTotal);
    setGrandTotal(updatedGrandTotal);
  }, [cartItems, discountValidation, shippingMethod]);

  return (
    <>
      <div id="swup" className="transition-fade">
        <StyledContainer>
          <Center>
            <ColumnsWrapper>
              <BoxLeft>
                <h3>BILLING DETAILS</h3>

                {!!cartItems?.length && (
                  <form onSubmit={handleCheckout}>
                    <NameHolder>
                      <LeftTitles>
                        NAME:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          name="firstName"
                          onChange={(ev) => setFirstName(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              firstName: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.firstName}</InputTextTop>
                      </InputContainer>

                      <div style={{ marginLeft: "10px" }}></div>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          name="lastName"
                          onChange={(ev) => setLastName(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({ ...errorMessages, lastName: "" })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.lastName}</InputTextTop>
                      </InputContainer>

                      <div style={{ marginRight: "10px" }}></div>
                    </NameHolder>

                    <NameHolder>
                      <LeftTitles>
                        EMAIL ADDRESS:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>
                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder="@gmail.com"
                          value={email}
                          name="email"
                          onChange={(ev) => setEmail(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              email: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.email}</InputTextTop>
                      </InputContainer>

                      <div style={{ marginLeft: "10px" }}></div>
                      <LeftTitles>
                        PHONE:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder="(+63)"
                          value={contactNum}
                          name="contactNum"
                          onChange={(ev) => setContactNum(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              contactNum: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.contactNum}</InputTextTop>
                      </InputContainer>
                      <div style={{ marginRight: "10px" }}></div>
                    </NameHolder>

                    <CityHolder>
                      <LeftTitles>
                        STREET ADDRESS:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="textarea"
                          placeholder="House Number & Street Name"
                          value={streetAddress}
                          name="streetAddress"
                          onChange={(ev) => setStreetAddress(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              streetAddress: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>
                          {errorMessages.streetAddress}
                        </InputTextTop>
                      </InputContainer>

                      <div style={{ marginLeft: "10px" }}></div>

                      <InputContainer>
                        <StyledInput
                          type="textarea"
                          placeholder="Apartment, Suite, Unit, etc. (Optional)"
                          value={streetAddressTwo}
                          name="streetAddressTwo"
                          onChange={(ev) =>
                            setStreetAddressTwo(ev.target.value)
                          }
                        />
                      </InputContainer>

                      <div style={{ marginRight: "10px" }}></div>
                    </CityHolder>
                    <CityHolder>
                      <LeftTitles>
                        CITY:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder=""
                          value={city}
                          name="city"
                          onChange={(ev) => setCity(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              city: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.city}</InputTextTop>
                      </InputContainer>

                      <div style={{ marginLeft: "10px" }}></div>
                      <LeftTitles>
                        PROVINCE:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder=""
                          value={province}
                          name="province"
                          onChange={(ev) => setProvince(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              province: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.province}</InputTextTop>
                      </InputContainer>

                      <div style={{ marginLeft: "10px" }}></div>
                      <LeftTitles>
                        ZIP CODE:<span style={{ color: "red" }}>*</span>
                      </LeftTitles>

                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder=""
                          value={zip}
                          name="zip"
                          onChange={(ev) => setZip(ev.target.value)}
                          onFocus={() =>
                            setErrorMessages({
                              ...errorMessages,
                              zip: "",
                            })
                          }
                          required
                        />
                        <InputTextTop>{errorMessages.zip}</InputTextTop>
                      </InputContainer>
                      <div style={{ marginRight: "10px" }}></div>
                    </CityHolder>

                    <NameHolder>
                      <LeftTitles>ORDER NOTES:</LeftTitles>
                      <InputContainer>
                        <StyledInput
                          type="text"
                          placeholder="Notes about your order, e.g. special notes for delivery (Optional)"
                          value={notes}
                          name="notes"
                          onChange={(ev) => setNotes(ev.target.value)}
                        />
                      </InputContainer>
                      <div style={{ marginRight: "10px" }}></div>
                    </NameHolder>

                    <br />
                    <br />
                    <LeftTitles>
                      DELIVERY/SHIPPING METHOD:
                      <span style={{ color: "red" }}>*</span>
                    </LeftTitles>
                    <ContainerTextTop>{shippingMethodError}</ContainerTextTop>
                    <ContainerBox required>
                      <LeftContainerBox>
                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            value="Pickup"
                            name="shippingMethod"
                            onChange={(ev) => {
                              setShippingMethod(ev.target.value, () =>
                                validateForm()
                              );
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                shippingMethod: "",
                              })
                            }
                          />

                          <TextInLeftContainerBox>
                            PICK-UP (AN ADDRESS WILL BE SENT TO YOU ON THE DAY
                            OF YOUR ORDER’S AVAILABILITY)
                          </TextInLeftContainerBox>
                          <TextInRightContainerBox>
                            FREE
                          </TextInRightContainerBox>
                        </RadioHolder>
                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            value="Delivery"
                            name="shippingMethod"
                            onChange={(ev) => {
                              setShippingMethod(ev.target.value);
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                shippingMethod: "",
                              })
                            }
                          />{" "}
                          <TextInLeftContainerBox>
                            DELIVERY (VIA GRAB)
                          </TextInLeftContainerBox>
                          <TextInRightContainerBox>
                            P70.00
                          </TextInRightContainerBox>
                        </RadioHolder>

                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            value="Courier"
                            name="shippingMethod"
                            onChange={(ev) => {
                              setShippingMethod(ev.target.value);
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                shippingMethod: "",
                              })
                            }
                          />

                          <TextInLeftContainerBox>
                            STANDARD SHIPPING (COURIER - OUTSIDE DAVAO CITY
                            ONLY)
                          </TextInLeftContainerBox>
                          <TextInRightContainerBox>
                            P160.00
                          </TextInRightContainerBox>
                        </RadioHolder>
                      </LeftContainerBox>
                    </ContainerBox>
                    <br />
                    <br />

                    <LeftTitles>
                      PAYMENT OPTIONS:<span style={{ color: "red" }}>*</span>
                    </LeftTitles>

                    <ContainerTextTop>{paymentMethodError}</ContainerTextTop>
                    <ContainerBox>
                      <LeftContainerBox>
                        <TextInCenterContainerBox>
                          ONLINE TRANSFER / OVER-THE-COUNTER
                          <br />
                          AN***A M**E****Z
                          <br />
                          0923 293 7651
                          <br />
                          <br />
                          INSTRUCTIONS ON WHERE TO SEND{" "}
                          <ProofOfPaymentText>
                            PROOF OF PAYMENT
                          </ProofOfPaymentText>{" "}
                          WILL BE SENT VIA E-MAIL ONCE YOU HAVE COMPLETED THIS
                          ORDER. THANK YOU
                        </TextInCenterContainerBox>

                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            value="GCash"
                            name="paymentMethod"
                            onChange={(ev) => {
                              console.log(
                                "Selected payment method:",
                                ev.target.value
                              );
                              setPaymentMethod(ev.target.value);
                              validateForm();
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                paymentMethod: "",
                              })
                            }
                            required
                          />
                          <TextInLeftContainerBox>GCASH</TextInLeftContainerBox>
                        </RadioHolder>

                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            value="BPI"
                            name="paymentMethod"
                            onChange={(ev) => {
                              console.log(
                                "Selected payment method:",
                                ev.target.value
                              );
                              setPaymentMethod(ev.target.value);
                              validateForm();
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                paymentMethod: "",
                              })
                            }
                          />
                          <TextInLeftContainerBox>BPI</TextInLeftContainerBox>
                        </RadioHolder>

                        <RadioHolder>
                          <ChainRadioButton
                            type="radio"
                            placeholder=""
                            value="COD"
                            name="paymentMethod"
                            onChange={(ev) => {
                              console.log(
                                "Selected payment method:",
                                ev.target.value
                              );
                              setPaymentMethod(ev.target.value);
                              validateForm();
                            }}
                            onFocus={() =>
                              setErrorMessages({
                                ...errorMessages,
                                paymentMethod: "",
                              })
                            }
                          />
                          <TextInLeftContainerBox>COD</TextInLeftContainerBox>
                        </RadioHolder>
                      </LeftContainerBox>
                    </ContainerBox>
                  </form>
                )}
              </BoxLeft>
              <Box>
                {!cartItems?.length && <div>Your cart is empty</div>}
                {cartItems?.length > 0 && (
                  <Table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>QTY</th>
                        <th>PRICE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => {
                        const quantityInCart = item.so_item_quantity;
                        const totalPrice = calculateTotalPrice(
                          item.product_unitPrice,
                          quantityInCart
                        );

                        return (
                          <tr key={item.product_id}>
                            <ProductInfoCell>
                              <ProductImageBox>
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                />
                              </ProductImageBox>
                              <ProductDetails>
                                <ProductName>{item.product_name}</ProductName>
                                <br />
                                PACKAGING: FREE BOX
                                <br />
                                Chain:
                                {item.so_item_jewelryChain}
                                <br />
                                {item.so_item_jewelryLength}
                                <br />
                                Front Text: {item.so_item_jewelryTextFront}
                                <br />
                                Back Text: {item.so_item_jewelryTextBack}
                                <br />
                                {item.so_item_jewelryFont}
                              </ProductDetails>
                            </ProductInfoCell>
                            <td>
                              <QuantityLabel>{quantityInCart}</QuantityLabel>
                            </td>
                            <td>
                              <PriceLabel>P{totalPrice.toFixed(2)}</PriceLabel>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
                <DiscountContainer>
                  <CheckoutInput
                    type="text"
                    placeholder="DISCOUNT CODE"
                    value={discountValidation.code}
                    name="discountCode"
                    onChange={(ev) =>
                      setDiscountValidation({
                        ...discountValidation,
                        code: ev.target.value,
                      })
                    }
                  />
                  <ApplyButton onClick={handleApplyDiscount}>APPLY</ApplyButton>
                </DiscountContainer>

                <TotalContainerBox>
                  <Totals>
                    <div>
                      <TotalsHead>SUBTOTAL:</TotalsHead>
                    </div>
                    <div>
                      <TotalsPrice>
                        P{calculateSubtotal(cartItems).toFixed(2)}
                      </TotalsPrice>
                    </div>
                  </Totals>

                  <Totals>
                    <div>
                      <TotalsHead>SHIPPING:</TotalsHead>
                    </div>
                    <div></div>
                    <TotalsPrice>
                      P{getShippingFee(shippingMethod).toFixed(2)}{" "}
                    </TotalsPrice>
                  </Totals>

                  <Totals>
                    <div>
                      <TotalsHead>DISCOUNT:</TotalsHead>
                    </div>
                    <div></div>
                    <TotalsPrice>
                      - P
                      {(
                        (discountValidation.percentage / 100) *
                        calculateSubtotal(cartItems)
                      ).toFixed(2)}
                    </TotalsPrice>
                  </Totals>
                </TotalContainerBox>

                <TotalContainerBox1>
                  <Totals>
                    <div>
                      <OverallTotal>TOTAL:</OverallTotal>
                    </div>
                    <div>
                      <OverallTotal>P{grandTotal.toFixed(2)}</OverallTotal>
                    </div>
                  </Totals>
                </TotalContainerBox1>

                <ButtonsBottom>
                  <ReturnButton>
                    <ButtonBottomSyle to="/cart" type="submit">
                      RETURN TO CART
                    </ButtonBottomSyle>
                  </ReturnButton>
                  <ButtonBottomSyle
                    to="/"
                    checkout
                    size={"m"}
                    type="button"
                    onClick={handleCheckout}
                  >
                    {" "}
                    CHECKOUT{" "}
                  </ButtonBottomSyle>
                </ButtonsBottom>
              </Box>
            </ColumnsWrapper>
          </Center>
        </StyledContainer>
      </div>
    </>
  );
}
