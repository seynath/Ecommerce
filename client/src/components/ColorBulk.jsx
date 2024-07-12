import React from "react";

const ColorBulk = ({ sizeColorQuantity, onColorChange, selectedColor }) => {
  const uniqueColors = [
    ...new Set(sizeColorQuantity?.map((item) => ({ color_code: item.color_code, color_name: item.color_name }))),
  ];

  return (
    <ul className="colors ps-0">
      {uniqueColors?.map((color) => (
        <li
          key={color.color_code}
          style={{
            backgroundColor: color.color_code,
            cursor: "pointer",
            border: "1px solid rgb(254,189,105)",
            borderWidth: selectedColor === color.color_code ? "3px" : "1px",
          }}
          className="color"
          onClick={() => onColorChange(color.color_code)}
        >
          {color.color_name}
        </li>
      ))}
    </ul>
  );
};

export default ColorBulk;
