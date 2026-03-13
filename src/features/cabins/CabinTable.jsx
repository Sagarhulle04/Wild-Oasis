import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../utils/apiCabins";
import CabinRow from "./CabinRow";
import { useSearchParams } from "react-router-dom";

const Table = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
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

const CabinTable = () => {
  const { data: cabins = [], isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";
  const sortByValue = searchParams.get("sortBy") || "min-cabin";

  if (isLoading) return <Spinner />;

  let filteredCabins = cabins;

  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);

  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  const sortedCabins = [...filteredCabins];

  if (sortByValue === "min-cabin")
    sortedCabins.sort((a, b) => a.name.localeCompare(b.name));

  if (sortByValue === "max-cabin")
    sortedCabins.sort((a, b) => b.name.localeCompare(a.name));

  if (sortByValue === "min-maxCapacity")
    sortedCabins.sort((a, b) => a.maxCapacity - b.maxCapacity);

  if (sortByValue === "max-maxCapacity")
    sortedCabins.sort((a, b) => b.maxCapacity - a.maxCapacity);

  if (sortByValue === "min-price")
    sortedCabins.sort((a, b) => a.regularPrice - b.regularPrice);

  if (sortByValue === "max-price")
    sortedCabins.sort((a, b) => b.regularPrice - a.regularPrice);

  return (
    <Table role="table">
      <TableHeader>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </TableHeader>

      {sortedCabins.map((cabin) => (
        <CabinRow cabin={cabin} key={cabin.id} />
      ))}
    </Table>
  );
};

export default CabinTable;
