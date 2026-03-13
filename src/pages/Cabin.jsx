import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getCabinsById } from "../utils/apiCabins";
import Spinner from "../ui/Spinner";

const Cabin = () => {
  const { cabinId } = useParams();

  const { data: cabin, isLoading } = useQuery({
    queryKey: ["cabins", cabinId],
    queryFn: () => getCabinsById(cabinId),
  });

  // console.log(cabin);
  if (isLoading) return <Spinner />;

  return <div>Cabin</div>;
};

export default Cabin;
