import { AttachMoney } from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { Component, createRef } from "react";
import { Link as Href } from "react-router-dom";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class ProductDetail extends Component {

	#interval;
	#TxtCountDown;

	constructor(props) {
		super(props);

		this.state = {
			title: "",
			description: "",
			bid: 0,
			user: 0,
			expire: DateTime.now().toSeconds(),
			bidOffer: 0,
			bidAuto: false
		};

		this.#TxtCountDown = createRef();

		this.doBid = this.doBid.bind(this);
		this.doAutoBid = this.doAutoBid.bind(this);
		this.updateCountDown = this.updateCountDown.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
	}

	async componentDidMount() {
		let product = Utils.pathProduct;

		if (product !== 0) {

			let params = new URLSearchParams({
				product: product
			});

			let url = sprintf("%sproducts/product?", environment.SERVER_URL) + params.toString();

			try {
				let response = await axios.get(url);

				if (response.data.status && response.data.data) {
					this.updateProduct(response.data.data);
				}
			} catch (error) {
				this.props.showErrorMessage(error.message);
			}
		}

		this.#interval = setInterval(this.updateCountDown, 1000);
	}

	updateProduct(product) {
		this.setState({
			title: product.title,
			description: product.description,
			bid: parseFloat(product.bid),
			user: product.user,
			bidAuto: product.users.split("|").includes(this.props.user.id),
			expire: product.expire,
			bidOffer: this.state.offer > parseFloat(product.bid) ? this.state.bidOffer : (parseFloat(product.bid) + 1)
		});
	}

	updateCountDown() {
		let expiry = DateTime.fromSeconds(this.state.expire);

		if (this.#TxtCountDown.current !== null) {
			if (DateTime.now().toSeconds() <= expiry.toSeconds()) {
				this.#TxtCountDown.current.innerHTML = expiry.diffNow().toFormat("h:mm:ss");
			} else {
				this.#TxtCountDown.current.innerHTML = "Closed";
				clearInterval(this.#interval);
			}
		}
	}

	componentWillUnmount() {
		clearInterval(this.#interval);
	}

	async doBid() {
		let product = Utils.pathProduct;

		if (product !== 0) {

			let params = new URLSearchParams({
				product: product,
				bid: this.state.bidOffer,
				token: Utils.token
			});

			let url = sprintf("%sproducts/bid?", environment.SERVER_URL) + params.toString();

			try {
				let response = await axios.patch(url);

				if (response.data.status && response.data.data) {
					this.updateProduct(response.data.data);
				}
			} catch (error) {
				this.props.showErrorMessage(error.message);
			}
		}
	}

	async doAutoBid(_, auto) {
		this.setState({ bidAuto: auto }, async () => {

			let product = Utils.pathProduct;

			if (product !== 0) {

				let params = new URLSearchParams({
					product: product,
					subscribe: auto,
					token: Utils.token
				});

				let url = sprintf("%sproducts/subscribe?", environment.SERVER_URL) + params.toString();

				try {
					let response = await axios.patch(url);

					if (response.data.status && response.data.data) {
						this.updateProduct(response.data.data);
					}
				} catch (error) {
					this.props.showErrorMessage(error.message);
				}
			}

		});

	}

	get isActive() {
		return this.state.user === this.props.user.id || this.props.user.admin || this.state.expire < DateTime.now().toSeconds();
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
						<Typography sx={{ fontWeight: "bold" }} ref={this.#TxtCountDown}>00:00:00</Typography>
					</Stack>
				</Stack>
				<Stack gap={2}>
					<TextField variant="filled" type="number" InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<AttachMoney />
							</InputAdornment>
						),
						disableUnderline: true,
						inputProps: {
							min: parseFloat(this.state.bid) + 0.5,
							step: "0.5"
						}
					}} value={this.state.bidOffer}
						onChange={(event) => this.setState({ bidOffer: event.target.value })}
						label="Your Offer" />
					{this.isActive &&
						<Typography variant="caption">You cannot bid on this product</Typography>
					}
					<Button variant="contained" onClick={this.doBid} disabled={this.isActive}>Place Bid</Button>
				</Stack>
				<Stack>
					<FormControlLabel
						control={<Checkbox />}
						disabled={this.isActive}
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
						value={this.state.bidAuto}
						onChange={this.doAutoBid}
					/>
				</Stack>
			</Stack>
		);
	}
}