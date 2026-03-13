import styled from "styled-components";

const StyledPagination = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;
  color: var(--color-grey-600);

  & span {
    font-weight: 600;
    color: var(--color-grey-800);
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const PaginationButton = styled.button`
  min-width: 3.2rem;
  height: 3.2rem;

  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);

  background-color: ${(props) =>
    props.active ? "var(--color-brand-600)" : "var(--color-grey-0)"};

  color: ${(props) =>
    props.active ? "var(--color-brand-50)" : "var(--color-grey-700)"};

  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
    border-color: var(--color-brand-600);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  & svg {
    height: 1.6rem;
    width: 1.6rem;
  }
`;

import React from "react";

const Pagination = ({ pages }) => {
  const currentPageNumber = pages + 1;
  return (
    <StyledPagination>
      <Buttons>
        <PaginationButton active={pages === currentPageNumber}>
          Previous
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
};

export default Pagination;
