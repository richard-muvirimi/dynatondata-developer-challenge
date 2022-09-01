import './App.css';
import { ThemeProvider } from "@emotion/react";
import { Alert, AlertTitle, createTheme, Snackbar } from "@mui/material";
import Header from './sections/Header';
import { Component, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './screens/Loading';
import { sprintf } from 'sprintf-js';
import environment from './environment';
import Utils from './utils/Utils';
const axios = require('axios').default;

export default class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			token: Utils.token || "",
			alertMessage: "",
			alertType: "info",
			user: this.defaultUser
		};

		this.setToken = this.setToken.bind(this);
		this.showErrorMessage = this.showErrorMessage.bind(this);
		this.clearMessage = this.clearMessage.bind(this);
		this.tokenValid = this.tokenValid.bind(this);
		this.fetchUser = this.fetchUser.bind(this);
	}

	get defaultUser() {
		return {
			username: "",
			admin: false,
			bidMax: 0,
			bidPercentage: 100
		};
	}

	get theme() {
		return createTheme({
			palette: {
				primary: {
					main: "#FFEBEE",
				},
				secondary: {
					main: "#FFFFFF",
				},
				light: {
					main: "#212121",
				},
				contrastThreshold: 2,
			},
			typography: {
				fontFamily: [
					"Segoe UI",
					"Tahoma",
					"Geneva",
					"Verdana",
					"sans-serif",
				].join(","),
			},
		});
	}

	get shopPage() {
		return lazy(async () => import("./screens/Shop"));
	}

	get productPage() {
		return lazy(async () => import("./screens/Product"));
	}

	async tokenValid(token) {
		let url = sprintf("%susers?token=%s", environment.SERVER_URL, token);

		let response = await axios.get(url);

		if (response.data.user !== undefined) {
			this.setState({ user: response.data.user });
			return true;
		}

		return false;

	}

	get settingsPage() {
		return lazy(async () => {
			// if (this.state.token.length !== 0) {

			// 	if (await this.tokenValid(this.state.token)) {
			return import("./screens/Settings");
			// 	}
			// }
			// this.showErrorMessage("Login to access this page.");
			// return import("./screens/Login");

		});
	}

	get loginPage() {
		return lazy(async () => {
			if (this.state.token.length === 0) {

				return import("./screens/Login");
			}
			return import("./screens/Product");

		});
	}

	get productsPage() {
		return lazy(async () => {
			/* if (this.state.user.admin) {

				if (true || await this.tokenValid(this.state.token)) { */
			return import("./screens/Products");
			/* 	}
			}
			this.showErrorMessage("Login to access this page.");
			return import("./screens/Login"); */

		});
	}

	get editPage() {
		return lazy(async () => {
			// if (this.state.user.admin) {

			// 	if (await this.tokenValid(this.state.token)) {
			return import("./screens/ProductEdit");
			// 	}
			// }
			// this.showErrorMessage("Login to access this page.");
			// return import("./screens/Login");

		});
	}

	showMessage(message) {
		this.setState({ alertMessage: message, alertType: "success" });
	}

	showErrorMessage(message) {
		this.setState({ alertMessage: message, alertType: "error" });
	}

	clearMessage() {
		this.setState({ alertMessage: "" });
	}

	componentDidMount() {
		this.fetchUser();
	}

	setToken(token) {

		let state = { token: token };

		if (token.length === 0) {
			state.user = this.defaultUser;
		}

		this.setState(state, async () => {
			Utils.token = token;

			if (token.length !== 0) {
				this.fetchUser();
			}

		});
	}

	async fetchUser() {
		let url = sprintf("%susers?token=%s", environment.SERVER_URL, Utils.token);

		let response = await axios.get(url);

		this.setState({ user: response.data.user });
	}

	render() {
		return (
			<ThemeProvider theme={this.theme}>
				<Header setToken={this.setToken} user={this.state.user} />
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path="/" element={<this.shopPage />} />
						<Route path="/product/*" element={<this.productPage />} />
						<Route path="/settings" element={<this.settingsPage />} />
						<Route path="/login" element={<this.loginPage setToken={this.setToken} showMessage={this.showMessage} showErrorMessage={this.showErrorMessage} />} />
						<Route path="/products" element={<this.productsPage showErrorMessage={this.showErrorMessage} showMessage={this.showMessage} />} />
						<Route path="/edit/*" element={<this.editPage user={this.state.user} showMessage={this.showMessage} showErrorMessage={this.showErrorMessage} />} />
						<Route path="/create" element={<this.editPage user={this.state.user} showMessage={this.showMessage} showErrorMessage={this.showErrorMessage} />} />
					</Routes>
				</Suspense>
				<Snackbar open={this.state.alertMessage.length !== 0} onClose={this.clearMessage} autoHideDuration={5000}>
					<Alert severity={this.state.alertType} onClose={this.clearMessage} >
						<AlertTitle>Message</AlertTitle>
						{this.state.alertMessage}
					</Alert>
				</Snackbar>
			</ThemeProvider>
		);
	}
}

