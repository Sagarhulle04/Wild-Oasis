import { useState } from "react";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useQuery } from "@tanstack/react-query";
import { getCurrentuser } from "../../utils/apiAuth";

function UpdateUserDataForm() {
  // We don't need the loading state

  const { data: useUser, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentuser,
  });

  console.log(useUser);

  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser;

  const [fullName, setFullName] = useState(currentFullName);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;
  }

  function handleCancel(e) {
    // We don't even need preventDefault because this button was designed to reset the form (remember, it has the HTML attribute 'reset')
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          // We should also validate that it's actually an image, but never mind
        />
      </FormRow>
      <FormRow>
        <Button onClick={handleCancel} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
