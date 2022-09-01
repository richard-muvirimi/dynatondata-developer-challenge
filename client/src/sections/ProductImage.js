import { Box, Paper, Stack } from "@mui/material";
import { Component } from "react";

export default class ProductImage extends Component {
	render() {
		return (
			<Paper >
				<Stack justifyContent="center" alignItems="center">
					<Box
						component="img"
						src="https://picsum.photos/600"
						height={600}
						width={600}
						sx={{ borderRadius: 2 }}
					></Box>
				</Stack>
			</Paper>
		);
	}
}