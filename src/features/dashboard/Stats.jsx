import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";
import Stat from "./Stat";
import Spinner from "../../ui/Spinner";
import { getCabins } from "../../utils/apiCabins";

function Stats() {
  const { isLoading: isBookingsLoading, bookings = [] } = useRecentBookings();
  const {
    isLoading: isStaysLoading,
    confirmedStays = [],
    numDays,
  } = useRecentStays();

  const { isLoading: isCabinsLoading, data: cabins = [] } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (isBookingsLoading || isStaysLoading || isCabinsLoading) {
    return <Spinner />;
  }

  const cabinCount = cabins?.length ?? 0;

  const numBookings = bookings.length;
  const sales = bookings.reduce(
    (acc, cur) => acc + Number(cur.totalPrice ?? 0),
    0,
  );
  const checkins = confirmedStays.length;

  // Occupancy rate: booked nights / (available days * cabin count)
  const occupationDenominator = (numDays ?? 0) * cabinCount;
  const occupation =
    occupationDenominator > 0
      ? confirmedStays.reduce(
          (acc, cur) => acc + Number(cur.numNights ?? 0),
          0,
        ) / occupationDenominator
      : 0;

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title="Bookings"
        value={numBookings}
        color="blue"
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Sales"
        value={formatCurrency(sales)}
        color="green"
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        title="Check ins"
        value={checkins}
        color="indigo"
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title="Occupancy rate"
        value={Math.round(occupation * 100) + "%"}
        color="yellow"
      />
    </>
  );
}

export default Stats;
