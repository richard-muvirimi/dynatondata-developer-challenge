import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { Component } from "react";
import { Link as Href } from "react-router-dom";
import { sprintf } from "sprintf-js";

export default class Product extends Component {

	get product() {
		return this.props.item;
	}

	get textStyle() {

		let color = "white";

		return {
			// color: "black",
			textShadow: "0 0 2px white"
			// textShadow: sprintf(
			// 	"-0.5px 0 %s, 0 0.5px %s, 0.5px 0 %s, 0 -0.5px %s",
			// 	color,
			// 	color,
			// 	color,
			// 	color
			// ),
		}
	}

	render() {
		return (
			<Paper sx={{ position: "relative", borderRadius: 2 }} elevation={2}>
				<Stack justifyContent="center" alignItems="center">
					<Box
						component="img"
						src="https://picsum.photos/280"
						height={280}
						width={280}
						sx={{ borderRadius: 2 }}
					></Box>
				</Stack>
				<Stack direction="row" sx={{ position: "absolute", bottom: "0", width: "100%", boxSizing: "border-box" }} p={1} alignItems="center">
					<Stack direction="column" flexGrow={1}>
						<Typography variant="h6" sx={this.textStyle}>{this.product.title}</Typography>
						<Typography variant="caption" sx={this.textStyle}>{this.product.description}</Typography>
					</Stack>
					<Stack>
						<Button variant="contained" component={Href} to={sprintf("/product/%d", this.product.id)}>
							Bid Now
						</Button>
					</Stack>
				</Stack>
			</Paper >
		);
	}
}