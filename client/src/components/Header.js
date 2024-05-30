import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const StyledHeader = styled.header`
  background-color: #000;
  padding: 0 100px;
  margin-top: 10px;
  border-bottom: 1px solid #fbff54;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space between;
  padding: 20px 10px;
  background-color: #000;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    color: yellow;
  }
`;

const Custom = styled.div`
  color: white;
  font-size: 12px;
  text-align: center;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
`;

const LeftLinks = styled.div`
  display: flex;
  gap: 80px;
`;

const RightLinks = styled.div`
  display: flex;
  gap: 80px;
`;
const Logo = styled.h1`
  display: inline;
  margin: 0;
  font-weight: normal;
  font-size: large;
  font-family: "Kish", sans-serif;
  color: yellow;
`;

function Header() {
  const location = useLocation();

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <StyledHeader>
      <Wrapper>
        <StyledNav>
          <LeftLinks>
            <NavLink to="/" data-swup>
              HOME
              {isCurrentPage("/") && <BiDotsHorizontalRounded />}
            </NavLink>
            <NavLink to="/shop" data-swup>
              SHOP
              {(isCurrentPage("/shop") ||
                location.pathname.startsWith("/product/")) && (
                <BiDotsHorizontalRounded />
              )}
            </NavLink>
          </LeftLinks>
          <div>
            <Logo>NEVER FOR EVER</Logo>
            <Custom>CUSTOM JEWELRY</Custom>
          </div>
          <RightLinks>
            <NavLink to="/account" data-swup>
              ACCOUNT
              {isCurrentPage("/account") ||
                (isCurrentPage("/myorders") && <BiDotsHorizontalRounded />)}
            </NavLink>
            <NavLink to="/cart" data-swup>
              CART
              {(isCurrentPage("/cart") ||
                isCurrentPage("/checkout") ||
                isCurrentPage("/thankyou") ||
                isCurrentPage("/logout")) && <BiDotsHorizontalRounded />}
            </NavLink>
          </RightLinks>
        </StyledNav>
      </Wrapper>
    </StyledHeader>
  );
}

export default Header;
