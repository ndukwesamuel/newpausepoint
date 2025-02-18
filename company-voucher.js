import React from "react";
import { LoadMore, MainPaginate } from "../../components/pagination/pagination";
import { useNavigate } from "react-router-dom";
import Search from "../../components/search/search";
import Addbutton from "../../components/button/addbutton";
import Button from "../../components/button/button";

function CompanyVoucher() {
  const navigate = useNavigate();
  // { leaveRequest, company } = useSelector((state) => state);

  const currentItems = [
    {
      id: 1,
      Company: "ABC Inc.",

      Datecreated: "2023-10-09",
      Action: "Edit",
    },

    {
      id: 2,
      Company: "XYZ Corp.",
      Datecreated: "2023-10-10",
      Action: "Delete",
    },

    // Add more sample data objects as needed
  ];

  return (
    <div>
      <div className="flex  justify-center">
        <div className="  w-[90%] ">
          <div className="p-4 flex items-center justify-end">
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
                // onClick={() => navigate("/leave/create-leave")}
              />
            </p>
          </div>
          <div className="mt-5">
            <div className="employeedirtable__body">
              <div className="">
                <div className="relative overflow-x-auto overflow-y-visible min-h-screen">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          S/N
                        </th>

                        <th scope="col" className="px-6 py-3">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date created
                        </th>

                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems?.map((item, i) => (
                        <tr key={i} className="bg-white border-b text-xs">
                          <td className="px-6 py-4">{item?.id}</td>

                          <td className="px-6 py-4">{item?.Company}</td>
                          <td className="px-6 py-4">{item?.Datecreated}</td>
                          <td className="px-6 py-4">{item?.Action}</td>

                          {/* <td
                            className="px-6 py-4"
                            onClick={() =>
                              navigate(`/finance/invoice/${item?.id}`)
                            }
                          >
                            <span className="bg-[#F0F6FA] px-2 py-1 cursor-pointer">
                              View details
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-center">
                  <LoadMore
                  // next={page === pageCount && data?.hasNextPage}
                  // loading={loading === "loadmore"}
                  // handleLoadMore={handleLoadMore}
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  {/* <Pagination /> */}
                  <MainPaginate
                  // pageCount={pageCount} handlePageClick={handlePageClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyVoucher;
