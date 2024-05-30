import styled from "styled-components";
import Center from "../components/Center";
import LoginImage from "../components/assets/login.png";
import Input from "../components/Input";
import ButtonLink from "../components/ButtonLink";
import { useState, useEffect } from "react";
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

const TextBoxContainer = styled.div`
  margin-top: 25%;
  border-radius: 10px;
  margin-right: 30%;
`;

const TextBox = styled(Input)`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 20px;
`;

const InputTextTop = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: white;
  text-align: white;
  display: inline;
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

export default function LoginPage() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    const validateForm = () => {
      const errors = {
        email: "",
        password: "",
      };

      if (!values.email) {
        errors.email = "Please enter an email";
      }

      if (!values.password) {
        errors.password = "Please enter a password";
      }

      return errors;
    };

    try {
      const validationErrors = validateForm();
      if (Object.values(validationErrors).some((error) => error !== "")) {
        setErrorMessages(validationErrors);
        return;
      }
    } catch (error) {
      console.error("Error during login:", error.response.data.error);
    }

    e.preventDefault();
    axios
      .post("http://localhost:8082/login", values)
      .then((res) => {
        if (res.data.Login) {
          navigate("/");
        } else {
          alert("No record");
        }
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8082/account")
      .then((res) => {
        if (res.data.valid) {
          navigate("/");
        } else {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Center>
        <ColumnsWrapper>
          <ImageBox>
            <img src={LoginImage} alt="Login" />
          </ImageBox>

          <TextBoxContainer>
            <Title>LOG IN</Title>
            <form onSubmit={handleSubmit}>
              <TextTopContainer>
                <InputTextTop>EMAIL ADDRESS:</InputTextTop>
                <ErrorText>{errorMessages.email}</ErrorText>
              </TextTopContainer>
              <label htmlFor="emailAddress"> </label>
              <TextBox type="text" name="email" onChange={handleInput} />
              <TextTopContainer>
                <InputTextTop>PASSWORD:</InputTextTop>
                <ErrorText>{errorMessages.password}</ErrorText>
              </TextTopContainer>
              <label htmlFor="password"> </label>
              <TextBox type="password" name="password" onChange={handleInput} />

              <LogInButton
                primary
                block
                size={"m"}
                type="submit"
                onClick={handleSubmit}
              >
                {" "}
                LOG IN{" "}
              </LogInButton>

              <NoAccountStyle>
                <TextBottom>DON'T HAVE AN ACCOUNT? </TextBottom>
                <SignUpButton to={`/register`} checkout size={"m"}>
                  {" "}
                  SIGN UP{" "}
                </SignUpButton>
              </NoAccountStyle>
            </form>
          </TextBoxContainer>
        </ColumnsWrapper>
      </Center>
    </>
  );
}
