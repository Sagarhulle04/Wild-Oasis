import { useForm } from "react-hook-form";

// import { useCreateCabin } from "features/cabins/useCreateCabin";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
// import { useEditCabin } from "./useEditCabin";
import { Textarea } from "../../ui/Textarea";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCabin } from "../../utils/apiCabins";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

// Receives closeModal directly from Modal
function CreateCabinForm({ cabinToEdit, closeModal, onClose }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { errors } = formState;
  // console.log(errors);

  const queryClient = useQueryClient();

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: addCabin,
    onSuccess: () => {
      toast.success("Cabin created successfully");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  if (isCreating) {
    return <Spinner />;
  }

  function onSubmit(data) {
    console.log(data);
    mutate(data);
    onClose();
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow>
        <Label htmlFor="name">Cabin Name</Label>
        <Input
          type="text"
          {...register("name", {
            required: "This field is required",
          })}
        />
        {errors?.name?.message && <Error> {errors?.name?.message} </Error>}
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Max Capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", { required: "This field is required" })}
        />
        {errors?.maxCapacity?.message && (
          <Error> {errors?.maxCapacity?.message} </Error>
        )}
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular Price</Label>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
          })}
        />
        {errors?.regularPrice?.message && (
          <Error> {errors?.regularPrice?.message} </Error>
        )}
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) => {
              value <= getValues().regularPrice ||
                "Discount should be less than regular price";
            },
          })}
        />
        {errors?.discount?.message && (
          <Error> {errors?.discount?.message} </Error>
        )}
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Description</Label>
        <Textarea
          type="number"
          id="description"
          {...register("description", {
            required: "This field is required",
          })}
          defaultValue=""
        />
        {errors?.description?.message && (
          <Error> {errors?.description?.message} </Error>
        )}
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Image URL</Label>
        <FileInput id="image" {...register("image")} accept="image/*" />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Create New Cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
