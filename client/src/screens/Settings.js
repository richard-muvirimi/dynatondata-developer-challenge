import { AttachMoney, Percent } from "@mui/icons-material";
import { Button, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Component } from "react";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class Settings extends Component {

	constructor(props) {
		super(props);

		this.state = {
			bidMax: this.props.user.bidMax,
			bidPercentage: this.props.user.bidPercentage
		};

		this.doSave = this.doSave.bind(this);
	}

	async doSave() {

		let params = new URLSearchParams({
			bidMax: this.state.bidMax,
			bidPercentage: this.state.bidPercentage,
			token: Utils.token
		});

		let url = sprintf("%susers/settings?", environment.SERVER_URL) + params.toString();

		let response = await axios.patch(url);

		if (response.data.status && response.data.user) {
			this.props.setUser(response.data.user);
		}
	}

	render() {
		return (
			<Stack px={{ xs: 1, sm: 3, lg: 5, xl: 10 }}>
				<Stack mb={3}>
					<Typography variant="h6" sx={{ textTransform: "uppercase" }} color="primary">Settings</Typography>
					<Typography variant="h3">Configure the Auto-bidding</Typography>
				</Stack>
				<Stack>
					<Typography variant="h6">Maximum bid amount</Typography>
					<Typography>This maximum amount will be split between all items where we have activated auto-bidding</Typography>
					<Typography>Be mindful of the concurrency issues with auto-bidding!</Typography>
					<Stack my={3} direction="row">
						<TextField variant="filled" type="number" label="Maximum bid amount" InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AttachMoney />
								</InputAdornment>
							),
							disableUnderline: true,
							inputProps: {
								min: 1
							}
						}} value={this.state.bidMax} onChange={(event) => this.setState({ bidMax: event.target.value })} />
					</Stack>
				</Stack>
				<Stack>
					<Typography variant="h6">Bid Alert notification</Typography>
					<Typography>Get the notification about your reserved bids</Typography>
					<Stack my={3} direction="row">
						<TextField variant="filled" type="number" label="Alert Percentage" InputProps={{
							endAdornment: (
								<InputAdornment position="start">
									<Percent />
								</InputAdornment>
							),
							disableUnderline: true,
							inputProps: {
								min: 0,
								max: 100
							}
						}} value={this.state.bidPercentage} onChange={(event) => this.setState({ bidMax: event.target.value })} />
					</Stack>
				</Stack>
				<Stack my={3} direction="row">
					<Button variant="contained" sx={{ minWidth: "min(80vw, 450px)" }} onClick={this.doSave}>Save</Button>
				</Stack>
			</Stack>
		);
	}
}