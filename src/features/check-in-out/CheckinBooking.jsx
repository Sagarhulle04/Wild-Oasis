import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";

import Spinner from "../../ui/Spinner";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";

import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookingId as getElementById,
  updateBooking,
} from "../../utils/apiBookings";
import toast from "react-hot-toast";

const Box = styled.div`
  padding: 2.4rem 4rem;
`;

const BREAKFAST_PRICE = 500;

const CheckinBooking = () => {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [hasBreakfast, setHasBreakfast] = useState(false);

  const { bookingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getElementById(bookingId),
  });

  useEffect(() => {
    if (booking) {
      setConfirmPaid(booking.isPaid ?? false);
      setHasBreakfast(booking.hasBreakfast ?? false);
    }
  }, [booking]);

  const { mutate: bookingUpdateData, isLoading: isMutating } = useMutation({
    mutationFn: ({ id, totalPrice, extrasPrice, hasBreakfast }) =>
      updateBooking(id, {
        status: "checked-in",
        isPaid: true,
        hasBreakfast,
        totalPrice,
        extrasPrice,
      }),
    onSuccess: (data) => {
      toast.success("Booking Cheched In Successfully");
      queryClient.setQueryData(["booking", bookingId], (old) => ({
        ...old,
        ...data,
      }));
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate(-1);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) return <Spinner />;

  const {
    id: bookingIdForUpdate,
    totalPrice,
    extrasPrice = 0,
    guests,
  } = booking;
  const { fullName } = guests;

  const totalWithBreakfast = hasBreakfast
    ? totalPrice + BREAKFAST_PRICE
    : totalPrice;
  const extrasWithBreakfast = hasBreakfast
    ? extrasPrice + BREAKFAST_PRICE
    : extrasPrice;

  const handleBookingUpdate = () => {
    bookingUpdateData({
      id: bookingIdForUpdate,
      totalPrice: totalWithBreakfast,
      extrasPrice: extrasWithBreakfast,
      hasBreakfast,
    });
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check In Booking # {bookingId}</Heading>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        {/* Breakfast Checkbox */}
        <Checkbox
          checked={hasBreakfast}
          onChange={() => setHasBreakfast((prev) => !prev)}
        >
          Add breakfast for {formatCurrency(BREAKFAST_PRICE)} – Total becomes{" "}
          {formatCurrency(totalWithBreakfast)}
        </Checkbox>

        <br />

        {/* Confirm Paid Checkbox */}
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((prev) => !prev)}
          disabled={confirmPaid}
        >
          I confirm that {fullName} has paid the total amount{" "}
          {formatCurrency(totalWithBreakfast)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          disabled={!confirmPaid || isMutating}
          onClick={handleBookingUpdate}
        >
          {isMutating ? "Checking In..." : `Check In Booking # ${bookingId}`}
        </Button>
        <Button variation="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
};

export default CheckinBooking;
