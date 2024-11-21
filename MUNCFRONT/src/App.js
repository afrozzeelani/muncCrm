import React from "react";
import {   RouterProvider  } from "react-router-dom";
import "./App.css"
import  {router}  from "./Routes.jsx"

const App = () => {





  // useEffect(() => {
  //   if (attednaceInfo && attednaceError === "") {
  //    toast.success(attednaceInfo)   
  //   } else if (attednaceError !== "") {
  //     toast.error(attednaceError)
  //   }
  // }, [attednaceInfo, attednaceError]);




 
  




  return (

        <div>
          <RouterProvider router= {router}/>
        </div>
    
  );
};

export default App;

