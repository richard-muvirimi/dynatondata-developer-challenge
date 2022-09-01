import { Button, Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { Component } from "react";
import { Link as Href } from "react-router-dom";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class ProductDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			title: "",
			description: "",
			bid: 0,
			expire: DateTime.now().toSeconds(),
		};

	}

	async componentDidMount() {
		let product = Utils.pathProduct;

		if (product !== 0) {
			let url = sprintf("%sproducts/product?product=%s", environment.SERVER_URL, product);

			let response = await axios.get(url);

			if (response.data.status && response.data.data.length !== 0) {
				let product = response.data.data[0];

				this.setState({
					title: product.title,
					description: product.description,
					bid: product.bid,
					expire: product.expire,
				});
			}
		}
	}

	render() {
		return (
			<Stack spacing={2} mt={4} >
				<Stack>
					<Typography variant="h4">{this.state.title}</Typography>
					<Typography variant="caption">Minimum Bid</Typography>
				</Stack>
				<Stack>
					<Typography sx={{ fontWeight: "bold" }}>Details</Typography>
					<Typography variant="caption">{this.state.description}</Typography>
				</Stack>
				<Stack direction="row">
					<Stack flexGrow={1}>
						<Typography>Last Bid Made</Typography>
						<Typography sx={{ fontWeight: "bold" }}>{sprintf("$%f", this.state.bid)}</Typography>
					</Stack>
					<Stack flexGrow={1}>
						<Typography>Available Until</Typography>
						<Typography sx={{ fontWeight: "bold" }}>{DateTime.fromSeconds(this.state.expire).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</Typography>
					</Stack>
				</Stack>
				<Stack>
					<Button variant="contained">Place Bid</Button>
				</Stack>
				<Stack>
					<FormControlLabel
						control={<Checkbox />}
						label={
							<Stack direction="row" spacing={1}>
								<Typography >
									Activate the
								</Typography>
								<Typography component={Href} to="/settings">
									auto bidding
								</Typography>
							</Stack>
						}
					/>
				</Stack>
			</Stack>
		);
	}
}