import { Component } from 'react';
import { Outlet } from "react-router-dom";
import Menu from '../components/Menu'
import MatchNav from '../components/MatchNav'
import FriendsNav from '../components/FriendsNav'
// import Tchat from '../components/Tchat'
// import Profil from '../components/Profil'
// import Footer from './Footer'

class Page extends Component {
	state = {

	}

	render() {
		return (
			<div className="Page p-4">
				<Menu />
			{/* <div className="mt-4 row h-100"> */}
				<div className="main row">
					<div className="mt-4 col-sm-12 order-2 col-lg-3 order-lg-1">
						<MatchNav />
					</div>
					<div className="mt-4 col-sm-12 order-1 col-lg-6 order-lg-2">
						<Outlet />
					</div>
					<div className="mt-4 col-sm-12 col-lg-3 order-3">
						<FriendsNav />
					</div>
					{/*}
			// 	</div>
			// 	<div  className="col-6">
			// 		{/*
			// 			<Printer />
			//
			// 			<Tchat />
			// 	</div>
			// 	<div  className="col-3">
			// 		<FriendsNav />
			// 	</div>
		*/}
				</div>
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default Page;
