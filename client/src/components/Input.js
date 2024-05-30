import styled from "styled-components";

const StyledInput = styled.input`
  background-color: black;
  border: 1.5px solid #ea33f3;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 20px;
  color: white;
`;

export default function Input(props) {
  return <StyledInput {...props} />;
}
