import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Component } from "react";

export default class DeleteDialog extends Component {
	render() {
		return (
			<Dialog
				open={this.props.open}
				onClose={this.props.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Delete Product?"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Delete this product forever?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button sx={{ color: "black" }} onClick={this.props.handleClose}>Cancel</Button>
					<Button variant="contained" onClick={this.props.handleDelete} autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}