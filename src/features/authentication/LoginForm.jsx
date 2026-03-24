import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { getCurrentuser, login } from "../../utils/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";

function LoginForm() {
  const [email, setEmail] = useState("sagar@gmail.com");
  const [password, setPassword] = useState("sagar123");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginMutate, isPending: isLoginLoading } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      // Ensure ProtectedRoute doesn't read a cached "logged out" user for 60s
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Logged in successfully");
      navigate("/", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter both the fields");
      return;
    }

    loginMutate(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      },
    );
  }

  if (isLoginLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address" orientation="vertical">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRow>
      <FormRow label="Password" orientation="vertical">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="large">Login</Button>
      </FormRow>
      <p>
        Create New Account :{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Register here
        </Link>
      </p>
    </Form>
  );
}

export default LoginForm;
