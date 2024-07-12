import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/baseUrl';
import * as XLSX from 'xlsx';

const InventoryReport = () => {
  const [inventory, setInventory] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await axios.get(`${base_url}report/inventory-report`);
      console.log(response.data);
      setInventory(response.data);
      setInventoryData(response.data.map((item) => ({
        size_color_id: item.size_color_quantity_id,
        product_id: item.p_id,
        product_title: item.p_title,
        brand: item.brand,
        size_name: item.size_name,
        color_name: item.col_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        buying_price: item.buying_price,
        barcode: item.barcode
      })));
    };

    fetchInventory();
  }, []);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'inventory.xlsx');
  };

  return (
    <div className="container">
      <h1 className="mt-4">Inventory Report</h1>
      <button onClick={handleDownloadExcel} className="btn btn-primary mb-3">Download Excel</button>
      <table className="table table-bordered table-hover table-striped mt-2 table-sm">
        <thead>
          <tr>
            <th className="text-center">Size-Color ID</th>
            <th className="text-center">Product ID</th>
            <th className="text-center">Product Title</th>
            <th className="text-center">Brand</th>
            <th className="text-center">Size</th>
            <th className="text-center">Color</th>
            <th className="text-center">Quantity</th>
            <th className="text-center">Unit Price</th>
            <th className="text-center">Buying Price</th>
            <th className="text-center">Bar Code</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.size_color_id}>
              <td className="text-center">{item.size_color_id}</td>
              <td className="text-center">{item.product_id}</td>
              <td className="text-center">{item.product_title}</td>
              <td className="text-center">{item.brand}</td>
              <td className="text-center">{item.size_name}</td>
              <td className="text-center">{item.color_name}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{item.unit_price}</td>
              <td className="text-center">{item.buying_price}</td>
              <td className="text-center">{item.barcode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryReport;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { base_url } from '../utils/baseUrl';
// import * as XLSX from 'xlsx';

// const InventoryReport = () => {
//   const [inventory, setInventory] = useState([]);
//   const [inventoryData, setInventoryData] = useState([]);

//   useEffect(() => {
//     const fetchInventory = async () => {
//       const response = await axios.get(`${base_url}report/inventory-report`);
//       console.log(response.data);
//       setInventory(response.data);
//       setInventoryData(response.data.map((item) => ({
//         size_color_id: item.size_color_quantity_id,
//         product_id: item.p_id,
//         product_title: item.p_title,
//         brand: item.brand,
//         size_name: item.size_name,
//         color_name: item.col_name,
//         quantity: item.quantity,
//         unit_price: item.unit_price,
//         buying_price: item.buying_price,
//         barcode: item.barcode
//       })));
//     };

//     fetchInventory();
//   }, []);

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(inventoryData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
//     XLSX.writeFile(workbook, 'inventory.xlsx');
//   };

//   return (
//     <div>
//       <h1>Inventory Report</h1>
//       <button onClick={handleDownloadExcel}>Download Excel</button>
//       <table>
//         <thead>
//           <tr>
//             <th>Size-Color ID</th>
//             <th>Product ID</th>
//             <th>Product Title</th>
//             <th>Brand</th>
//             <th>Size</th>
//             <th>Color</th>
//             <th>Quantity</th>
//             <th>Unit Price</th>
//             <th>Buying Price</th>
//             <th>Bar Code</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((item) => (
//             <tr key={item.size_color_id}>
//               <td>{item.size_color_id}</td>
//               <td>{item.product_id}</td>
//               <td>{item.product_title}</td>
//               <td>{item.brand}</td>
//               <td>{item.size_name}</td>
//               <td>{item.color_name}</td>
//               <td>{item.quantity}</td>
//               <td>{item.unit_price}</td>
//               <td>{item.buying_price}</td>
//               <td>{item.barcode}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InventoryReport;
