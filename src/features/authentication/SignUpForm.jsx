import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../../utils/apiAuth";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";

function SignupForm() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { errors } = formState;
  console.log(errors);

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Signed in succeessfully. Verify the email ");
      reset;
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit({ fullName, email, password }) {
    mutate({ fullName, email, password });
  }

  if (isPending) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Full Name"
        error={errors?.fullName?.message}
        orientation="vertical"
      >
        <Input
          type="text"
          id="fullName"
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label="Email address"
        error={errors?.email?.message}
        orientation="vertical"
      >
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow
        label="Password"
        orientation="vertical"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be minimum of 8 characters",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="confirmPassword"
        orientation="vertical"
        error={errors?.confirmPassword?.message}
      >
        <Input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword", {
            required: "This field is required",

            validate: (value) => {
              return value === getValues().password || "password must be same";
            },
          })}
        />
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="large">Sign Up</Button>
      </FormRow>

      <p>
        Already have an account :{" "}
        <Link to="/login" style={{ color: "blue" }}>
          Login here
        </Link>
      </p>
    </Form>
  );
}

export default SignupForm;
