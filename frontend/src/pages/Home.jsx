import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import SideBar from "../layout/Sidebar";


const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen]  = useState(false);
  const [selectedComponent, setSelectedComponent]  = useState("");

  const {user, isAuthenticated} = useSelector( state => state.auth );

  // if(!isAuthenticated) {
  //   return  <Navigate to={"/login"}/>
  // };



  return <>
  <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
    <div className="md:hidden absolute z-10 right-6 top-4 md:top-6 flex justify-center 
    items-center rounded-md h-9 w-9 text-white bg-black">
      <GiHamburgerMenu className="text-2xl" onClick={() => setIsSideBarOpen(!isSideBarOpen)}/>
    </div>
    <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} setSelectedComponent={setSelectedComponent}/>  
  </div>
  
  </>;
};

export default Home;