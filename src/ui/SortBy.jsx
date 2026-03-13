import React from "react";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

const SortBy = ({ options, cabins }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function onChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <div>
      <Select options={options} onChange={onChange} />
    </div>
  );
};

export default SortBy;
