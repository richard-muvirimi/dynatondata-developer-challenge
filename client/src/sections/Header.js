import { AppBar, Avatar, Box, Button, Link, Stack, Toolbar, Typography } from "@mui/material";
import { Component, Fragment } from "react";
import { Link as Href } from "react-router-dom";

export default class Header extends Component {

	constructor(props) {
		super(props);

		this.doLogout = this.doLogout.bind(this);
	}

	doLogout() {
		this.props.setToken("")
	}

	render() {
		return (
			<Box sx={{ flexGrow: 1, mb: 5 }}>
				<AppBar position="static" color="primary">
					<Toolbar sx={{ px: { xs: 1, sm: 3, lg: 5, xl: 10 } }}>
						<Stack sx={{ flexGrow: 1 }}>
							<Link component={Href} to="/">
								<Typography variant="h6" sx={{ color: "black", textTransform: "bold" }}>
									Logo
								</Typography>
							</Link>
						</Stack>
						<Stack direction="row" spacing={2} alignItems="center">

							{this.props.user &&
								<Fragment>
									<Typography>{this.props.user.username}</Typography>
									<Avatar alt={this.props.user.username} src="https://picsum.photos/60" />
								</Fragment>
							}
							<Button sx={{ color: "black" }} onClick={this.doLogout} component={Href} to="/">Logout</Button>
						</Stack>
					</Toolbar>
				</AppBar>
			</Box >
		);
	}
}