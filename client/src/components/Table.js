import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: center;
    text-transform: uppercase;
    color: yellow;
    font-weight: 600;
    font-size: 1rem;
    padding: 10px;
  }
`;

export default function Table(props) {
  return <StyledTable {...props} />;
}
