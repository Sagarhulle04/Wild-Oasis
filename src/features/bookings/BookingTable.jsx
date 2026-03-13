import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { allBookings } from "../../utils/apiBookings";
import { useQuery } from "@tanstack/react-query";
import BookingRow from "./BookingRow";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const Table = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1.6rem;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function BookingTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchNameQuery, setSearchNameQuery] = useState("");

  const [searchParams] = useSearchParams();

  const sortedValue = searchParams.get("sortBy") || "startDate-desc";
  const filteredValue = searchParams.get("status") || "all";

  const {
    data: bookings,
    isLoading: isBookingLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: allBookings,
  });

  if (isBookingLoading) return <Spinner />;
  if (isError) return <p>Error loading bookings. Check the console.</p>;

  let filteredBooking = bookings;

  if (searchNameQuery.length > 0) {
    filteredBooking = filteredBooking.filter((booking) =>
      booking.guests.fullName
        .toLowerCase()
        .includes(searchNameQuery.toLowerCase()),
    );
  }

  // console.log(searchName);

  if (filteredValue && filteredValue !== "all") {
    filteredBooking = filteredBooking.filter(
      (booking) => booking.status === filteredValue,
    );
  }

  if (sortedValue === "startDate-desc") {
    filteredBooking = filteredBooking
      .slice()
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  if (sortedValue === "startDate-asc") {
    filteredBooking = filteredBooking
      .slice()
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  if (sortedValue === "totalPrice-desc") {
    filteredBooking = filteredBooking
      .slice()
      .sort((a, b) => b.totalPrice - a.totalPrice);
  }

  if (sortedValue === "totalPrice-asc") {
    filteredBooking = filteredBooking
      .slice()
      .sort((a, b) => a.totalPrice - b.totalPrice);
  }

  const PAGE_SIZE = 6;
  const total_pages = filteredBooking.length;
  const noOfPages = Math.ceil(total_pages / PAGE_SIZE);

  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filteredBooking.length);

  function handleNextPage(n) {
    setCurrentPage(n);
  }

  function handleNextPageButton() {
    setCurrentPage((currentPage) => currentPage + 1);
  }

  function handlePreviousPage() {
    setCurrentPage((currentPage) => currentPage - 1);
  }

  return (
    <>
      <Input
        placeholder="enter the name to search ..."
        value={searchNameQuery}
        onChange={(e) => setSearchNameQuery(e.target.value)}
      />
      <Table role="table">
        <TableHeader>
          <div>Cabin</div>
          <div>Guests</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
        </TableHeader>

        {filteredBooking.slice(start, end).map((booking) => (
          <BookingRow booking={booking} key={booking.id} />
        ))}
      </Table>

      <PaginationRow>
        <span>
          Showing {start} to {end} of {filteredBooking.length}
        </span>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            disabled={currentPage === 0}
            style={{ cursor: "pointer" }}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>
          {/* {[...Array().keys()].map((n) => (
          <span key={n} onClick={() => handleNextPage(n)}>
            <Pagination key={n} pages={start} />
          </span>
        ))} */}
          <Button
            disabled={currentPage + 1 === noOfPages}
            style={{ cursor: "pointer" }}
            onClick={handleNextPageButton}
          >
            Next
          </Button>
        </div>
      </PaginationRow>
    </>
  );
}

export default BookingTable;
