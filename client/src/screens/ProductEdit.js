import { Button, Stack, TextField } from "@mui/material";
import { DateTime } from "luxon";
import { Component } from "react";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class ProductEdit extends Component {

	constructor(props) {
		super(props);

		this.state = {
			title: "",
			description: "",
			bid: 0,
			expire: DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm"),
		};

		this.doSave = this.doSave.bind(this);
	}

	async doSave() {

		let product = Utils.pathProduct;

		let data = new URLSearchParams({
			title: this.state.title,
			description: this.state.description,
			bid: this.state.bid,
			user: this.props.user.id,
			expire: DateTime.fromISO(this.state.expire).toSeconds(),
			token: Utils.token
		});

		let response;
		if (product === null) {
			let url = sprintf("%sproducts/add?", environment.SERVER_URL) + data.toString();
			response = await axios.put(url);
		} else {
			data.append("product", product);

			let url = sprintf("%sproducts/update?", environment.SERVER_URL) + data.toString();
			response = await axios.patch(url);
		}

		if (response.data.status && response.data.data) {
			this.props.showMessage("Product Successfully Saved");
		} else {
			this.props.showErrorMessage("Failed to update Product");
		}
	}

	async componentDidMount() {
		let product = Utils.pathProduct;

		if (product !== 0) {

			let params = new URLSearchParams({
				product: product
			});

			let url = sprintf("%sproducts/product?", environment.SERVER_URL) + params.toString();

			let response = await axios.get(url);

			if (response.data.status && response.data.data.length !== 0) {
				let product = response.data.data;

				this.setState({
					title: product.title,
					description: product.description,
					bid: product.bid,
					expire: DateTime.fromSeconds(product.expire).toFormat("yyyy-LL-dd'T'HH:mm"),
				});
			}
		}
	}

	render() {
		return (
			<Stack gap={2} px={{ xs: 1, sm: 3, lg: 5, xl: 10 }}>
				<TextField label="Product Name" variant="outlined" value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
				<TextField label="Product Description" variant="outlined" value={this.state.description} onChange={(event) => this.setState({ description: event.target.value })} />
				<TextField label="Product bid" variant="outlined" inputProps={{
					inputProps: {
						min: 1
					}
				}} type="number" value={this.state.bid} onChange={(event) => this.setState({ bid: event.target.value })} />
				<TextField label="Product Expire" variant="outlined" inputProps={{ shrink: true, }} type="datetime-local" value={this.state.expire} onChange={(event) => this.setState({ expire: event.target.value })} />
				<Button variant="contained" onClick={this.doSave}>Save</Button>
			</Stack>
		);
	}
}