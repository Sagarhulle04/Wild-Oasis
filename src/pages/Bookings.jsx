import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import Heading from "../ui/Heading";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Input from "../ui/Input";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>
      <Row>
        <BookingTable />
      </Row>
    </>
  );
}

export default Bookings;
