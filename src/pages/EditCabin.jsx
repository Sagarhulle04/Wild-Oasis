import React, { useState } from "react";
import Modal from "../ui/Modal";
import CreateCabinFormV1 from "../features/cabins/CreateCabinForm-v1";
import Button from "../ui/Button";

const EditCabin = ({ cabinToEdit }) => {
  const [showForm, setShowForm] = useState(false);

  function handleClose() {
    setShowForm(false);
  }

  return (
    <>
      <Button
        style={{ fontSize: "12px" }}
        onClick={(e) => {
          e.stopPropagation();
          setShowForm((show) => !show);
        }}
      >
        Edit
      </Button>
      {showForm && (
        <Modal onClose={handleClose}>
          <CreateCabinFormV1
            setShowForm={setShowForm}
            cabinToEdit={cabinToEdit}
          />
        </Modal>
      )}
    </>
  );
};

export default EditCabin;
