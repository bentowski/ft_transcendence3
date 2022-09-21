import React, { Component } from 'react';
import Menu from '../components/Menu'
import MatchNav from '../components/Party/MatchNav'
import FriendsNav from '../components/Friends/FriendsNav'
// import Tchat from './Tchat'
import Profil from '../components/User/Profil'
// import Footer from './Footer'

class Page extends React.Component {
	state = {

	}

	render() {
	return (
		<div className="Page p-4">
			<Menu />
			<div className="mt-4 row h-100">
				<div  className="col-3">
					<MatchNav />
				</div>
				<div  className="col-6">
					{/*
						<Printer />
						*/}
			<Profil />
				</div>
				<div  className="col-3">
					<FriendsNav />
				</div>
			</div>
			{/*
				<Footer />
			*/}
		</div>
	); // fin de return
	} // fin de render
} // fin de App

export default Page;
