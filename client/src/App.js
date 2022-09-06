import './App.css';
import { ThemeProvider } from "@emotion/react";
import { Alert, AlertTitle, Box, createTheme, Snackbar } from "@mui/material";
import { Component, lazy, Suspense } from 'react';
import { sprintf } from 'sprintf-js';
import environment from './environment';
import Utils from './utils/Utils';
import Loading from './screens/Loading';
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
		this.fetchUser = this.fetchUser.bind(this);
		this.setUser = this.setUser.bind(this)
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

	showMessage(message) {
		this.setState({ alertMessage: message, alertType: "success" });
	}

	showErrorMessage(message) {
		this.setState({ alertMessage: message, alertType: "error" });
	}

	clearMessage() {
		this.setState({ alertMessage: "" });
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

	setUser(user) {
		this.setState({ user: user });
	}

	async fetchUser() {

		let token = Utils.token;

		if (token.length !== 0) {
			let params = new URLSearchParams({
				token: token
			});

			let url = sprintf("%susers?", environment.SERVER_URL) + params.toString();

			try {
				let response = await axios.get(url);

				this.setUser(response.data.user);
			} catch (error) {
				this.showErrorMessage(error.message);
			}
		}
	}

	componentDidMount() {
		this.fetchUser();
	}

	get mainScreen() {
		return lazy(async () => {

			let token = this.state.token;

			if (token.length !== 0) {

				let params = new URLSearchParams({
					token: token
				});

				let url = sprintf("%susers?", environment.SERVER_URL) + params.toString();

				try {
					let response = await axios.get(url);

					if (response.data.user !== undefined) {
						return import("./screens/Main");
					}
				} catch (error) {
					this.showErrorMessage(error.message);
				}
			}

			return import("./screens/Login");

		});
	}

	render() {
		return (
			<ThemeProvider theme={this.theme}>
				<Box>
					<Suspense fallback={<Loading />}>
						<this.mainScreen user={this.state.user} setUser={this.setUser} setToken={this.setToken} showMessage={this.showMessage} showErrorMessage={this.showErrorMessage} />
					</Suspense>
					<Snackbar open={this.state.alertMessage.length !== 0} onClose={this.clearMessage} autoHideDuration={5000}>
						<Alert severity={this.state.alertType} onClose={this.clearMessage} >
							<AlertTitle>Message</AlertTitle>
							{this.state.alertMessage}
						</Alert>
					</Snackbar>
				</Box>
			</ThemeProvider>
		);
	}
}

