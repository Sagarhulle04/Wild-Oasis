import React, { useState } from "react";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import CreateCabinFormV1 from "../features/cabins/CreateCabinForm-v1";
import Modal from "../ui/Modal";
import CreateCabinForm from "../features/cabins/CreateCabinForm";

const AddCabin = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowForm(!showForm)}>Add New Cabin</Button>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <CreateCabinForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
};

export default AddCabin;
