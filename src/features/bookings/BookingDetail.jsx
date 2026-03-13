import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import Spinner from "../../ui/Spinner";
// import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import { useQuery } from "@tanstack/react-query";
import ButtonText from "../../ui/ButtonText";
import { bookingId as getBookingById } from "../../utils/apiBookings.js";
import BookingDataBox from "./BookingDataBox.jsx";
// import Modal from "../../ui/Modal";
// import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId),
  });

  console.log(booking);

  if (isLoading) return <Spinner />;

  const status = booking?.status;

  // We return a fragment so that these elements fit into the page's layout
  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading type="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status?.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={() => navigate(-1)}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Button variation="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
