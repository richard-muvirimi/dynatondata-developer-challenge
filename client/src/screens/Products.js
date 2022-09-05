import { DeleteOutline, Edit, Search, Visibility } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Tooltip } from "@mui/material";
import { Component, Fragment } from "react";
import DeleteDialog from "../components/DeleteDialog";
import naturalCompare from "string-natural-compare";
import { Link as Href } from "react-router-dom";
import { sprintf } from "sprintf-js";
import environment from "../environment";
import Utils from "../utils/Utils";
const axios = require('axios').default;

export default class Products extends Component {

	constructor(props) {
		super(props);

		this.state = {
			products: [],
			product: null,
			orderBy: this.tableHeaders[0].key,
			order: "asc",
			search: "",
		};

		this.handleClose = this.handleClose.bind(this);
		this.handleDelete = this.handleDelete.bind(this);

		this.handleChangeSortOrder = this.handleChangeSortOrder.bind(this);
		this.handleSort = this.handleSort.bind(this);

		this.handleSearch = this.handleSearch.bind(this);
	}

	handleClose() {
		this.setState({ product: null });
	}

	handleChangeSortOrder(column) {
		let isAsc = this.state.orderBy === column && this.state.order === "asc";
		this.setState({ order: isAsc ? "desc" : "asc" });
		this.setState({ orderBy: column });
	}

	handleSort(a, b) {
		let appliedSortOrder = this.state.order === "asc" ? 1 : -1;

		return (
			naturalCompare(
				a[this.state.orderBy].toString(),
				b[this.state.orderBy].toString(),
				{
					caseInsensitive: true,
				}
			) * appliedSortOrder
		);
	}

	get tableHeaders() {
		return [
			{ key: "id", title: "#" },
			{ key: "title", title: "Title" },
			{ key: "description", title: "Description" },
			{ key: "bid", title: "Current Bid", align: "right" },
			{ key: "user", title: "Current User (ID)", align: "right" },
			{ key: "actions", title: "", align: "right" },
		];
	}

	handleSearch(item) {
		return (
			item !== undefined &&
			(this.state.search.length === 0 ||
				Object.values(item).find((val) =>
					val.toString().toLowerCase().includes(this.state.search.toLowerCase())
				))
		);
	}

	async handleDelete() {

		let product = this.state.product;

		let params = new URLSearchParams({
			token: Utils.token,
			product: product
		});

		let url = sprintf("%sproducts/delete?", environment.SERVER_URL) + params.toString();

		let response = await axios.delete(url);

		if (response.data.status && response.data.data) {
			this.setState({ product: null, products: this.state.products.filter((i) => i.id !== product) }, () => {
				this.props.showMessage("Product Successfully Deleted");
			});
		} else {
			this.props.showErrorMessage("Failed to delete Product");
		}

	}

	async componentDidMount() {
		let url = sprintf("%sproducts", environment.SERVER_URL);

		let response = await axios.get(url);

		this.setState({ products: response.data.data });
	}

	render() {
		return (
			<Fragment>
				<Stack px={{ xs: 1, sm: 3, lg: 5, xl: 10 }}>

					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<TextField
							id="search"
							placeholder="Search"
							variant="outlined"
							margin="dense"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Search />
									</InputAdornment>
								),
								sx: {
									border: "none !mportant",
									outlineOffset: "none !important",
									":focus-visible": { outlineOffset: "none !important" },
								},
							}}
							sx={{ mx: 5 }}
							onChange={(event) =>
								this.setState({ search: event.target.value })
							}
						/>

						<Button variant="contained" component={Href} to="/create" >Create</Button>
					</Stack>

					<TableContainer>
						<Table aria-label="Products table">
							<TableHead>
								<TableRow>
									{this.tableHeaders.map((header) => {
										return (
											<TableCell
												key={header.key}
												align={header.align || "left"}
												sortDirection={
													this.state.orderBy === header.key
														? this.state.order
														: false
												}
											>
												<TableSortLabel
													active={this.state.orderBy === header.key}
													direction={
														this.state.orderBy === header.key
															? this.state.order
															: "asc"
													}
													onClick={() => this.handleChangeSortOrder(header.key)}
												>
													{header.title}
												</TableSortLabel>
											</TableCell>
										);
									})}
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.products
									.filter(this.handleSearch)
									.sort(this.handleSort)
									.map((product) => {

										return (
											<TableRow
												key={product.id}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell>{product.id}</TableCell>
												<TableCell component="th" scope="row">
													{product.title}
												</TableCell>
												<TableCell>{product.description}</TableCell>
												<TableCell align="right">{sprintf("$%f", product.bid)}</TableCell>
												<TableCell align="right">{product.user}</TableCell>
												<TableCell align="right">
													<Stack direction="row" justifyContent="flex-end">
														<Tooltip title="View">
															<IconButton component={Href} to={sprintf("/product/%s", product.id)} >
																<Visibility />
															</IconButton>
														</Tooltip>
														<Tooltip title="Edit">
															<IconButton component={Href} to={sprintf("/edit/%s", product.id)} >
																<Edit />
															</IconButton>
														</Tooltip>
														<Tooltip title="Delete">
															<IconButton onClick={() => this.setState({ product: product.id })} >
																<DeleteOutline />
															</IconButton>
														</Tooltip>
													</Stack>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
					<Stack direction="row" justifyContent="flex-end">
						<Button variant="contained" component={Href} to="/create" >Create</Button>
					</Stack>
				</Stack>
				<DeleteDialog open={this.state.product !== null} handleClose={this.handleClose} handleDelete={this.handleDelete} />

			</Fragment >
		);
	}
}