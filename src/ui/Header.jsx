import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getCurrentuser } from "../utils/apiAuth.js";
import { Logout } from "../features/authentication/Logout";
import { HiOutlineMoon, HiOutlineSun, HiUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeProvider.jsx";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  gap: 2rem;
`;

function Header() {
  const navigate = useNavigate();

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentuser,
  });

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },
    [isDarkMode],
  );

  const { fullName } = user?.user?.user_metadata;

  if (isLoading) return <Spinner />;

  return (
    <StyledHeader>
      <p> {fullName} </p>
      <HiUser onClick={() => navigate("/account")} color="blue" size={30} />
      <div onClick={toggleDarkMode}>
        {isDarkMode ? <HiOutlineSun size={30} /> : <HiOutlineMoon size={30} />}
      </div>
      <Logout />
    </StyledHeader>
  );
}

export default Header;
