import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";

import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers";
import { format } from "date-fns";
import Tag from "../../ui/Tag";
import { useState, useRef, useEffect } from "react";
import { HiEye, HiArrowDownOnSquare } from "react-icons/hi2";
import { createPortal } from "react-dom";
import {
  StyledMenu,
  StyledToggle,
  StyledList,
  StyledButton,
} from "../../ui/Menus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBooking, updateBooking } from "../../utils/apiBookings";
import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-700);
  font-family: "Sono";
  letter-spacing: 0.5px;
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
    color: var(--color-grey-700);
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 600;
  color: var(--color-grey-700);
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem 0.8rem;
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-600);
    color: white;
    border-color: var(--color-brand-600);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  cursor: pointer;
  align-items: center;
  padding: 1.4rem 2.4rem;
  transition: background-color 0.15s;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const statusToTagName = {
  unconfirmed: "blue",
  "checked-in": "green",
  "checked-out": "silver",
};

function BookingRow({
  booking: {
    id: bookingId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guests,
    cabins: { name: cabinName },
  },
}) {
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState(null);
  const menuRef = useRef();

  const navigate = useNavigate();
  const guestName = guests?.fullName ?? "Unknown Guest";
  const email = guests?.email ?? "";
  const tagType = statusToTagName[status] ?? "silver";

  const queryClient = useQueryClient();

  const { mutate: bookingCheckOut, isLoading } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: () => {
      toast.success("Checked Out Successfully");

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },

    onError: () => toast.error("Checking Out Failed"),
  });

  const { mutate: deleteBookingMutate, isPending: isDeleting } = useMutation({
    mutationFn: (bookingId) => deleteBooking(bookingId),
    onSuccess: () => {
      (toast.success("Booking deleted successfully"),
        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        }));
    },
    onError: (err) => toast.error(err.message),
  });

  function handleDeleteBooking(bookingId) {
    deleteBookingMutate(bookingId);
  }

  function handleCheckOut(bookingId) {
    bookingCheckOut(bookingId);
  }

  function toggleMenu(e) {
    e.stopPropagation();
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    setShowMenu((s) => !s);
  }

  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [showMenu]);

  if (isDeleting) return <Spinner />;

  return (
    <TableRow role="row">
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {formatDistanceFromNow(startDate)} &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={tagType}>{status.replace(/-/g, " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <StyledMenu>
        <StyledToggle onClick={toggleMenu}>
          <HiDotsVertical />
        </StyledToggle>

        {showMenu &&
          createPortal(
            <StyledList position={position} ref={menuRef}>
              <li>
                <StyledButton
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                >
                  <HiEye />
                  <span>See Details</span>
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    setShowForm(true);
                    setShowMenu(false);
                  }}
                >
                  <HiArrowDownOnSquare />
                  <span>Delete</span>
                </StyledButton>
              </li>

              {status === "unconfirmed" && (
                <li>
                  <StyledButton
                    onClick={() => navigate(`/checkin/${bookingId}`)}
                  >
                    <HiArrowDownOnSquare />
                    <span>Check In</span>
                  </StyledButton>
                </li>
              )}

              {status === "checked-in" && (
                <li>
                  <StyledButton onClick={() => handleCheckOut(bookingId)}>
                    <HiArrowDownOnSquare />
                    <span>Check Out</span>
                  </StyledButton>
                </li>
              )}
            </StyledList>,
            document.body,
          )}
      </StyledMenu>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h1>Delete Booking</h1>
          <p>
            Are you sure you want to delete this booking permanently? This
            action cannot be undone.
          </p>
          <ButtonGroup>
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              type="danger"
              disabled={isDeleting}
              onClick={() => {
                handleDeleteBooking(bookingId);
                setShowForm(false);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Modal>
      )}
    </TableRow>
  );
}

export default BookingRow;
