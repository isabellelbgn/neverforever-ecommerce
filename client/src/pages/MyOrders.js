import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Center from "../components/Center";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ButtonLink from "../components/ButtonLink";
import Swal from "sweetalert2";
import Table from "../components/Table";
import Button from "../components/Button";

const OrderTable = styled(Table)`
  margin-bottom: 200px;
`;

const StyledHeader = styled.header`
  background-color: #000;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  margin-bottom: 50px;
`;

const NavLink = styled(ButtonLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  transition: border 0.3s;
  font-size: medium;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
`;

const LeftLinks = styled.div`
  display: flex;
  gap: 40px;
`;

const Box = styled.tr`
  border-bottom: 0.01em dotted yellow;
  background-color: black;
`;

const OrderDetails = styled.div`
  margin-top: 50px;
  text-align: center;
  font-weight: 300;
  font-size: small;
  color: white;
  text-transform: uppercase;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 50px;
`;

const ProductDetails = styled.div`
  margin-top: 50px;
  text-align: left;
  text-transform: uppercase;
  margin-left: 20%;
  margin-right: 10px;
  margin-bottom: 50px;
  font-weight: 200;
  font-size: 12px;
  color: white;
`;

const OrderItemImage = styled.img`
  margin-top: 20px;
  max-width: 100px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProductName = styled.div`
  font-weight: 600;
`;

const StatusButton = styled(Button)`
  height: 50px;
  font-size: 12px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center; /* Center the text horizontally */
  margin-bottom: 5px;
`;

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const location = useLocation();
  const isCurrentPage = (path) => location.pathname === path;
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout")
      .then((res) => {
        if (res.data.loggedOut) {
          setUserData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
          });
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchOrders = () => {
    axios
      .get("http://localhost:8082/account/myorders")
      .then((res) => {
        if (res.data.orders) {
          setOrders(res.data.orders);
        } else {
          console.log("No Orders found.");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderReceived = (orderId) => {
    Swal.fire({
      title: "Confirm Order Received",
      text: "Have you received the order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, received!",
      cancelButtonText: "No, not yet",
      background: "black",
      color: "white",
      confirmButtonColor: "#ea33f3",
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, "Delivered");
      }
    });
  };

  const handleReturnRefund = (orderId) => {
    Swal.fire({
      title: "Request",
      text: "Are you sure you want to make a return/refund request?",
      icon: "question",
      background: "black",
      color: "white",
      confirmButtonColor: "#ea33f3",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/account/myorders/refundrequestform?orderId=${orderId}`;
      }
    });
  };

  const handleWriteReview = (orderId, productId, salesOrderItemId) => {
    Swal.fire({
      title: "Write Review",
      text: "Write your review here:",
      input: "textarea",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      background: "black",
      color: "white",
      confirmButtonColor: "#ea33f3",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        axios
          .post("http://localhost:8082/submitReview", {
            orderId: orderId,
            productId: productId,
            salesOrderItemId: salesOrderItemId,
            comment: result.value,
          })
          .then((response) => {
            console.log("Response from the server:", response.data);
            console.log(response.data.message);
          })
          .catch((error) => {
            console.error("Error submitting review:", error);
          });
      }
    });
  };

  const handleOrderAction = (orderId, action) => {
    switch (action) {
      case "received":
        handleOrderReceived(orderId);
        break;
      case "returnrefund":
        handleReturnRefund(orderId);
        break;
      default:
        break;
    }
  };

  const updateOrderStatus = (orderId) => {
    axios
      .put(`http://localhost:8082/account/myorders/update/${orderId}`, {
        newStatus: "Delivered",
      })
      .then((res) => {
        if (res.data.updated) {
          fetchOrders();
        } else {
          console.log("Failed to update order status.");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleViewReview = (productId) => {
    navigateToProductLink(productId);
  };

  const handleViewRequest = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/account/myorders/request/${orderId}`
      );

      const refundRequest = response.data.refundRequest;

      Swal.fire({
        title: "Request Details",
        html: `
          <p><strong>Type:</strong> ${refundRequest.rr_type}</p>
          <p><strong>Reason:</strong> ${refundRequest.rr_reason}</p>
          <p><strong>Image Proof:</strong></p>
          <img
            src="${refundRequest.rr_imageProof}"
            alt="Image Proof"
            width="180"
            height="180"
          />
          <p style="color: red;"><strong>Request Status:</strong> ${
            refundRequest.rr_status
          }</p>
          <p><strong>Submitted At:</strong> ${new Date(
            refundRequest.rr_createdAt
          ).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })}</p>
              `,
        icon: "info",
        confirmButtonText: "Close",
        background: "black",
        color: "white",
        confirmButtonColor: "#ea33f3",
      });
    } catch (error) {
      console.error("Error fetching refund request details:", error);
    }
  };

  const navigateToProductLink = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Center>
      <StyledHeader>
        <Wrapper>
          <StyledNav>
            <LeftLinks>
              <NavLink
                checkout
                to="/account"
                style={{
                  color: isCurrentPage("/account"),
                  borderColor: isCurrentPage("/account")
                    ? "#EA33F3"
                    : "transparent",
                }}
              >
                PERSONAL INFO
              </NavLink>

              <NavLink
                checkout
                to="/account/myorders"
                style={{
                  color: isCurrentPage("/account/myorders"),
                  borderColor: isCurrentPage("/account/myorders")
                    ? "#EA33F3"
                    : "transparent",
                }}
              >
                MY ORDERS
              </NavLink>

              <NavLink
                onClick={handleLogout}
                checkout
                style={{
                  color: isCurrentPage("/logout"),
                  borderColor: isCurrentPage("/logout")
                    ? "#EA33F3"
                    : "transparent",
                }}
              >
                LOG OUT
              </NavLink>
            </LeftLinks>
          </StyledNav>
        </Wrapper>
      </StyledHeader>

      <OrderTable>
        <thead>
          <tr>
            <th></th>
            <th>ORDER ID</th>
            <th>ITEM NAME</th>
            <th>QTY</th>
            <th>UNIT PRICE</th>
            <th>TOTAL PRICE</th>
            <th>ORDER DATE</th>
            <th>PAYMENT METHOD</th>
            <th>PAYMENT STATUS</th>
            <th>ORDER STATUS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <Box key={order.so_id}>
              <td>
                <OrderItemImage src={order.product_image} alt="Product" />
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_id}</p>
                </OrderDetails>
              </td>
              <td>
                <ProductDetails>
                  <ProductName>{order.product_name}</ProductName>
                  <br />
                  {order.so_item_jewelryLength}
                  <br />
                  {order.so_item_jewelryTextFront}
                  <br />
                  {order.so_item_jewelryTextBack}
                  <br />
                  {order.so_item_jewelryFont}
                  <br />
                  NOTES:
                  {order.so_orderNotes}
                </ProductDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_item_quantity}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>P{order.so_item_unitPrice}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>P{order.so_totalAmount}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_orderDate}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_paymentMethod}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_paymentStatus}</p>
                </OrderDetails>
              </td>
              <td>
                <OrderDetails>
                  <p>{order.so_orderStatus}</p>
                </OrderDetails>
              </td>

              <td>
                {order.so_orderStatus === "Shipped" && (
                  <>
                    <StatusButton
                      block
                      primary
                      onClick={() => handleOrderAction(order.so_id, "received")}
                    >
                      Order Received
                    </StatusButton>
                    <StatusButton
                      block
                      primary
                      onClick={() =>
                        handleOrderAction(order.so_id, "returnrefund")
                      }
                    >
                      Request Refund Return
                    </StatusButton>
                  </>
                )}

                {order.so_orderStatus === "Refund Requested" ||
                order.so_orderStatus === "Return Requested" ? (
                  <StatusButton
                    block
                    primary
                    onClick={() => handleViewRequest(order.so_id)}
                  >
                    {" "}
                    View Request{" "}
                  </StatusButton>
                ) : null}

                {order.so_orderStatus === "Delivered" &&
                  order.so_paymentStatus !== "Refunded" && (
                    <>
                      {console.log("Order:", order)}
                      {order.review_id === null ? (
                        <StatusButton
                          block
                          primary
                          onClick={() =>
                            handleWriteReview(
                              order.so_id,
                              order.product_id,
                              order.so_item_id
                            )
                          }
                        >
                          Write Review
                        </StatusButton>
                      ) : (
                        <StatusButton
                          block
                          primary
                          onClick={() => handleViewReview(order.product_id)}
                        >
                          View Review
                        </StatusButton>
                      )}
                    </>
                  )}
              </td>
            </Box>
          ))}
        </tbody>
      </OrderTable>
    </Center>
  );
}
