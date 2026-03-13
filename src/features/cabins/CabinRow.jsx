import styled from "styled-components";

import { formatCurrency } from "../../utils/helpers.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin } from "../../utils/apiCabins.js";
import toast from "react-hot-toast";
import { useState } from "react";
import CreateCabinForm from "./CreateCabinForm.jsx";
import CreateCabinFormV1 from "./CreateCabinForm-v1.jsx";
import EditCabin from "../../pages/EditCabin.jsx";
import Modal from "../../ui/Modal.jsx";
import Button from "../../ui/Button.jsx";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Spinner from "../../ui/Spinner.jsx";
import { useNavigate } from "react-router-dom";

// v1
const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  cursor: pointer;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  /* transform: scale(1.66666) translateX(-2px); */
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const [showForm, setShowForm] = useState(false);
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: deleteCabin,
    onSuccess: () => {
      toast.success("Cabin deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  if (isDeleting) {
    return <Spinner />;
  }

  function handleClose() {
    setShowForm(false);
  }

  return (
    <>
      <TableRow role="row" onClick={() => navigate(`/cabins/${cabinId}`)}>
        <Img src={image} />

        <Cabin>{name}</Cabin>

        <div>Fits up to {maxCapacity} guests</div>

        <Price>{formatCurrency(regularPrice)}</Price>

        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <div style={{ display: "flex", gap: "5px" }}>
          <EditCabin cabinToEdit={cabin} />
          <Button
            style={{ fontSize: "12px" }}
            disabled={isDeleting}
            onClick={() => setShowForm(true)}
          >
            Delete
          </Button>
          {showForm && (
            <Modal onClose={handleClose}>
              <h1>Delete Cabin</h1>
              <p>
                Are you sure you want to delete the cabin permanently? This
                action cannot be undone
              </p>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variations="danger"
                  disabled={isDeleting}
                  onClick={() => {
                    mutate(cabinId);
                    setShowForm(false);
                  }}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </Modal>
          )}
        </div>
      </TableRow>
      {/* {showForm && <CreateCabinFormV1 cabinToEdit={cabin} />} */}
    </>
  );
}

// () => mutate(cabinId)
export default CabinRow;
