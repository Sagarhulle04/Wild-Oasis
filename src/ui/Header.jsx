import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getCurrentuser } from "../utils/apiAuth";
import { Logout } from "../features/authentication/Logout";
import { HiOutlineUser, HiUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  gap: 1.5rem;
`;

function Header() {
  const navigate = useNavigate();

  // console.log(userData);

  return (
    <StyledHeader>
      <HiUser onClick={() => navigate("/account")} color="blue" size={30} />
      <Logout />
    </StyledHeader>
  );
}

export default Header;
