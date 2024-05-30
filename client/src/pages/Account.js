import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Center from "../components/Center";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ButtonLink from "../components/ButtonLink";
import { MdModeEditOutline } from "react-icons/md";
import Button from "../components/Button";
import Input from "../components/Input";
import Swal from "sweetalert2";

const sharedTitleStyles = `
  font-size: 1.5em;
  color: #fff;
  text-align: left; 
  margin-right: 20px;
  font-weight: bold; 
  cursor: pointer;
`;

const Title = styled.h1`
  ${sharedTitleStyles}
  display: flex;
  margin-bottom: 50px;
`;

const StyledHeader = styled.header`
  background-color: #000;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
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
  margin-bottom: 20px;
`;

const LeftLinks = styled.div`
  display: flex;
  gap: 40px;
`;

const P = styled.p`
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  display: inline;
  margin-right: 20px;
`;

const Output = styled.p`
  font-size: small;
  color: white;
  font-weight: light;
  text-transform: uppercase;
  display: inline;
`;
const Output1 = styled.div`
  font-size: small;
  color: white;
  font-weight: light;
  text-transform: uppercase;
  display: block; // Change display to block
  margin-bottom: 8px; // Add margin-bottom for spacing
`;

const StyledInput = styled(Input)`
  width: 50%;
  display: inline;
`;

const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ColumnsWrapper = styled.div`
  background-color: black;
  display: grid;
  grid-template-columns: 1fr;
`;

const EditButton = styled(Button)`
  color: yellow;
  display: inline;
  margin-left: 10px;
`;

const SaveButton = styled(Button)`
  margin-top: 50px;
  padding: 8px;
  text-transform: uppercase;
`;

const ContentWrapper = styled.div`
  margin-bottom: 50px;
`;

const RewardsContainerBox = styled.div`
  width: 50%;
  background-color: black;
  border: 2px solid #ea33f3;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 50px;
`;

const RewardsHeader = styled.p`
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  display: inline;
`;
export default function AccountPage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const location = useLocation();
  const isCurrentPage = (path) => location.pathname === path;
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: "success",
        title: "Text copied to clipboard",
        text: text,
        showConfirmButton: false,
        timer: 1500,
        background: "black",
        color: "white",
        confirmButtonColor: "#ea33f3",
      });
    });
  }

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

  useEffect(() => {
    axios
      .get("http://localhost:8082/account")
      .then(async (res) => {
        if (res.data.valid) {
          setUserData({
            firstName: res.data.customer_account_firstName || "",
            lastName: res.data.customer_account_lastName || "",
            email: res.data.customer_account_emailAddress || "",
            username: res.data.customer_account_username || "",
            password: res.data.customer_account_password || "",
            customerReward: res.data.customer_account_reward_id_fk || "",
            customerId: res.data.customer_account_id || "",
          });

          const rewardDetailsResponse = await axios.get(
            `http://localhost:8082/rewards/${res.data.customer_account_reward_id_fk}`
          );
          if (rewardDetailsResponse.data) {
            setUserData((prevData) => ({
              ...prevData,
              customerRewardDetails: rewardDetailsResponse.data,
            }));
          }
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const requestData = {
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        email: userData.email || null,
        username: userData.username || null,
        password: userData.password || null,
        customerId: userData.customerId || null,
      };
      console.log("Request Data:", requestData);

      await axios.put("http://localhost:8082/account", requestData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
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
        <PageWrapper>
          <ColumnsWrapper>
            <ContentWrapper>
              <Title>
                My Profile{" "}
                <EditButton primary block onClick={handleEdit}>
                  <MdModeEditOutline />
                </EditButton>
              </Title>
              {editMode ? (
                <div>
                  <div>
                    <P>First Name:</P>
                    <StyledInput
                      type="text"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <P>Last Name:</P>
                    <StyledInput
                      type="text"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <P>Email:</P>
                    <StyledInput
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <P>Username:</P>
                    <StyledInput
                      type="text"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <P>Password:</P>
                    <StyledInput
                      type="password"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData((prevData) => ({
                          ...prevData,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <SaveButton primary block onClick={handleSave}>
                    Save Changes
                  </SaveButton>
                </div>
              ) : (
                <>
                  <ContentWrapper>
                    <P> First Name:</P>
                    <Output>{userData.firstName}</Output>
                  </ContentWrapper>

                  <ContentWrapper>
                    <P> Last Name:</P>
                    <Output>{userData.lastName}</Output>
                  </ContentWrapper>

                  <ContentWrapper>
                    <P> Email:</P>
                    <Output>{userData.email}</Output>
                  </ContentWrapper>

                  <ContentWrapper>
                    <P> Username:</P>
                    <Output>{userData.username}</Output>
                  </ContentWrapper>

                  <ContentWrapper>
                    <P> Password:</P>
                    <Output> {userData.password.replace(/./g, "*")} </Output>
                  </ContentWrapper>
                </>
              )}
            </ContentWrapper>
          </ColumnsWrapper>

          <ContentWrapper>
            <Title>Rewards</Title>
            <ColumnsWrapper>
              <ContentWrapper>
                {userData.customerRewardDetails ? (
                  <>
                    <RewardsContainerBox>
                      <Output1>
                        <RewardsHeader>Name: </RewardsHeader>
                        {userData.customerRewardDetails.customer_reward_name}
                      </Output1>
                      <Output1>
                        <RewardsHeader>Code: </RewardsHeader>
                        {userData.customerRewardDetails.customer_reward_code}
                      </Output1>
                      <Output1>
                        <RewardsHeader>Percentage: </RewardsHeader>
                        {
                          userData.customerRewardDetails
                            .customer_reward_percentage
                        }
                      </Output1>

                      <SaveButton
                        primary
                        block
                        onClick={() =>
                          copyText(
                            userData.customerRewardDetails.customer_reward_code
                          )
                        }
                      >
                        Copy to clipboard
                      </SaveButton>
                    </RewardsContainerBox>
                  </>
                ) : (
                  <Output1>"No rewards yet"</Output1>
                )}
              </ContentWrapper>
            </ColumnsWrapper>
          </ContentWrapper>
        </PageWrapper>
      </Center>
    </>
  );
}
