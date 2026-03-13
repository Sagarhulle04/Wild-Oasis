import { useQuery } from "@tanstack/react-query";
import { getCurrentuser } from "../utils/apiAuth";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProtectedRoute = ({ children }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentuser,
  });

  if (isLoading) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  if (!user?.user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
