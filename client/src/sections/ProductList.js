import { Stack } from "@mui/material";
import { Component, Fragment } from "react";
import { sprintf } from "sprintf-js";
import naturalCompare from "string-natural-compare";
import Product from "../components/Product";

export default class ProductList extends Component {

	constructor(props) {
		super(props);

		this.sortArrange = this.sortArrange.bind(this);
		this.filterBid = this.filterBid.bind(this);
	}

	filterBid(product) {
		return product.bid >= this.props.minimum && product.bid <= this.props.maximum;
	}

	sortArrange(p1, p2) {
		let compare = 0;
		switch (this.props.arrange) {
			case "least":
				compare = naturalCompare(p1.bid, p2.bid);
				break;
			case "most":
				compare = naturalCompare(p2.bid, p1.bid);
				break;
			case "expire":
				compare = naturalCompare(p1.expire, p2.expire);
				break;
			default:
				// Leave as is
				break;
		}
		return compare;
	}

	render() {
		return (
			<Stack direction="row" gap={2} m={2}>
				{this.props.products
					.filter(this.filterBid)
					.sort(this.sortArrange)
					.map((product) => {
						return (
							<Fragment key={product.id}>
								<Product item={product} />
							</Fragment>
						);
					})}
			</Stack>
		);
	}
}