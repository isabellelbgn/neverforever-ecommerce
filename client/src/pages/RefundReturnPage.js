import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Center from "../components/Center";
import styled from "styled-components";
import ButtonLink from "../components/ButtonLink";
import { FiUpload } from "react-icons/fi";
import Button from "../components/Button";
import Swal from "sweetalert2";

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

const PageWrapper = styled.div`
  align-items: flex-start;
  margin: 40px 25px;
  color: #fff;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  color: #fff;
  text-align: left;
  margin-right: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  gap: 20px;
`;

const FormLabel = styled.label`
  color: #fff;
  margin-bottom: 5px;
`;

const FormSelect = styled.select`
  padding: 8px;
  width: 100%;
  margin-bottom: 10px;
`;

const FormTextarea = styled.textarea`
  padding: 8px;
  width: 100%;
  margin-bottom: 10px;
`;

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    gap: 5px;
  }

  input {
    display: none;
  }

  img {
    width: 100px;
    height: 100px;
    margin-top: 10px;
    border-radius: 5px;
  }
`;

const SubmitButton = styled(Button)`
  height: 40px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 5px;
  margin-top: 10px;
`;

export default function RefundReturnPage() {
  const [request, setRequest] = useState({
    rrType: "",
    rrReason: "",
    rrImage: "",
    salesOrderId: "",
  });
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = new URLSearchParams(location.search).get("orderId");

  const isCurrentPage = (path, borderColor) => {
    const currentPath = window.location.pathname;
    return currentPath.startsWith(path)
      ? borderColor || "#EA33F3"
      : "transparent";
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

  const uploadImage = async (e) => {
    try {
      const file = e.target?.files[0];
      if (file) {
        const data = new FormData();
        data.append("file", file);
        const response = await axios.post(
          "http://localhost:8082/request/upload",
          data
        );

        const uploadedImage = response.data.images[0];
        setRequest((prev) => ({
          ...prev,
          rrImage: `http://localhost:8082/rrImages/${uploadedImage}`,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      salesOrderId: orderId,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "Do you want to submit the request?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    });

    if (result.isConfirmed) {
      try {
        const { rrType, rrReason, rrImage, salesOrderId } = request;
        await axios.post("http://localhost:8082/request", {
          rrType,
          rrReason,
          rrImage,
          salesOrderId,
        });

        Swal.fire({
          icon: "success",
          title: "Request Submitted!",
          text: "Your request has been successfully submitted. Please check your email for confirmation or check back on the site after 2-3 working days.",
        });

        navigate("/account/myorders");
      } catch (err) {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error submitting your request. Please try again.",
        });
      }
    }
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
                  color: isCurrentPage("/account", "white"),
                  borderColor: isCurrentPage("/account", "transparent"),
                }}
              >
                PERSONAL INFO
              </NavLink>

              <NavLink
                checkout
                to="/account/myorders"
                style={{
                  color: isCurrentPage("/account/myorders", "white"),
                  borderColor: isCurrentPage("/account/myorders", "#EA33F3"),
                }}
              >
                MY ORDERS
              </NavLink>

              <NavLink
                onClick={handleLogout}
                checkout
                style={{
                  color: "white",
                  borderColor: isCurrentPage("/logout", "transparent"),
                }}
              >
                LOG OUT
              </NavLink>
            </LeftLinks>
          </StyledNav>
        </Wrapper>
      </StyledHeader>

      <PageWrapper>
        <ColumnsWrapper>
          <Title>Refund/Request Form</Title>
        </ColumnsWrapper>
      </PageWrapper>

      <PageWrapper>
        <ColumnsWrapper>
          <ContentWrapper>
            <FormLabel>Order ID: {orderId}</FormLabel>
            <FormSelect name="rrType" onChange={handleChange}>
              <option value=""></option>
              <option value="Refund">Refund</option>
              <option value="Return">Return</option>
            </FormSelect>

            <FormLabel>Reason :</FormLabel>
            <FormTextarea name="rrReason" onChange={handleChange} />

            <FormLabel>Proof: </FormLabel>
            <FileUploadWrapper>
              <label className="text-l">
                <FiUpload />
                <div>Upload</div>
                <input type="file" name="rrImage" onChange={uploadImage} />
              </label>
              {request.requestImage && (
                <div>
                  Uploaded Image:
                  <img
                    src={request.requestImage}
                    alt="RequestImage"
                    width="100"
                    height="100"
                  />
                </div>
              )}
            </FileUploadWrapper>

            <div className="flex justify-end mt-2">
              <SubmitButton
                onClick={handleClick}
                type="submit"
                className="px-4 py-1 rounded-md bg-black text-white text-base"
              >
                SUBMIT REQUEST
              </SubmitButton>
            </div>
          </ContentWrapper>
        </ColumnsWrapper>
      </PageWrapper>
    </Center>
  );
}
