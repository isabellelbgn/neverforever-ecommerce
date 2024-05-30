import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: #000;
  margin: 0 auto;
  padding: 0 100px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 50px;
  margin-top: 50px;
  background-color: #000;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 10px 50px;
  transition: border 0.3s;
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

function CheckoutHeader() {
  const location = useLocation();

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <StyledHeader>
      <Wrapper>
        <StyledNav>
          <LeftLinks>
            <NavLink
              to="/checkout"
              style={{
                color: isCurrentPage("/checkout"),
                borderColor: isCurrentPage("/checkout")
                  ? "#EA33F3"
                  : "transparent",
              }}
            >
              CART
            </NavLink>

            <NavLink
              to="/logout"
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
  );
}

export default CheckoutHeader;
