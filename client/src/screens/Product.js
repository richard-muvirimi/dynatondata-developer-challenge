import { Grid } from "@mui/material";
import { Component } from "react";
import ProductDetail from "../sections/ProductDetail";
import ProductImage from "../sections/ProductImage";

export default class Product extends Component {
	render() {
		return (
			<Grid container spacing={{ xs: 1, sm: 2, lg: 3, xl: 5 }} px={{ xs: 1, sm: 3, lg: 5, xl: 10 }}  >
				<Grid item xs={12} sm={6} >
					<ProductImage />
				</Grid>
				<Grid item xs={12} sm={6} >
					<ProductDetail />
				</Grid>

			</Grid>
		);
	}
}