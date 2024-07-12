import React from "react";

const Color = ({ sizeColorQuantity, onColorChange, selectedColor }) => {
  const uniqueColorCodes = [
    ...new Set(sizeColorQuantity?.map((item) => item.color_code)),
  ];

  // console.log(uniqueColorCodes);

  return (
    <ul className="colors ps-0">
      {uniqueColorCodes?.map((colorCode) => (
        <li
          key={colorCode}
          style={{
            backgroundColor: colorCode,
            cursor: "pointer",
            border: "1px solid rgb(254,189,105)",
            borderWidth: selectedColor === colorCode ? "3px" : "1px", // Use the selectedColor prop in the ternary expression
          }}
          className="color"
          onClick={() => onColorChange(colorCode)}
        ></li>
      ))}
    </ul>
  );
};

export default Color;

// import React from "react";

// const Color = (props) => {
//   const { color } = props;

//   return (
//     <>
//       <ul className="colors ps-0">
//         {color?.map((colorItem) => (
//           <li
//             key={colorItem.col_code}
//             style={{ backgroundColor: colorItem.col_code }}
//             className="color"
//           >
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default Color;

// const Color = (props) => {
//   console.log(props);
//   const { color } = props;

//   return (
//     <>
//       <ul className="colors ps-0">
//         <li></li>
//         <li></li>
//         <li></li>
//         <li></li>
//       </ul>
//     </>
//   );
// };
