import { Grid } from "@mui/material";
import { Component } from "react";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import ProductFilter from "../sections/ProductFilter";
import ProductList from "../sections/ProductList";
const axios = require('axios').default;

export default class Shop extends Component {

	constructor(props) {
		super(props);

		this.state = {
			products: [],
			arrange: "none",
			minimum: 0,
			maximum: Number.MAX_SAFE_INTEGER
		};

		this.setArrange = this.setArrange.bind(this);
		this.setRange = this.setRange.bind(this);
	}

	setRange(min, max) {
		this.setState({ minimum: min, maximum: max });
	}

	setArrange(arrange) {
		this.setState({ arrange: arrange });
	}

	async componentDidMount() {
		let url = sprintf("%sproducts", environment.SERVER_URL);

		let response = await axios.get(url);

		let products = response.data.data;

		this.setState({ products: products, minimum: Math.min(...products.map(p => p.bid)), maximum: Math.max(...products.map(p => p.bid)) });
	}

	render() {
		return (
			<Grid container spacing={{ xs: 1, sm: 2, lg: 3, xl: 5 }} px={{ xs: 1, sm: 3, lg: 5, xl: 10 }}>
				<Grid item xs={12} sm={6} lg={4} xl={3}>
					<ProductFilter products={this.state.products} setArrange={this.setArrange} arrange={this.state.arrange} setRange={this.setRange} />
				</Grid>
				<Grid item xs={12} sm={6} lg={8} xl={9}>
					<ProductList products={this.state.products} arrange={this.state.arrange} minimum={this.state.minimum} maximum={this.state.maximum} />
				</Grid>
			</Grid>
		);
	}
}