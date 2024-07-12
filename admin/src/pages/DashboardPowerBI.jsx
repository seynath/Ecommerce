import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import Chart from "chart.js/auto";

export const DailyOrdersChart = ({ dailyOrdersData }) => {
  const chartData = {
    labels: dailyOrdersData.map((data) => data.order_date),
    datasets: [
      {
        label: "Daily Orders",
        data: dailyOrdersData.map((data) => data.daily_orders),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  return <Bar data={chartData} />;
};

export const DailySalesChart = ({ dailySalesData }) => {
  const chartData = {
    labels: dailySalesData?.map((data) => data.date) || [],
    datasets: [
      {
        label: "Daily Sales",
        data: dailySalesData?.map((data) => data.daily_sales) || [],
        backgroundColor: "rgba(255, 199, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  return <Line data={chartData} />;
};
export const DailySalesGanemulla = ({ dailySalesData }) => {
  const chartData = {
    labels: dailySalesData?.map((data) => data.date) || [],
    datasets: [
      {
        label: "Daily Sales",
        data: dailySalesData?.map((data) => data.daily_sales) || [],
        backgroundColor: "rgba(75, 99, 232, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  return <Bar data={chartData} />;
};
export const DailySalesGampaha = ({ dailySalesData }) => {
  const chartData = {
    labels: dailySalesData?.map((data) => data.date) || [],
    datasets: [
      {
        label: "Daily Sales",
        data: dailySalesData?.map((data) => data.daily_sales) || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    ],
  };

  return <Bar data={chartData} />;
};

const DashboardPowerBI = () => {
  const [dailyOrdersData, setDailyOrdersData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [dailySalesGampahaData, setDailySalesGampahaData] = useState([])
  const [dailySalesGanemullaData, setDailySalesGanemullaData] = useState([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Orders",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [dailyOrderCountData, setDailyOrderCountData] = useState({
    labels: [],
    datasets: [
      {
        label: "Daily Order Count",
        data: [],
        backgroundColor: "rgba(192, 75, 192, 0.6)",
        borderColor: "rgba(192, 75, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );

  const getDailyOrderCount = (data) => {
    const orderCounts = {};

    data.forEach((item) => {
      const date = new Date(item.date_time).toLocaleDateString();
      if (!orderCounts[date]) {
        orderCounts[date] = 1;
      } else {
        orderCounts[date]++;
      }
    });

    return orderCounts;
  };

  useEffect(() => {
    const fetchDailyOrders = async () => {
      try {
        const response = await axios.get(`${base_url}chart/dailyOrders`);
        console.log(response.data);
        setDailyOrdersData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSales = async () => {
      try {
        const response = await axios.get(`${base_url}chart/sales`);
        console.log(response.data);
        setDailySalesData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDailyOrders();
    fetchSales();
    fetchGanemullaSales();
    fetchGGampahaSales();
  }, []);

  const fetchGanemullaSales = async ()=>{
    try {
      const response = await axios.get(`${base_url}chart/sales/ganemulla`);
      console.log(response.data);
      setDailySalesGanemullaData(response.data)

    }catch(err){
      console.log(err);
    
    }}
  const fetchGGampahaSales = async ()=>{
    try {
      const response = await axios.get(`${base_url}chart/sales/gampaha`);
      console.log(response.data);
      setDailySalesGampahaData(response.data)
    }catch(err){
      console.log(err);
    
    }}

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axios.get(`${base_url}chart/orderChart`, {
          params: { fromDate, toDate },
          config,
        });
        console.log(data);

        const labels = data.map((item) =>
          new Date(item.date_time).toLocaleDateString()
        );
        const orders = data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Orders",
              data: orders,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        const orderCounts = getDailyOrderCount(data);

        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push(date.toLocaleDateString());
        }

        const dailyOrderCounts = days.map((day) => orderCounts[day] || 0);

        setDailyOrderCountData({
          labels: days,
          datasets: [
            {
              label: "Daily Order Count",
              data: dailyOrderCounts,
              backgroundColor: "rgba(192, 75, 192, 0.6)",
              borderColor: "rgba(192, 75, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 60000); // Fetch data every minute

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [fromDate, toDate]);


  return (
    <div className="d-flex w-100 h-100 flex-column">
      <h3>Online Order Analytics</h3>

      <div className="row w-100 d-flex justify-content-center">
        <div className="col-4">
          <h5>Daily Online Amount</h5>
          <Bar data={chartData} />
        </div>

        <div className="col-8">
          <h5>Online Orders</h5>
          <DailyOrdersChart dailyOrdersData={dailyOrdersData} />
        </div>
      </div>
      <div className="row w-100 d-flex justify-content-around mt-4">
        <div className="col-8">
          <h3>Daily Sales</h3>
          <DailySalesChart dailySalesData={dailySalesData} />
        </div>
        <div className="col-4">
          <div className="row">

          <h5>Ganemulla Branch Sales</h5>
          <DailySalesGanemulla dailySalesData={dailySalesGanemullaData} />
          </div>
          <div className="row">

          <h5>Gampaha Branch Sales</h5>
          <DailySalesGampaha dailySalesData={dailySalesGampahaData} />
          </div>
        </div>
      </div>
      {/* <div className="row w-100  d-flex justify-content-around mt-4">

      <div className="col-8">
          <h3>Hot Selling Items</h3>
          <DailySalesChart dailySalesData={dailySalesData} />
        </div>
        <div className="col-4">
          <div className="row">

          <h5>Ganemulla Branch Sales</h5>
          <DailySalesGanemulla dailySalesData={dailySalesGanemullaData} />
          </div>
          <div className="row">

          <h5>Gampaha Branch Sales</h5>
          <DailySalesGampaha dailySalesData={dailySalesGampahaData} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardPowerBI;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar ,Line} from "react-chartjs-2";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig";
// import Chart from "chart.js/auto";

// export const DailyOrdersChart = ({ dailyOrdersData }) => {
//   const chartData = {
//     labels: dailyOrdersData.map(data => data.order_date),
//     datasets: [
//       {
//         label: 'Daily Orders',
//         data: dailyOrdersData.map(data => data.daily_orders),
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//         options:{
//           scales:{
//             y:{
//               beginAtZero:true

//             }
//         }

//       },}
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// export const DailySalesChart = ({ dailySalesData }) => {
//   const chartData = {
//     labels: dailySalesData?.map(data => data.date),
//     datasets: [
//       {
//         label: 'Daily Orders',
//         data: dailySalesData.map(data => data.daily_sales),
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//         options:{
//           scales:{
//             y:{
//               beginAtZero:true

//             }
//         }

//       },}
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// const DashboardPowerBI = () => {
//   const [dailyOrdersData, setDailyOrdersData] = useState([]);
//   const [dailySalesData, setDailySalesData] = useState([]);
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Orders",
//         data: [],
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   });

//   const [dailyOrderCountData, setDailyOrderCountData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: "Daily Order Count",
//         data: [],
//         backgroundColor: "rgba(192, 75, 192, 0.6)",
//         borderColor: "rgba(192, 75, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   });

//   const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
//   const [fromDate, setFromDate] = useState(
//     new Date(new Date().setDate(new Date().getDate() - 7))
//       .toISOString()
//       .split("T")[0]
//   );

//   const getDailyOrderCount = (data) => {
//     const orderCounts = {};

//     data.forEach((item) => {
//       const date = new Date(item.date_time).toLocaleDateString();
//       if (!orderCounts[date]) {
//         orderCounts[date] = 1;
//       } else {
//         orderCounts[date]++;
//       }
//     });

//     return orderCounts;
//   };

//   useEffect(() => {
//     const fetchDailyOrders = async () => {
//       try {
//         const  response  = await axios.get(`${base_url}chart/dailyOrders`);
//         console.log(response.data);
//         setDailyOrdersData(response.data);

//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchSales = async()=>{
//       try {
//         const response = await axios.get(`${base_url}chart/sales`);
//         console.log(response.data);
//         setDailySalesData(response.data)
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     fetchDailyOrders();
//     fetchSales();
//   }, []);

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const { data } = await axios.get(`${base_url}chart/orderChart`, {
//           params: { fromDate, toDate },
//           config,
//         });
//         console.log(data);

//         const labels = data.map((item) =>
//           new Date(item.date_time).toLocaleDateString()
//         );
//         const orders = data.map((item) => item.total);

//         setChartData({
//           labels,
//           datasets: [
//             {
//               label: "Orders",
//               data: orders,
//               backgroundColor: "rgba(75, 192, 192, 0.6)",
//               borderColor: "rgba(75, 192, 192, 1)",
//               borderWidth: 1,
//             },
//           ],
//         });

//         const orderCounts = getDailyOrderCount(data);

//         const days = [];
//         for (let i = 6; i >= 0; i--) {
//           const date = new Date();
//           date.setDate(date.getDate() - i);
//           days.push(date.toLocaleDateString());
//         }

//         const dailyOrderCounts = days.map((day) => orderCounts[day] || 0);

//         setDailyOrderCountData({
//           labels: days,
//           datasets: [
//             {
//               label: "Daily Order Count",
//               data: dailyOrderCounts,
//               backgroundColor: "rgba(192, 75, 192, 0.6)",
//               borderColor: "rgba(192, 75, 192, 1)",
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchChartData();
//     const interval = setInterval(fetchChartData, 60000); // Fetch data every minute

//     return () => clearInterval(interval); // Clean up the interval on component unmount
//   }, [fromDate, toDate]);

//   return (
//     <div className="d-flex w-100 h-100 flex-column">
//       <h1>Order Analytics</h1>

//       <div className="row w-100 d-flex justify-content-center">
//         <div className="col-4" >
//           <h2>Daily Online Amount</h2>

//           <Bar data={chartData} />
//         </div>

//         <div className="col-8" >
//           <h2>Online Orders</h2>
//           <DailyOrdersChart dailyOrdersData={dailyOrdersData}/>

//         </div>
//       </div>
//       <div className="row w-100 d-flex justify-content-around">
//         <div className="col-4" >
//           <h2>Daily Order Count</h2>
//           <DailySalesChart dailyOrdersData={dailySalesData}/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPowerBI;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import { base_url } from '../utils/baseUrl';
// import { config } from '../utils/axiosconfig';
// import Chart from 'chart.js/auto';

// const DashboardPowerBI = () => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: 'Orders',
//         data: [],
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }
//     ]
//   });

//   // default to date should back to 7 days from now on, to date is today
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [fromDate, setFromDate] = useState(
//     new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
//   );

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const { data } = await axios.get(`${base_url}chart/orderChart`, {
//           params: { fromDate, toDate },
//           config
//         });
//         console.log(data);

//         const labels = data.map(item => new Date(item.date_time).toLocaleDateString());
//                 const orders = data.map(item => item.total);

//         setChartData({
//           labels,
//           datasets: [
//             {
//               label: 'Orders',

//               data: orders,
//               backgroundColor: 'rgba(75, 192, 192, 0.6)',
//               borderColor: 'rgba(75, 192, 192, 1)',
//               borderWidth: 1
//             }
//           ]
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchChartData();
//   }, [fromDate, toDate]);

//   return (
//     <div>
//       <h2>Orders Chart</h2>
//       <Bar data={chartData} />
//     </div>
//   );
// };

// export default DashboardPowerBI;

// import React from 'react'
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';

// const DashboardPowerBI = () => {
//   return (

//     <div>
//       <iframe title="ecom" width="1140" height="900" src="https://app.powerbi.com/reportEmbed?reportId=a6fe5519-cb75-46be-a31a-a9cb478555e9&autoAuth=true&ctid=aa232db2-7a78-4414-a529-33db9124cba7" frameborder="0" allowFullScreen="true"></iframe>
//     </div>

//   )
// }

// export default DashboardPowerBI
