import React from "react";
import ButtonIcon from "../../ui/ButtonIcon";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../utils/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";

export const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Loged out successfully");
      // Immediately clear cached auth state so ProtectedRoute can't "think" we're logged in
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/login", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });

  function handleLogout() {
    mutate();
  }

  if (isPending) return <Spinner />;

  return (
    <ButtonIcon>
      <HiArrowRightOnRectangle onClick={handleLogout} />
    </ButtonIcon>
  );
};
