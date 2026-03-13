import { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../utils/apiCabins";
import CabinTable from "../features/cabins/CabinTable";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import AddCabin from "./AddCabin";
import Filter from "../ui/Filter";
import TableOperations from "../ui/TableOperations";
import SortBy from "../ui/SortBy";

function Cabins() {
  const { data: cabins, isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <TableOperations>
          <Filter
            filterField="discount"
            options={[
              { value: "all", label: "All" },
              { value: "no-discount", label: "No Discount" },
              { value: "with-discount", label: "With Discount" },
            ]}
          />
          <SortBy
            cabins={cabins}
            options={[
              { value: "min-cabin", label: "Sort By Cabin (A-Z)" },
              { value: "max-cabin", label: "Sort By Cabin (Z-A)" },
              { value: "min-maxCapacity", label: "Sort By Capacity (A-Z)" },
              { value: "max-maxCapacity", label: "Sort By Cabin (Z-A)" },
              { value: "min-price", label: "Sort By Price (A-Z)" },
              { value: "max-price", label: "Sort By Price (Z-A)" },
            ]}
          />
        </TableOperations>
      </Row>
      <Row>
        <CabinTable />
        <AddCabin />
      </Row>
    </>
  );
}

export default Cabins;
