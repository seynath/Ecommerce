import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
// eslint-disable-next-line
import { SiBrandfolder } from "react-icons/si";
import { GrUserAdmin } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaBox } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { FaPeopleCarry } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

      const user = JSON.parse(localStorage.getItem("user"));
      // if (!user) {
      //   navigate("/");
      // }

  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{background:"#252525"}}>
          <h2 className="text-white fs-5 text-center py-3 mb-0 ">
            <span className="sm-logo">NF</span>
            <span className="lg-logo">Nisha Fashion</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
            } else {
              navigate(key);
            }
          }}
          style={{ background: "#090909",  height:"100vh"}}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "customers",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Manage Users",
            },
            {
              key: "Catalog",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Manage Product",
              children: [
                {
                  key: "product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Product",
                },

                {
                  key: "list-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Product List",
                },
                {
                  key: "size",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Size",
                },
                {
                  key: "list-size",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Size List ",
                },
                {
                  key: "category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category",
                },
                {
                  key: "list-category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category List",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Color List",
                },
              ],
            },
            {
              key: "",
              icon: <FaBox  className="fs-4" />,
              label: "Manage Orders",
              children: [
                {
                  key: "orders",
                  icon: <FaBox  className="fs-4" />,
                  label: "Orders",
                },
         
              ],
            },
            {
              key: "sales-admin",
              icon: <FaClipboardList className="fs-4" />,
              label: "Manage Sales",
            },
         
            {
              key: "enquiries",
              icon: <GiTalk  className="fs-4" />,
              label: "Enquiries",
            },

            {
              key: "suppliers",
              icon: <FaPeopleCarry className="fs-4" />,
              label: "Manage Suppliers",
              children:[
                {
                  key: "suppliers",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Add Suppliers",
                },
                {
                  key: "list-supplier",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Supplier List",
                },
              ]
            },

            {
              key: "reports",
              icon: <TbReportMoney  className="fs-4" />,
              label: "Analytical Reports",
              children:[
                {
                  key: "sales-report",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Sales Report",
                },
                {
                  key: "inventory-report",
                  icon: <FaClipboardList className="fs-4" />,
                  label: "Inventory Report",
                },
              ]
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            
            {/* <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div> */}

            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                {/* <img
                  width={32}
                  height={32}
                  src="https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg"
                  alt=""
                /> */}
                <GrUserAdmin />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">{user !== null ? user.firstname : "Admin"}</h5>
                <p className="mb-0">{user !== null ? user.email : "Admin"}</p>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/admin/profile"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    onClick={() => {
                      // Remove the user and tokens from local storage
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");

                      // Refresh the page
                      window.location.href = "/";
                    }}
                  >
                    Signout
                  </button>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
