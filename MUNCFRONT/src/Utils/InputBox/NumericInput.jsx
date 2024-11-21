import React from "react";

const NumericInput = ({
  value,
  onChange,
  maxLength,
  placeholder,
  required,
}) => {
  const handleInputChange = (event) => {
    const { value } = event.target;
    // Allow only numbers and enforce max length
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, maxLength);
    onChange(numericValue);
  };

  return (
    <div className="form-input">
      <input
        className="form-control rounded-0"
        type="text"
        value={value}
        onChange={handleInputChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default NumericInput;
