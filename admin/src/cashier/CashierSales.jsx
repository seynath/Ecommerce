import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

const CashierSales = () => {
  const [productNumber, setProductNumber] = useState("");
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [salesOrderId, setSalesOrderId] = useState(null);
  const [branch, setBranch] = useState(localStorage.getItem("branch") || "");
  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    const fetchBranchList = async () => {
      try {
        const response = await axios.get(`${base_url}cashier/branch/list`);
        setBranchList(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBranchList();
  }, []);

  useEffect(() => {
    localStorage.setItem("branch", branch);
  }, [branch]);

  const debouncedFetchProducts = useCallback(
    _.debounce((number) => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${base_url}product/cashier/${number}`
          );
          const x = response.data[0];
          console.log(response.data[0]);
          if (response.data[0].quantity == 0) {
            setError(null);
            setError("Already Ordered This Product");
            return;
          }else{

            setProduct(x);
            setError(null);
          }
        } catch (err) {
          console.log(err);
          // setError(err.message);
        }
      };
      fetchProducts();
    }, 500),
    []
  );

  useEffect(() => {
    if (productNumber) {
      debouncedFetchProducts(productNumber);
      setError(null);
    }
  }, [productNumber, debouncedFetchProducts]);

  const handleProductNumberChange = (e) => {
    const id = e.target.value;
    setProductNumber(id);
  };

  const handleProductQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (product && quantity > product.quantity) {
      setError(
        `The maximum available quantity for ${product.p_title} is ${product.quantity}`
      );
    } else {
      setError(null);
      setProductQuantity(quantity);
    }
  };

  const addProductToList = (product) => {
    setError(null);
    setProductList([
      ...productList,
      {
        ...product,
        quantity: productQuantity,
        size_color_quantity_id: product.size_color_quantity_id,
      },
    ]);
    setProductNumber("");
    setProduct(null);
    setProductQuantity(1);
  };

  const removeProductFromList = (p_id, size_color_quantity_id) => {
    setProductList(
      productList.filter(
        (product) =>
          product.p_id !== p_id ||
          product.size_color_quantity_id !== size_color_quantity_id
      )
    );
  };

  const clearProductList = () => {
    setError(null);
    setProductList([]);
  };

  const calculateTotal = () => {
    console.log(productList);
    return productList.reduce(
      (total, product) => total + product.unit_price * product.quantity,
      0
    );
  };

  const printBill = async (salesOrderId) =>{
    try {
      console.log(salesOrderId.sales_id);

      // Fetch the bill data from the backend API
      const response = await axios.get(
        `${base_url}cashier/print/bill/${salesOrderId.sales_id}`
      );
      console.log(response);

      const { items, total_price, sales_id, branch_id, user_id } =
        response.data;

      // Generate the pdf document
      const doc = new jsPDF();
      let yPos = 20;

      // Add title
      doc.setTextColor("#000000");
      doc.setFontSize(16);
      doc.text("SALES ORDER", 30, yPos, { align: "center" });
      yPos += 10;

      // Add bill details
      [
        ["Billing Id", sales_id],
        ["Branch Id", branch_id],
        ["User Id", user_id],
      ].forEach(([label, value]) => {
        doc.text(label, 30, yPos, { align: "center" });
        yPos += 10;
      });

      // Add items table
      doc.autoTable({
        head: [
          ["Item Name", "Size", "Color", "Unit Price", "Quantity", "Amount"],
        ],
        body: items.map((item) => [
          item.p_title,
          item.size_name,
          item.color_name,
          parseFloat(item.unit_price).toFixed(2),
          item.quantity,
          parseFloat(item.full_total_price).toFixed(2),
        ]),
        startY: yPos,
        styles: { fontSize: 10, overflow: "linebreak" },
        columnStyles: { amount: { cellWidth: 30 } },
      });

      // Calculate bottom position after adding items table
      yPos = doc.lastAutoTable.finalY;

      // Add subtotal
      doc.setFontSize(12);
      doc.text("Subtotal:", 10, yPos, { align: "left" });
      doc.text(`Rs.${parseFloat(total_price).toFixed(2)}`, 140, yPos, {
        align: "right",
      });
      yPos += 10;

      // Save or preview the generated pdf
      doc.save("sales_order.pdf");
    } catch (error) {
      console.error(error);
    }
  }

  const handleProceedToPayment = async () => {
    if(branch == ""){
      setError("Please select a branch");
      return;
    }
    try {
      console.log(productList);
      const response = await axios.post(
        `${base_url}cashier/sales/create`,
        { products: productList, branch },
        config
      );
      console.log(response.data);
      console.log(response.data.sales_id);
      const x = response.data.sales_id;
      setSalesOrderId(x);
      if (response.status == 201) {
        toast.success("Transaction Succussful")
        
      }
      // Reset product list
      // clearProductList();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  return (
    <div className="container my-5">
      <div className="row d-flex w-100 justify-content-center ">
        <div className=" " style={{ maxWidth: "1000px" }}>
          <div className="card shadow" style={{ minHeight: "700px" }}>
            <div className="card-body w-100">
              <h1 className="text-center mb-4">Cashier Sales</h1>
              <div className="mb-3">
                <label
                  htmlFor="branch"
                  style={{ fontSize: "20px" }}
                  className="mx-2"
                >
                  Branch:
                </label>
                <select
                  style={{ fontSize: "20px" }}
                  id="branch"
                  value={branch}
                  onChange={handleBranchChange}
                >
                  <option style={{ fontSize: "20px" }} value="">
                    Select a branch
                  </option>
                  {branchList.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                className="form-control mb-3 "
                style={{ minHeight: "100px", fontSize: "50px" }}
                value={productNumber}
                onChange={handleProductNumberChange}
                placeholder="Enter Barcode"
              />
              {/* {error && <p className="text-danger">{error}</p>} */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {product && (
                <div className="d-flex align-items-center mb-3">
                  <div className="flex col-9">
                    <ul className="list-group">
                      <li
                        className="list-group-item "
                        style={{ fontSize: "20px", minHeight: "70px" }}
                        key={product.p_id}
                        onClick={() =>
                          addProductToList({
                            ...product,
                            size_color_quantity_id:
                              product.size_color_quantity_id,
                          })
                        }
                      >
                        {product.p_title} | {product.size_name} |{" "}
                        {product.unit_price} |{" "}
                        <img src={product.image_link} width={50} height={50} />
                      </li>
                    </ul>
                  </div>
                  <div className="col-3 ml-3 mx-1">
                    <input
                      type="number"
                      className="form-control"
                      value={productQuantity}
                      onChange={handleProductQuantityChange}
                      placeholder="Quantity"
                      style={{ fontSize: "20px", minHeight: "70px" }}
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
              )}
              <h4 className="pt-5 mb-4">Product List</h4>
              <ul
                className="list-group mb-3 py-3 px-3"
                style={{ backgroundColor: "#D3D3D3" }}
              >
                {productList.map((product) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={product.number}
                  >
                    <span className="grid gap-2">
                      {product.p_title} - Quantity: {product.quantity} - Price:{" "}
                      {product.unit_price} | {product.barcode}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        removeProductFromList(
                          product.p_id,
                          product.size_color_quantity_id
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <h6 className="text-center">
                  {productList.length > 0 ? "" : "No Products Entered"}
                </h6>
              </ul>
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearProductList}
                >
                  Clear
                </button>
                <div className="flex-column">
                  <h2 className="text-right m-0">Total: Rs. {calculateTotal()}</h2>
                  <button
                    type="button"
                    className="btn btn-primary mt-1"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
                <div className="mt-1">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      printBill(salesOrderId);
                    }}
                  >
                    Print Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierSales;

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import _ from "lodash";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig"
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// // Replace this with your actual base URL

// const CashierSales = () => {
//   const [productNumber, setProductNumber] = useState("");
//   const [productList, setProductList] = useState([]);
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [productQuantity, setProductQuantity] = useState(1);
//   const [salesOrderId,setSalesOrderId] = useState(null)
//   const [branch, setBranch] = useState()

//   const debouncedFetchProducts = useCallback(
//     _.debounce((number) => {
//       const fetchProducts = async () => {
//         try {
//           const response = await axios.get(
//             `${base_url}product/cashier/${number}`
//           );
//           const x = response.data[0];
//           await setProduct(x);
//           setError(null);
//         } catch (err) {
//           setError(err.message);
//         }
//       };
//       fetchProducts();
//     }, 500),
//     []
//   ); // 500ms delay

//   useEffect(() => {
//     if (productNumber) {
//       debouncedFetchProducts(productNumber);
//     }
//   }, [productNumber, debouncedFetchProducts]);

//   const handleProductNumberChange = (e) => {
//     const id = e.target.value;
//     setProductNumber(id);
//   };

//   const handleProductQuantityChange = (e) => {
//     const quantity = parseInt(e.target.value, 10);
//     if (product && quantity > product.quantity) {
//       setError(
//         `The maximum available quantity for ${product.p_title} is ${product.quantity}`
//       );
//     } else {
//       setError(null);
//       setProductQuantity(quantity);
//     }
//   };

//   const addProductToList = (product) => {
//     setProductList([...productList, { ...product, quantity: productQuantity, size_color_quantity_id: product.size_color_quantity_id }]);
//     setProductNumber('');
//     setProduct(null);
//     setProductQuantity(1);
//   }

//   const removeProductFromList = (p_id, size_color_quantity_id) => {
//     setProductList(
//       productList.filter(
//         (product) =>
//           product.p_id !== p_id ||
//           product.size_color_quantity_id !== size_color_quantity_id
//       )
//     );
//   };

//   const clearProductList = () => {
//     setProductList([]);
//   };

//   const calculateTotal = () => {
//     console.log(productList);
//     return productList.reduce(
//       (total, product) => total + product.unit_price * product.quantity,
//       0
//     );
//   };

//   const handleProceedToPayment = async () => {
//     try {
//       console.log(productList);
//       const response = await axios.post(`${base_url}cashier/sales/create`, { products: productList }, config);
//       console.log(response.data);
//       console.log(response.data.salesOrder.sales_id);
//       const x = response.data.salesOrder.sales_id
//       setSalesOrderId(x);
//       if(response.status == 201){
//         const printBill = window.confirm("Order placed successfully. Would you like to print the bill?");
//         if (printBill) {
//           printBill(salesOrderId)
//         } else {
//           window.location.reload()
//           // Code for a new transaction
//         }
//       }
//       // Reset product list
//       // clearProductList();
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   async function printBill(salesOrderId) {
//     try {
//       // Fetch the bill data from the backend API
//       const response = await axios.get(`${base_url}cashier/print/bill/${salesOrderId}`);
//       const items = response.data.items;
//       const totalPrice = response.data.total_price;

//       // Generate the pdf document
//       const doc = new jsPDF();
//       let yPos = 20;

//       // Add title
//       doc.setTextColor('#000000');
//       doc.setFontSize(16);
//       doc.text("SALES ORDER", 10, yPos, {'align': 'center'});
//       yPos += 10;

//       // Add items table
//       doc.autoTable({
//         head: [[
//           'Item Name',
//           'Size',
//           'Color',
//           'Unit Price',
//           'Quantity',
//           'Amount'
//         ]],
//         body: items.map(item => [
//           item.p_title,
//           item.size_name,
//           item.color_name,
//           parseFloat(item.unit_price).toFixed(2),
//           item.quantity,
//           parseFloat(item.full_total_price).toFixed(2)
//         ]),
//         startY: yPos,
//         styles: { fontSize: 10, overflow: 'linebreak'},
//         columnStyles: { amount: { cellWidth: 30 } }
//       });

//       // Calculate bottom position after adding items table
//       yPos = doc.lastAutoTable.finalY;

//       // Add subtotal
//       doc.setFontSize(12);
//       doc.text("Subtotal:", 10, yPos, {'align': 'left'});
//       doc.text(`$${parseFloat(totalPrice).toFixed(2)}`, 140, yPos, {'align': 'right'});
//       yPos += 10;

//       // Save or preview the generated pdf
//       doc.save('sales_order.pdf');
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return (
//     <div className="container my-5">
//       <div className="row">
//         <div className="col-md-8 offset-md-3 h-50%">
//           <div className="card shadow">
//             <div className="card-body">
//               <h3 className="text-center mb-4">Cashier Sales</h3>
//               <input
//                 type="number"
//                 className="form-control mb-3"
//                 value={productNumber}
//                 onChange={handleProductNumberChange}
//                 placeholder="Enter product number"
//               />
//               {error && <p className="text-danger">Error: {error}</p>}
//               {product && (
//                 <div className="d-flex align-items-center mb-3">
//                   <div className="flex col-9">
//                     <ul className="list-group">
//                     <li className="list-group-item" key={product.p_id} onClick={() => addProductToList({...product, size_color_quantity_id: product.size_color_quantity_id})}>

//                         {product.p_title} | {product.size_name} |{" "}
//                         {product.unit_price} |{" "}
//                         <img src={product.image_link} width={30} height={30} />
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="col-3 ml-3 mx-1">
//                     <input
//                       type="number"
//                       className="form-control"
//                       value={productQuantity}
//                       onChange={handleProductQuantityChange}
//                       placeholder="Quantity"
//                       min={1}
//                       max={100}
//                     />
//                   </div>
//                 </div>
//               )}
//               <ul className="list-group mb-3">
//                 {productList.map((product) => (
//                   <li
//                     className="list-group-item d-flex justify-content-between align-items-center"
//                     key={product.number}
//                   >
//                     <span>
//                       {product.p_title} - Quantity: {product.quantity} - Price:{" "}
//                       {product.unit_price}
//                     </span>
//                     <button
//                       type="button"
//                       className="btn btn-sm btn-danger"
//                       onClick={() =>
//                         removeProductFromList(
//                           product.p_id,
//                           product.size_color_quantity_id
//                         )
//                       }
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//               <div className="d-flex justify-content-between align-items-center">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={clearProductList}
//                 >
//                   Clear
//                 </button>
//                 <div className="flex-column">
//                   <p className="text-right m-0">Total: {calculateTotal()}</p>

//                   <div className="mt-1">
//                   <button type="button" className="btn btn-primary"
//                   onClick={handleProceedToPayment}
//                   >
//                     Proceed to Payment
//                   </button>
//                   </div>
// <div className="mt-1">

// <button type="button" className="btn btn-success"
// onClick={() => {printBill(salesOrderId)}}
// >
//   Print Bill
// </button>
// </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CashierSales;
