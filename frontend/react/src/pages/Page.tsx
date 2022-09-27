import React, { Component } from 'react';
import Menu from '../components/mainComponents/Menu'
import MatchNav from '../components/mainComponents/MatchNav'
import FriendsNav from '../components/mainComponents/FriendsNav'
// import Tchat from './Tchat'
import Profil from '../components/mainComponents/Profil'
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
