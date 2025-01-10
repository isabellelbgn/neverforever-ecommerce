import styled from "styled-components";
import Center from "../components/Center";
import LoginImage from "../components/assets/login.png";
import Input from "../components/Input";
import ButtonLink from "../components/ButtonLink";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 0.5fr;
  gap: 10px;
  margin-top: 30px;
  color: #fff;
`;

const ImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  margin-left: 20%;
  img {
    border-radius: 10px;
    max-width: 120%;
    max-height: 80%;
  }
`;
const FLNameContainer = styled.div`
  gap: 10px;
  display: grid;
  grid-template-columns: 0.5fr 0.5fr;
`;

const TextBoxContainer = styled.div`
  margin-top: 10%;
  border-radius: 10px;
  margin-right: 30%;
`;

const TextBox = styled(Input)`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: inline;
  margin-bottom: 20px;
`;

const InputTextTop = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: white;
  text-align: white;
`;

const NoAccountStyle = styled.div`
  justify-content: space-between;
  border-top: 0.01em dotted #ea33f3;
  display: flex;
  margin-top: 20px;
`;
const TextBottom = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: white;
  text-align: center;
  display: inline;
  margin-top: 30px;
`;

const SignUpButton = styled(ButtonLink)`
  margin-top: 20px;
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  display: inline;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18.72px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

const LogInButton = styled(ButtonLink)`
  font-size: small;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center; /* Center the text horizontally */
`;

const ErrorText = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: red;
  text-align: right;
  display: inline;
`;

const TextTopContainer = styled.div`
  justify-content: space-between;
  display: flex;
`;

export default function RegisterPage() {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    console.log("Form values:", values);

    const validateForm = () => {
      const errors = {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
      };

      if (!values.firstName) {
        errors.firstName = "Please enter first name";
      }

      if (!values.lastName) {
        errors.lastName = "Please enter last name";
      }

      if (!values.email) {
        errors.email = "Please enter email";
      }

      if (!values.username) {
        errors.username = "Please enter username";
      }

      if (!values.password) {
        errors.password = "Please enter password";
      }

      return errors;
    };

    try {
      const validationErrors = validateForm();
      console.log("Validation errors:", validationErrors);

      if (Object.values(validationErrors).some((error) => error !== "")) {
        setErrorMessages(validationErrors);
        return;
      }

      const response = await axios.post(
        "http://localhost:8082/register",
        values
      );

      console.log("Registration response:", response);

      if (response.status === 200) {
        console.log("Registration successful");
        navigate("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <Center>
        <ColumnsWrapper>
          <ImageBox>
            <img src={LoginImage} alt="Login" />
          </ImageBox>

          <TextBoxContainer>
            <Title>REGISTER</Title>
            <form onSubmit={handleSubmit}>
              <FLNameContainer>
                <div>
                  <TextTopContainer>
                    <InputTextTop>FIRST NAME:</InputTextTop>
                    <ErrorText>{errorMessages.firstName}</ErrorText>
                  </TextTopContainer>
                  <label htmlFor="firstName"></label>
                  <TextBox
                    type="text"
                    placeholder="Enter First Name"
                    name="firstName"
                    onChange={handleInput}
                  />
                </div>

                <div>
                  <TextTopContainer>
                    <InputTextTop>LAST NAME:</InputTextTop>
                    <ErrorText>{errorMessages.lastName}</ErrorText>
                  </TextTopContainer>
                  <label htmlFor="lastName"> </label>
                  <TextBox
                    type="text"
                    placeholder="Enter Last Name"
                    name="lastName"
                    onChange={handleInput}
                  />
                </div>
              </FLNameContainer>
              <TextTopContainer>
                <InputTextTop>EMAIL:</InputTextTop>
                <ErrorText>{errorMessages.email}</ErrorText>
              </TextTopContainer>
              <label htmlFor="email"> </label>
              <TextBox
                type="text"
                placeholder="Enter Email Address"
                name="email"
                onChange={handleInput}
              />
              <TextTopContainer>
                <InputTextTop>USERNAME:</InputTextTop>
                <ErrorText>{errorMessages.username}</ErrorText>
              </TextTopContainer>
              <label htmlFor="username"> </label>
              <TextBox
                type="text"
                placeholder="Set Username"
                name="username"
                onChange={handleInput}
              />
              <TextTopContainer>
                <InputTextTop>PASSWORD:</InputTextTop>
                <ErrorText>{errorMessages.password}</ErrorText>
              </TextTopContainer>
              <label htmlFor="password"> </label>
              <TextBox
                type="password"
                placeholder="Set Password"
                name="password"
                onChange={handleInput}
              />

              <LogInButton
                block
                primary
                size={"m"}
                type="submit"
                onClick={handleSubmit}
              >
                {" "}
                SIGN UP{" "}
              </LogInButton>

              <NoAccountStyle>
                <TextBottom>HAVE AN ACCOUNT? </TextBottom>
                <SignUpButton to={`/login`} checkout size={"m"}>
                  {" "}
                  LOG IN{" "}
                </SignUpButton>
              </NoAccountStyle>
            </form>
          </TextBoxContainer>
        </ColumnsWrapper>
      </Center>
    </>
  );
}
