import React, { useState } from "react";
import Search from "../../../components/search/search";
import FormName from "../../../components/form-name/form-name";

import ModalContainer from "../../../components/modal-container/modal-container";
import { BiPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Addbutton from "../../../components/button/addbutton";

import { BadgeBorder } from "../../../components/badge/badge";

import Option from "../../../components/oprion/option";
import { IconContext } from "react-icons";
import { AiFillDelete } from "react-icons/ai";

import {
  LoadMore,
  MainPaginate,
  MainRanger,
} from "../../../components/pagination/pagination";
import Button from "../../../components/button/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  manageVoucher,
  resetvoucherSearch,
} from "../../../data/Reducers/VoucherReducer";

const currentItems = [
  {
    S_N: 1,
    Company: "ABC Inc.",
    Paying_Bank: "Bank of XYZ",
    Description: "Payment for services",
    Amount: "$100.00",
    Amount_in_words: "One hundred dollars",
    Datecreated: "2023-10-09",
    status: "Paid",
    Action: "Edit",
  },
  {
    S_N: 2,
    Company: "XYZ Corp.",
    Paying_Bank: "National Bank",
    Description: "Product purchase",
    Amount: "$50.00",
    Amount_in_words: "Fifty dollars",
    Datecreated: "2023-10-10",
    status: "Pending",
    Action: "Delete",
  },
  {
    S_N: 3,
    Company: "LMN Ltd.",
    Paying_Bank: "First Savings",
    Description: "Invoice payment",
    Amount: "$75.00",
    Amount_in_words: "Seventy-five dollars",
    Datecreated: "2023-10-11",
    status: "Success",
    Action: "Edit",
  },
  {
    S_N: 4,
    Company: "PQR Co.",
    Paying_Bank: "Regional Bank",
    Description: "Membership fee",
    Amount: "$30.00",
    Amount_in_words: "Thirty dollars",
    Datecreated: "2023-10-12",
    status: "Pending",
    Action: "Delete",
  },
  // Add more sample data objects as needed
];

function Voucher() {
  const [detail, setDetail] = useState(false);
  let dispatch = useDispatch();
  const navigate = useNavigate();
  let [range, setRange] = useState(10),
    { voucher, job, company } = useSelector((state) => state);

  const toggleDetail = () => {
    setDetail(!detail);
  };
  // const [downdata, setDowndata] = useState("second")
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  let drop_down_data = [
    "Reviewing",
    "Interviewing",
    "Assessing",
    "Tested",
    "Recruited",
    "Rejected",
  ];

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleItemClick = (item) => {
    setSelectedItem(item); // Update the selected item
    toggleDropdown(); // Close the dropdown after selecting an item
  };

  useEffect(() => {
    dispatch(manageVoucher("get", null, company?.currentSelected));
    dispatch(resetvoucherSearch());
    return () => {};
  }, []);

  const [data, setData] = useState(null);
  useEffect(() => {
    if (voucher?.data) setData(voucher?.data);
  }, [voucher?.data]);

  console.log(data);

  let currentItems = data?.data.docs;

  const InvoiceGeneratorHeader = ({ title, datavalue }) => {
    return (
      <div className="bg bg-white    w-full  2xl:w-[270px] rounded-xl py-5 h-[150px] shadow-xl p-4 cursor-pointer mb-5">
        <div className="bg-white  text-base 2xl:text-[2rem] w-full  text-center lg:py-7 lg:px-6  py-5 px-3  2xl:py-16 2xl:px-10">
          <p className=" font-semibold   2xl:mb-2 text-base "> {title}</p>
          <div className="bg-[#EAEAEA] py-1 border rounded mt-1 2xl:py-4 lg:py-2 lg:px-4 font-semibold  text-base">
            <p className=""> {datavalue}</p>{" "}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <div className="p-4 flex items-center justify-between">
          <Button buttonType={"primary"} title={"Manage companies"} />

          <p className="flex items-center gap-2 font-medium">
            {/* <Button
              buttonType={"secondary"}
              title={"Create Request"}
              icon={<AiTwotoneCalendar />}
              width={"w-fit"}
              onClick={() => navigate("/leave/create-leave")}
            /> */}
            <Addbutton
              background={"bg-[#2C78C6]"}
              create={true}
              text={"Create"}
              onClick={() => navigate("/leave/create-leave")}
            />
          </p>
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                S/N
              </th>
              <th scope="col" className="px-6 py-3">
                Company
              </th>
              <th scope="col" className="px-6 py-3">
                Paying Bank
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Amount in words
              </th>

              <th scope="col" className="px-6 py-3">
                Date created
              </th>

              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((it, i) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={i}
              >
                <td className="w-4 p-4">{i + 1}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <FormName item={it?.createdBy?.profile} />
                </th>
                <td className="px-6 py-4">
                  {/* {moment(it?.createdAt).format("dddd Do, MMM")} */}

                  {it?.Paying_Bank}
                </td>
                <td className="px-6 py-4">{it?.Description}</td>
                <td className="px-6 py-4">{it?.Amount}</td>
                <td className="px-6 py-4">{it?.Amount_in_words}</td>
                <td className="px-6 py-4">{it?.Datecreated}</td>

                <td className="px-6 py-4">
                  <div className="cursor-pointer">
                    <BadgeBorder
                      type={
                        it?.status?.toLowerCase() === "Success"
                          ? 1
                          : it?.status?.toLowerCase() === "pending"
                          ? 3
                          : 2
                      }
                      text={it?.status}
                    />
                  </div>
                </td>
                <td className="px-6 py-4"> View Voucher</td>

                {/* <td className="px-6 py-4">
                  <Option type={"horizontal"}>
                    <ul className="">
                      <li>
                        <IconContext.Provider value={{ color: "#2A72A8" }}>
                          <AiFillDelete size={20} />
                        </IconContext.Provider>
                      </li>
                    </ul>
                  </Option>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalContainer
        title={"Delete Invoice"}
        width={"max-w-sm"}
        show={false}
        // close={() => setDelete(null)}
      >
        <div className="mx-20">
          <form className="space-y-4">
            <div className="my-auto w-100">
              <p className="text2 Lexend text-center">Do you want to delete</p>
              <div className="pt-4 flex">
                <Button
                  buttonType={"primary"}
                  title={"Yes"}
                  type="button"
                  width={"w-fit me-2"}
                  // loading={loading}
                  // onClick={handleSubmit}
                />
                <Button
                  buttonType={"secondary"}
                  title={"No"}
                  type="button"
                  width={"w-fit ms-2"}
                  // onClick={() => setDelete(null)}
                />
              </div>
            </div>
          </form>
        </div>
      </ModalContainer>
    </div>
  );
}

export default Voucher;
