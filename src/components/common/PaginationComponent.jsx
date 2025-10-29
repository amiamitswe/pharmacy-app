import { Pagination, Select, SelectItem } from "@heroui/react";
import React from "react";

const limitOption = [
  { label: "2", value: 2 },
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

function PaginationComponent({
  currentPage,
  total,
  onChange,
  limit = 2,
  setLimit,
  showControls = false,
}) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Pagination
        color="secondary"
        page={currentPage}
        total={total}
        onChange={onChange}
        showControls={showControls}
      />

      <Select
        label="Select Limit"
        placeholder="Choose a number"
        selectedKeys={new Set([String(limit)])}
        onSelectionChange={(keys) => {
          const first = Array.from(keys)[0];
          if (first != null) setLimit(Number(first));
        }}
        size="sm"
        className="w-[150px]"
      >
        {limitOption.map((opt) => (
          <SelectItem key={String(opt.value)}>{opt.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default PaginationComponent;
