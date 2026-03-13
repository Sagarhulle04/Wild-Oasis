import styled from "styled-components";
import Heading from "../ui/Heading";
import Logo from "../ui/Logo";
import SignupForm from "../features/authentication/SignUpForm";
import { Link } from "react-router-dom";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function SignUp() {
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h3">Create Your Account</Heading>
      <SignupForm />
    </LoginLayout>
  );
}

export default SignUp;
