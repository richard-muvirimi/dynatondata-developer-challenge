import { AttachMoney, Percent } from "@mui/icons-material";
import { Button, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Component } from "react";

export default class Settings extends Component {
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
						<TextField variant="filled" type="number" InputProps={{
							startAdornment: (
								<InputAdornment>
									<AttachMoney />
								</InputAdornment>
							),
							disableUnderline: true,
							inputProps: {
								min: 1
							}
						}} />
					</Stack>
				</Stack>
				<Stack>
					<Typography variant="h6">Bid Alert notification</Typography>
					<Typography>Get the notification about your reserved bids</Typography>
					<Stack my={3} direction="row">
						<TextField variant="filled" type="number" InputProps={{
							endAdornment: (
								<InputAdornment>
									<Percent />
								</InputAdornment>
							),
							disableUnderline: true,
							inputProps: {
								min: 0,
								max: 100
							}
						}} />
					</Stack>
				</Stack>
				<Stack my={3} direction="row">
					<Button variant="contained" sx={{ minWidth: "min(80vw, 450px)" }}>Save</Button>
				</Stack>
			</Stack>
		);
	}
}