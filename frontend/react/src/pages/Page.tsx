import React, { Component } from 'react';
import Menu from '../components/Menu'
import MatchNav from '../components/MatchNav'
import FriendsNav from '../components/FriendsNav'
import Tchat from '../components/Tchat'
// import Profil from '../components/Profil'
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
						<Tchat />
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
