"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { api } from "../../lib/api";
import employeeProgress from "../../../mock_hrms/fixtures/employee_progress.json";

export default function OnboardingTrackerPage() {

  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("All");

  async function load(){

    const data = await api.listEmployees();

    setEmployees(data);

  }

  useEffect(()=>{

    load();

  },[]);

  const getProgress = (employeeId:string)=>{

    return (

      employeeProgress.find(
        (item:any)=>
          item.employee_id === employeeId
      )?.progress || 0

    );


  };
  const getStatus = (progress:number)=>{


    if(progress >= 70){

      return "Completed";

    }


    if(progress >= 40){

      return "In Progress";

    }


    return "Pending";


  };

  const statusStyle = (status:string)=>{


    switch(status){


      case "Completed":

        return "bg-green-100 text-green-700";



      case "In Progress":

        return "bg-yellow-100 text-yellow-700";



      case "Pending":

        return "bg-gray-100 text-gray-700";



      default:

        return "bg-gray-100 text-gray-700";


    }


  };

  const departments = useMemo(()=>{


    const list = employees.map(
      (employee)=>employee.department
    );


    return [

      "All",

      ...Array.from(new Set(list))

    ];


  },[employees]);

  const filteredEmployees = useMemo(()=>{


    const q = search.toLowerCase();



    return employees.filter((employee)=>{


      const matchesSearch =

      [

        employee.employee_id,

        employee.name,

        employee.department,

        employee.email

      ]

      .join(" ")

      .toLowerCase()

      .includes(q);


      const matchesDepartment =

      department === "All" ||

      employee.department === department;

      return matchesSearch && matchesDepartment;



    });


  },[

    employees,

    search,

    department

  ]);

  return (


    <Sidebar>


      <div className="min-h-screen bg-[#FAFAF9] p-8">

        {/* Header */}


        <div>

          <p className="uppercase tracking-[0.25em] text-xs text-[#D9A653]">

            HRMS

          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#14213D]">

            Onboarding Tracker

          </h1>

          <p className="mt-2 text-gray-500">

            Track employee onboarding completion progress.

          </p>

        </div>

        {/* Main Card */}

        <div className="mt-8 rounded-2xl border bg-white shadow-sm">

          {/* Search Filter Section */}

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b p-6 gap-6">


            {/* Search + Dropdown */}


            <div className="flex flex-col md:flex-row items-center gap-8">


              <input

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                placeholder="Search employees..."

                className="w-full md:w-80 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9A653]"

              />
              <select

                value={department}

                onChange={(e)=>setDepartment(e.target.value)}

                className="w-full md:w-52 rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9A653]"

              >

                {
                  departments.map((dept:string)=>(


                    <option

                      key={dept}

                      value={dept}

                    >

                      {dept}

                    </option>


                  ))
                }


              </select>

            </div>

            {/* Employee Count */}


            <div className="text-sm font-medium text-gray-500 whitespace-nowrap">


              Total Employees:


              <span className="ml-2 font-bold text-[#14213D]">

                {filteredEmployees.length}

              </span>


            </div>

          </div>

          {/* Table */}


          <div className="overflow-x-auto">


            <table className="min-w-full">


              <thead className="bg-gray-50">


                <tr className="text-left text-sm text-gray-600">


                  <th className="p-4">
                    Employee ID
                  </th>


                  <th className="p-4">
                    Employee Name
                  </th>


                  <th className="p-4">
                    Department
                  </th>


                  <th className="p-4">
                    Date of Joining
                  </th>


                  <th className="p-4">
                    Progress
                  </th>


                  <th className="p-4">
                    Status
                  </th>


                  <th className="p-4">
                    Action
                  </th>


                </tr>


              </thead>

              <tbody>

              {


              filteredEmployees.map((employee)=>{


                const progress = 
                getProgress(employee.employee_id);



                const status =
                getStatus(progress);


                return (



                  <tr

                    key={employee.id}

                    className="border-t hover:bg-gray-50"

                  >

                    <td className="p-4 font-semibold text-[#14213D]">

                      {employee.employee_id}

                    </td>

                    <td className="p-4">


                      <div className="font-semibold text-[#14213D]">

                        {employee.name}

                      </div>

                    </td>

                    <td className="p-4">

                      {employee.department}

                    </td>

                    <td className="p-4">

                      {employee.joining_date || "-"}

                    </td>

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-32 h-3 rounded-full bg-gray-200 overflow-hidden">


                          <div

                            className="h-3 rounded-full bg-[#14213D]"

                            style={{

                              width:`${progress}%`

                            }}

                          />


                        </div>

                        <span className="text-sm font-semibold">

                          {progress}%

                        </span>

                      </div>

                    </td>

                    <td className="p-4">


                      <span

                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(status)}`}

                      >

                        {status}

                      </span>


                    </td>

                    <td className="p-4">


                      <button

                        onClick={()=>router.push(`/directory/${employee.id}`)}

                        className="rounded-lg bg-[#14213D] px-4 py-2 text-sm text-white hover:bg-[#243654] transition"

                      >

                        View

                      </button>


                    </td>

                  </tr>


                );


              })


              }

              {
                filteredEmployees.length === 0 && (

                  <tr>

                    <td

                      colSpan={7}

                      className="p-10 text-center text-gray-500"

                    >

                      No employees found.

                    </td>


                  </tr>


                )
              }
              </tbody>

            </table>
          </div>

        </div>

      </div>

    </Sidebar>


  );


}