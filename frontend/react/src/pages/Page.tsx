import { Component } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import MatchNav from "../components/MatchNav";
import FriendsNav from "../components/FriendsNav";



const Page = ({}:{}) => {
const navigate = useNavigate()

    return (
      <div className="Page p-4">
        <Menu />
        <div className="main row">
          <div className="mt-4 col-sm-12 order-2 col-lg-3 order-lg-1">
            <MatchNav />
          </div>
          <div className="mt-4 col-sm-12 order-1 col-lg-6 order-lg-2">
            <Outlet />
          </div>
          <div className="mt-4 col-sm-12 col-lg-3 order-3">
            <FriendsNav navigation={navigate}/>
          </div>
        </div>
      </div>
    ); // fin de return
} // fin de App

export default Page;
