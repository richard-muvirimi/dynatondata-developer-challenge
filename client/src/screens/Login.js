import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Component, createRef } from "react";
import { sprintf } from "sprintf-js";
import environment from "../environment";
const axios = require('axios').default;

export default class Login extends Component {

	#txtEmail;
	#txtPassword;

	constructor(props) {
		super(props);

		this.#txtEmail = createRef();
		this.#txtPassword = createRef();


		this.doLogin = this.doLogin.bind(this);
	}

	async doLogin() {

		let username = this.#txtEmail.current.value;
		let password = this.#txtPassword.current.value;

		let url = sprintf("%susers/auth?username=%s&password=%s", environment.SERVER_URL, username, password);

		let response = await axios.get(url);

		if (response.status) {
			console.log(response.data);
			if (response.data.user.token) {
				this.props.setToken(response.data.user.token);
			} else {
				this.props.showErrorMessage(response.message);
			}
		} else {
			this.props.showErrorMessage("Failed to communicate with remote server.");
		}

	}

	render() {
		return (
			<Stack justifyContent="center" alignItems="center" direction="row">
				<Paper >
					<Stack p={{ xs: 1, sm: 3, lg: 5 }} gap={2}>
						<Typography variant="h6" textAlign="center">
							Harare antique items seller shop
						</Typography>
						<TextField label="Email" variant="outlined" inputProps={{ ref: this.#txtEmail }} type="email" />

						<TextField label="Password" variant="outlined" inputProps={{ ref: this.#txtPassword }} type="password" />

						<Button variant="contained" onClick={this.doLogin}>Login</Button>
					</Stack>
				</Paper>
			</Stack>
		);
	}
}