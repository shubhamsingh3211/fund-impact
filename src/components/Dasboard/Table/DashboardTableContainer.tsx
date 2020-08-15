import { Box, Button, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";
import React from "react";
import AddButton from "../../Dasboard/AddButton";
import CreateBudgetDialog from "../CreateBudgetDialog";
import Deliverable from "../../Deliverable/Deliverable";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import ImpactTarget from "../../Impact/impactTarget";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import FundsTable from "../../Table/Funds";
import ImpactsTable from "../../Table/Impacts";
import DeliverablesTable from "../../Table/Deliverable";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabContent(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`wrapped-tabpanel-${index}`}
			aria-labelledby={`wrapped-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={1}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: any) {
	return {
		id: `wrapped-tab-${index}`,
		"aria-controls": `wrapped-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		//flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		height: "100%",
		overflow: "scroll",
	},
	contentHeading: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		margin: theme.spacing(1),
	},
	button: {
		margin: theme.spacing(1),
		color: theme.palette.common.white,
	},
}));

export default function DashboardTableContainer() {
	const tabs = [
		{
			label: "Funds",
			table: <FundsTable />,
			createButtons: [
				{
					text: "Create Budget",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<CreateBudgetDialog open={open} handleClose={handleClose} />
					),
				},
				{
					text: "Create Deliverables",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Deliverable
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
				{ text: "Create Impact Indicators" },
				{ text: "Add Donor" },
				{ text: "Create Budget Indicators" },
				{ text: "Track Budget Spend" },
				{ text: "Report Fund Receipt" },
			],
		},
		{
			label: "Deliverables",
			table: <DeliverablesTable />,
			createButtons: [
				{
					text: "Create Deliverable Targets",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableTarget
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
				{
					text: "Create Deliverable Unit",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableUnit
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
				{ text: "Report Achivement" },
			],
		},
		{
			label: "Impact Indicators",
			table: <ImpactsTable />,
			createButtons: [
				{
					text: "Create Impact Targets",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactTarget
							type={IMPACT_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
				{ text: "Report Achivement" },
			],
		},
		{ label: "Documents", createButtons: [] },
	];
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		console.log(`setting tab index `, newValue);
		setValue(newValue);
	};

	return (
		<Box className={classes.root} boxShadow={2}>
			<Tabs
				value={value}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="auto"
				aria-label="wrapped label tabs example"
			>
				{tabs.map((tab, index) => (
					<Tab
						textColor="secondary"
						key={tab.label}
						value={index}
						label={tab.label}
						{...a11yProps(index)}
					/>
				))}
			</Tabs>

			{tabs.map((tab, index) => (
				<TabContent key={index} value={value} index={index}>
					<Box className={classes.contentHeading}>
						<strong> Budget Tracker </strong>
						<div>
							<Button
								disableElevation
								className={classes.button}
								variant={"contained"}
								color="primary"
							>
								Fund Received
							</Button>
							<Button
								disableElevation
								className={classes.button}
								variant={"contained"}
								color="secondary"
							>
								Report Fund Spend
							</Button>
						</div>
					</Box>
					{tab.table && tab.table}
					<AddButton createButtons={tab.createButtons} />
				</TabContent>
			))}
		</Box>
	);
}
