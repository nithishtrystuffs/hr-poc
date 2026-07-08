"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import employeeDocuments from "../../../../mock_hrms/fixtures/employee_document.json";
import employeeTimeline from "../../../../mock_hrms/fixtures/employee_timeline.json";


export default function EmployeeProfile() {

  const router = useRouter();

  const params = useParams<{ id: string }>();

  const id = params.id;


  const [employee, setEmployee] = useState<any>(null);



  // Employee Documents

  const documents =
    employee
      ? employeeDocuments.find(
          (doc:any) =>
            doc.employee_id === employee.employee_id
        )?.documents || []
      : [];




  // Employee Timeline

  const timeline =
    employee
      ? employeeTimeline.find(
          (item:any) =>
            item.employee_id === employee.employee_id
        )?.timeline || []
      : [];





  // Project Completion

  const totalDocuments = documents.length;


  const uploadedDocuments = documents.filter(
    (doc:any)=>
      doc.status === "Uploaded"
  ).length;



  const completionPercentage =
    totalDocuments > 0
      ? Math.round(
          (uploadedDocuments / totalDocuments) * 100
        )
      : 0;




  useEffect(()=>{

    if(!id) return;

    api.getEmployee(id).then(setEmployee);

  },[id]);






  if(!employee){

    return(

      <div className="min-h-screen bg-[#FAFAF9] p-8">

        <p className="text-gray-500">
          Loading...
        </p>

      </div>

    );

  }







return (

<div className="min-h-screen bg-[#FAFAF9] p-8">





{/* Back Button */}


<div className="mb-6">

<button
onClick={()=>router.push("/directory")}
className="rounded-lg border border-[#EAB308] px-4 py-2 text-sm font-medium text-[#EAB308] hover:bg-[#EAB308] hover:text-white transition"
>

← Back to Employee Directory

</button>

</div>






<h1 className="text-3xl font-bold text-[#14213D] mb-8">

Employee Profile

</h1>







{/* Employee Information */}


<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">





<div className="rounded-xl border bg-white p-4 shadow">


<h2 className="mb-4 text-xl font-bold text-[#14213D]">
Personal Information
</h2>



<Detail label="Employee Name" value={employee.name}/>
<Detail label="Employee ID" value={employee.employee_id}/>
<Detail label="Date of Joining" value={employee.joining_date}/>
<Detail label="Phone Number" value={employee.phone}/>
<Detail label="Email" value={employee.email}/>



</div>







<div className="rounded-xl border bg-white p-4 shadow">


<h2 className="mb-4 text-xl font-bold text-[#14213D]">
Employment Details
</h2>



<Detail label="Department" value={employee.department}/>
<Detail label="Role" value={employee.role}/>
<Detail label="Manager" value={employee.manager}/>
<Detail label="Status" value={employee.status}/>
<Detail label="Office" value={employee.office}/>



</div>





</div>








{/* Documents */}



<h1 className="text-3xl font-bold text-[#14213D] mt-10 mb-8">

Employee Documents

</h1>





<div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">






<div className="rounded-xl border bg-white p-6 shadow">


<div className="grid grid-cols-2 border-b pb-4 mb-4">


<h2 className="text-xl font-bold text-[#14213D]">
Documents
</h2>


<h2 className="text-xl font-bold text-[#14213D]">
Status
</h2>



</div>





{
documents.length > 0 ?


documents.map((doc:any,index:number)=>(


<div
key={index}
className="grid grid-cols-2 items-center py-4 border-b last:border-b-0"
>


<p className="font-medium text-gray-700">

{doc.name}

</p>



<span
className={`w-fit rounded-full px-4 py-1 text-sm font-semibold
${
doc.status==="Uploaded"
?
"bg-green-100 text-green-700"
:
"bg-amber-100 text-amber-700"
}
`}
>

{doc.status}

</span>


</div>


))


:

<p className="text-gray-500">
No documents found
</p>


}



</div>










<div className="rounded-xl border bg-white p-6 shadow">


<h2 className="mb-6 text-xl font-bold text-[#14213D]">

Project Completion

</h2>



<div className="flex justify-between mb-3">


<span className="text-gray-500">
Completion
</span>



<span className="text-2xl font-bold text-[#14213D]">

{completionPercentage}%

</span>



</div>




<div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">


<div
className="h-4 rounded-full bg-green-500"
style={{
width:`${completionPercentage}%`
}}
/>


</div>



<p className="mt-4 text-gray-500">

{uploadedDocuments} of {totalDocuments} Documents Uploaded

</p>



</div>





</div>









{/* Employee Timeline */}



<h1 className="text-3xl font-bold text-[#14213D] mt-10 mb-8">

Employee Timeline

</h1>





<div className="rounded-xl border bg-white p-6 shadow">



{
timeline.length > 0 ?



<div className="flex items-center justify-between">



{
timeline.map((item:any,index:number)=>(



<div
key={index}
className="flex flex-1 items-center"
>




<div className="flex flex-col items-center min-w-[160px]">





<div
className={`
h-12 w-12 rounded-full flex items-center justify-center text-white font-bold

${
item.status==="Completed"
?
"bg-green-500"
:
item.status==="In Progress"
?
"bg-yellow-500"
:
"bg-gray-300 text-gray-700"
}

`}
>


{
item.status==="Completed"
?
"✓"
:
index+1
}


</div>





<p className="mt-3 text-sm font-semibold text-[#14213D] text-center">

{item.title}

</p>




<p className="text-xs text-gray-500">

{item.date || "Not completed"}

</p>





<span
className={`mt-2 text-xs font-semibold

${
item.status==="Completed"
?
"text-green-600"
:
item.status==="In Progress"
?
"text-yellow-600"
:
"text-gray-500"
}

`}
>

{item.status}

</span>





</div>






{
index !== timeline.length-1 &&


<div
className={`
h-[3px] flex-1 mx-4

${
item.status==="Completed"
?
"bg-green-500"
:
"bg-gray-300"
}

`}
/>


}




</div>


))

}



</div>



:


<p className="text-gray-500">
No timeline available
</p>



}



</div>






</div>


);


}








function Detail({
label,
value
}:{
label:string;
value:any;
}){


return(

<div className="mb-3 flex items-center">


<p className="w-36 text-sm font-medium text-gray-500">

{label}

</p>



<span className="mr-2 text-gray-400">
:
</span>




<p className="font-semibold text-[#14213D]">

{value || "-"}

</p>



</div>


);


}