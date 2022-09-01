import { MenuItem, Select, Slider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Component } from "react";
import { sprintf } from "sprintf-js";

export default class ProductFilter extends Component {

	get minimumBid() {
		return Math.min(...this.props.products.map((p) => p.bid));
	}

	get maximumBid() {
		return Math.max(...this.props.products.map((p) => p.bid));
	}

	render() {
		return (
			<Stack px={2} gap={5}>
				<Stack>
					<Typography variant="h4">Filters</Typography>
				</Stack>
				<Stack gap={1}>
					<Typography>Arrange</Typography>

					<Select
						variant="filled"
						color="primary"
						labelId="priority-select-label"
						value={this.props.arrange}
						label="Priority"
						onChange={(event) => this.props.setArrange(event.target.value)}
					>
						<MenuItem value={"least"}>Bid (Low)</MenuItem>
						<MenuItem value={"most"}>Bid (High)</MenuItem>
						<MenuItem value={"expire"}>Expire</MenuItem>
						<MenuItem value={"none"}>None</MenuItem>
					</Select>
				</Stack>
				<Stack gap={1}>
					<Typography>Minimum Bid</Typography>
					<Slider
						min={this.minimumBid}
						max={this.maximumBid}
						defaultValue={[this.minimumBid, this.maximumBid]}
						valueLabelDisplay="auto"
						onChange={(event, range) => this.props.setRange(Math.min(...range), Math.max(...range))}
						marks={[
							{ label: sprintf("$%f", this.minimumBid), value: this.minimumBid },
							{ label: sprintf("$%f", this.maximumBid), value: this.maximumBid },
						]}
					/>
				</Stack>
			</Stack>
		);
	}
}