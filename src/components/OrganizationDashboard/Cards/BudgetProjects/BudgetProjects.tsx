import { Box, Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import CommonProgres from "../CommonProgress";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ProgressDialog from "../ProgressDialog";

const budgetProjects = [
	{ name: "Wash Awarness ", completed: 90, lastUpdated: "12-02-2020" },
	{ name: "Covid 19 supply", completed: 80, lastUpdated: "12-02-2020" },
	{ name: "Budget Project ", completed: 70, lastUpdated: "12-02-2020" },
	{ name: "project 4", completed: 60, lastUpdated: "12-02-2020" },
	{ name: "project 5", completed: 50, lastUpdated: "12-02-2020" },
];

export default function BudgetProjectsCard() {
	const [budgetProjectFilter, setBudgetProjectFilter] = useState<{
		expenditure: boolean;
		allocation: boolean;
	}>({
		expenditure: true,
		allocation: false,
	});
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [budgetProgressDialogOpen, setBudgetProgressDialogOpen] = React.useState(false);
	return (
		<Grid container>
			<Grid item md={7}>
				<Box mt={1}>
					<Typography color="primary" gutterBottom>
						{`Project by ${
							budgetProjectFilter.expenditure ? "Expenditure" : "Allocation"
						}`}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={5}>
				<IconButton onClick={handleClick}>
					<FilterListIcon fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu-budget-org"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => {
							setBudgetProjectFilter({
								expenditure: true,
								allocation: false,
							});
							handleClose();
						}}
					>
						Expenditure
					</MenuItem>
					<MenuItem
						onClick={() => {
							setBudgetProjectFilter({
								expenditure: false,
								allocation: true,
							});
							handleClose();
						}}
					>
						Allocation
					</MenuItem>
				</Menu>
				<Typography variant="caption">More</Typography>
				<IconButton onClick={() => setBudgetProgressDialogOpen(true)}>
					<ArrowRightAltIcon fontSize="small" />
				</IconButton>
			</Grid>
			<Grid item md={12}>
				<Box mt={1}>
					{budgetProjects &&
						budgetProjects.slice(0, 3).map((budgetProject, index) => {
							return (
								<CommonProgres
									title={budgetProject.name}
									date={budgetProject.lastUpdated}
									percentage={budgetProject.completed}
								/>
							);
						})}
				</Box>
			</Grid>
			{budgetProgressDialogOpen && (
				<ProgressDialog
					open={budgetProgressDialogOpen}
					onClose={() => setBudgetProgressDialogOpen(false)}
					title={"Budget Projects"}
				>
					{budgetProjects &&
						budgetProjects.map((budgetProject, index) => {
							return (
								<CommonProgres
									title={budgetProject.name}
									date={budgetProject.lastUpdated}
									percentage={budgetProject.completed}
								/>
							);
						})}
				</ProgressDialog>
			)}
		</Grid>
	);
}
