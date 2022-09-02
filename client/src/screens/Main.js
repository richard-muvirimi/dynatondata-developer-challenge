import { Component, Fragment, lazy, Suspense } from "react";
import Loading from "./Loading";
import { Route, Routes } from 'react-router-dom';
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Header from "../sections/Header";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class Main extends Component {

	get productPage() {
		return lazy(() => import("./Product"));
	}

	get settingsPage() {
		return lazy(() => import("./Settings"));
	}

	get editPage() {
		return lazy(() => import("./ProductEdit"));
	}

	get mainScreen() {
		return lazy(async () => {

			let token = Utils.token;

			if (token.length !== 0) {

				let params = new URLSearchParams({
					token: token
				});

				let url = sprintf("%susers?", environment.SERVER_URL) + params.toString();

				let response = await axios.get(url);

				if (response.data.user !== undefined && response.data.user.admin) {
					return import("./Products");
				}
			}

			return import("./Shop");

		});
	}

	render() {
		return (
			<Fragment>
				<Header setToken={this.props.setToken} user={this.props.user} />
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path="/" element={<this.mainScreen user={this.props.user} showErrorMessage={this.props.showErrorMessage} showMessage={this.props.showMessage} />} />
						<Route path="/product/*" element={<this.productPage user={this.props.user} />} />
						<Route path="/settings" element={<this.settingsPage user={this.props.user} setUser={this.props.setUser} />} />

						<Route path="/edit/*" element={<this.editPage user={this.props.user} showMessage={this.props.showMessage} showErrorMessage={this.props.showErrorMessage} />} />
						<Route path="/create" element={<this.editPage user={this.props.user} showMessage={this.props.showMessage} showErrorMessage={this.props.showErrorMessage} />} />
					</Routes>
				</Suspense>
			</Fragment>
		);
	}
}