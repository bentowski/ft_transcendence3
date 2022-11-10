import { Component } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import MatchNav from "../components/MatchNav";
import FriendsNav from "../components/FriendsNav";

class Page extends Component {
  render() {
    return (
      <div className="Page p-4 d-flex flex-column h-100 bg-image" style={{backgroundImage: "url(http://localhost:8080/pictures/bgSponge3.jpg)", backgroundSize: "cover", backgroundPosition: "center"}}>
        <Menu />
        <div className="main row h-100">
          <div className="mt-4 col-sm-12 order-2 col-lg-3 order-lg-1">
            <MatchNav />
          </div>
          <div className="mt-4 col-sm-12 order-1 col-lg-6 order-lg-2">
            <Outlet />
          </div>
          <div className="mt-4 col-sm-12 col-lg-3 order-3">
            <FriendsNav />
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Page;
