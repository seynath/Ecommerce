import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal } from 'antd';
import { base_url } from '../utils/baseUrl';
import { config } from '../utils/axiosconfig';

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  // const fetchSales = async () => {
  //   await axios.get(`${base_url}product/sales-admin`, config)
  //     .then((response) => {
  //       console.log(response.data)

  //       setSalesData(response.data)

        

  //     },
  //     (error) => {
  //       console.log(error);
  //     });
  // };

  const fetchSales = async () => {
    await axios.get(`${base_url}product/sales-admin`, config)
      .then((response) => {
        console.log(response.data)

        // Calculate total quantity for each sale
        const salesWithTotalQuantity = response.data.map(sale => {
          const totalQuantity = Object.values(sale.items).reduce((total, item) => total + item.quantity, 0);
          return { ...sale, total_quantity: totalQuantity };
        });
        console.log(salesWithTotalQuantity);

        setSalesData(salesWithTotalQuantity);

      },
      (error) => {
        console.log(error);
      });
  };


  const showSaledProducts = async(obj)=>{

 
    
    const sales = Object.keys(obj).map(key => ({...obj[key], id: key}));

    sales.forEach(item => {
      item.total_price = item.unit_price * item.quantity;
    });
    

    console.log(sales)
    setSelectedSale(sales)
    setIsModalOpen(true)
  }

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'date_time',
      key: 'date_time',
      sorter: (a, b) => new Date(b.date_time) - new Date(a.date_time),
      
    },
    {
      title: 'Sales ID',
      dataIndex: 'sales_id',
      key: 'sales_id',
      sorter: (a, b) => a.sales_id - b.sales_id,
      defaultSortOrder: 'descend',
      
    },
    {
      title: 'Quantity',
      dataIndex: 'total_quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
   
    {
      title: 'View Ordered Products',
      dataIndex: 'view_ordered_products',
      key: 'view_ordered_products',
      render: (text, record) => (
        <Button type="primary" onClick={() => showSaledProducts(record.items)}>
          View Saled Products
        </Button>
      ),
    },

    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: 'Cashier ID',
      dataIndex: 'cashier_id',
      key: 'cashier_id',
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: 'Branch',
      dataIndex: 'branch_name',
      key: 'branch_name',
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: 'Branch Id',
      dataIndex: 'branch_id',
      key: 'branch_id',
      sorter: (a, b) => a.user_id - b.user_id,
    },
  ];

  // Filter sales data based on the search term
  const filteredSalesData = salesData.filter(sale => {
    return (
      String(sale.date_time).includes(searchTerm) ||
      String(sale.quantity).includes(searchTerm) ||
      String(sale.sales_id).includes(searchTerm) ||
      String(sale.sales_item_id).includes(searchTerm) ||
      String(sale.size_color_quantity_id).includes(searchTerm) ||
      String(sale.total_amount).includes(searchTerm) ||
      String(sale.branch_name).toLowerCase().includes(searchTerm) ||
      String(sale.branch_id).includes(searchTerm)
    );
  });


  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      <h3 className="mb-4 title">Sales</h3>
      <Input
        placeholder="Search sales"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <div>
        <Table columns={columns} dataSource={filteredSalesData} className="" />
      </div>
     
      <Modal
        title="Sales Product Details"
        className="w-75 "
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedSale && selectedSale.length > 0 && (
          <Table
            columns={[
              {
                title: "Product ID",
                dataIndex: "product_id",
                key: "product_id",
                render: (productId) => (
                  <a href={`http://localhost:3001/product/${productId}` }target="_blank">{productId}</a>
                ),
              },
              {
                title: 'Image',
                dataIndex: 'image',
                key: 'product_image',
                render: (imageUrl) => (
                  <img src={imageUrl} alt="Product" style={{ width: '50px', height: '50px' }} />
                ),
              },
              
              {
                title: "Product Name",
                dataIndex: "product_title",
                key: "product_title",
              },
              {
                title: "Size",
                dataIndex: "size_name",
                key: "size_name",
              },
              {
                title: "Color",
                dataIndex: "color_name",
                key: "p_description",
              },
              {
                title: "Brand",
                dataIndex: "brand",
                key: "brand",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "Unit Price",
                dataIndex: "unit_price",
                key: "price",
              },
              {
                title: "Total Amount",
                dataIndex: "total_price",
                key: "totalprice",
              },
            ]}
            dataSource={selectedSale}
            pagination={false}
          />
        )}
        {selectedSale && selectedSale.length === 0 && (
          <p>No products for this supplier.</p>
        )}
      </Modal>
    </div>
  );
};

export default Sales;




// import React, { useEffect, useState } from 'react'
// import { base_url } from '../utils/baseUrl';
// import { config } from '../utils/axiosconfig';
// import axios from 'axios';

// const Sales = () => {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const fetchSales = async () => {
//     await axios.get(`${base_url}product/sales-admin`, config)
//       .then((response) => {
//         console.log(response);
//         setSalesData(response.data);
//       },
//       (error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div className="container mt-5"> {/* Added Bootstrap container and mt-5 classes */}
//       <h2 className="text-center mb-4">Sales Data</h2> {/* Added Bootstrap text-center and mb-4 classes */}
//       <table className="table table-bordered table-striped"> {/* Added Bootstrap table, table-bordered and table-striped classes */}
//         <thead>
//           <tr>
//             <th>Date & Time</th>
//             <th>Quantity</th>
//             <th>Sales ID</th>
//             <th>Sales Item ID</th>
//             <th>Size/Color/Quantity ID</th>
//             <th>Total Amount</th>
//             <th>Cashier ID</th>
//           </tr>
//         </thead>
//         <tbody>
//           {salesData.map((data, index) => (
//             <tr key={index}>
//               <td>{data.date_time}</td>
//               <td>{data.quantity}</td>
//               <td>{data.sales_id}</td>
//               <td>{data.sales_item_id}</td>
//               <td>{data.size_color_quantity_id}</td>
//               <td>{data.total_amount}</td>
//               <td>{data.user_id}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Sales;
