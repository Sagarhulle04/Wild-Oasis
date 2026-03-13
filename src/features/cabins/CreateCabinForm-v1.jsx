import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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
import { addCabin, updateCabin } from "../../utils/apiCabins";
import toast from "react-hot-toast";

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

// Receives closeModal directly from Modal
function CreateCabinFormV1({ cabinToEdit, setShowForm }) {
  //   console.log(cabinToEdit);

  const { id: editId, ...editValues } = cabinToEdit;

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? cabinToEdit : {},
  });

  const { errors } = formState;
  // console.log(errors);

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Initialize preview with existing image URL when editing
    if (isEditSession && cabinToEdit?.image) {
      setPreviewUrl(cabinToEdit.image);
    }
  }, [isEditSession, cabinToEdit]);

  useEffect(() => {
    return () => {
      // Only revoke blob URLs (from FileReader), not data URLs or http URLs
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: (data) =>
      isEditSession ? updateCabin(data, editId) : addCabin(data),
    onSuccess: () => {
      toast.success(
        isEditSession
          ? "Cabin updated successfully"
          : "Cabin created successfully",

        setShowForm(false),
      );
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
      setPreviewUrl(null);
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    // Clean up image field: remove empty FileList, keep strings (existing images)
    if (data.image) {
      // If image is a FileList and empty, remove it
      if (data.image instanceof FileList && data.image.length === 0) {
        delete data.image;
      }
      // If image is a string, keep it (existing image)
      // If image is a FileList with files, it will be processed by API
    }
    console.log("Submitting cabin data:", data);
    mutate(data);
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
        <Label htmlFor="image">Cabin Photo</Label>
        <FileInput
          id="image"
          {...register("image")}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setPreviewUrl(URL.createObjectURL(file));
            } else if (!isEditSession) {
              setPreviewUrl(null);
            }
            // Keep existing image when editing if no new file selected
          }}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Cabin preview"
            style={{
              marginTop: "1rem",
              maxWidth: "100%",
              display: "block",
            }}
          />
        )}
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => setShowForm((show) => !show)}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isEditSession ? "Edit Cabin" : "Create New Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinFormV1;
