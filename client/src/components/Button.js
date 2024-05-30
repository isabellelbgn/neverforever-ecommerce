import styled, { css } from "styled-components";

export const ButtonStyle = css`
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;

  ${(props) =>
    props.block &&
    css`
      display: block;
    `}

  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

    ${(props) =>
    props.checkout &&
    !props.outline &&
    css`
      background-color: black;
      color: #fff;
      border: 1px solid #ea33f3;
    `}

    ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}

    ${(props) =>
    props.primary &&
    css`
      background-color: #ea33f3;
      color: #fff;
      border: 1px solid #ea33f3;
    `}

    ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1rem;
      text-transform: uppercase;
      font-weight: 600;
      border-radius: 10px;
      padding: 10px 20px;
      width: 400px;
      height: 25px;
    `}

    ${(props) =>
    props.size === "m" &&
    css`
      font-size: 1rem;
      padding: 10px 20px;
    `}
`;

const StyledButton = styled.button`
  ${ButtonStyle};
`;

export default function Button({ children, primary, ...rest }) {
  return (
    <StyledButton primary={primary} {...rest}>
      {primary}
      {children}
    </StyledButton>
  );
}
