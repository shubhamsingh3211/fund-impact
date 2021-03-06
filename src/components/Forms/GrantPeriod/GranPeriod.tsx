import { useQuery } from "@apollo/client";
import {
	Button,
	createStyles,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	Theme,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_PROJECT_DONORS } from "../../../graphql";
import { FORM_ACTIONS } from "../../../models/constants";
import { GrantPeriodFormProps, IGrantPeriod } from "../../../models/grantPeriod/grantPeriodForm";
import InputField from "../../InputField/InputField";
import { ICustomDatePicker } from "./BasicDateRangePicker";

// import { BasicDateRangePicker } from './dateRange';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			width: "100%",
		},
		cancelButton: {
			marginLeft: theme.spacing(1),
		},
	})
);

export function GranPeriodForm(props: GrantPeriodFormProps) {
	const classes = useStyles();
	const dashboardData = useDashBoardData();
	const { data: donorList } = useQuery(GET_PROJECT_DONORS, {
		variables: { filter: { project: dashboardData?.project?.id } },
	});
	console.log("donorList :>> ", donorList);
	useEffect(() => {}, [donorList]);

	const validate = (values: any) => {
		return {};
	};

	const clearErrors = () => {
		return null;
	};

	let initialValues: Partial<IGrantPeriod> = {
		name: "",
		short_name: "",
		description: "",
		start_date: "",
		end_date: "",
		project: undefined,
		donor: undefined,
	};
	if (props.action === FORM_ACTIONS.UPDATE) {
		initialValues = { ...props.initialValues };
	}

	let startDate = {
		text: "Start Date",
		preFilledValue: undefined,
	};

	let endData = {
		text: "End Date",
		preFilledValue: undefined,
	};

	if (props.action === FORM_ACTIONS.UPDATE) {
		if (initialValues.start_date) {
			startDate["preFilledValue"] = new Date(initialValues.start_date) as any;
		}

		if (initialValues.end_date) {
			endData["preFilledValue"] = new Date(initialValues.end_date) as any;
		}
	}

	return (
		<Formik
			validateOnBlur
			validateOnChange
			// isInitialValid={(props: any) => validate(props.initialValues)}
			initialValues={initialValues as any}
			enableReinitialize={true}
			validate={validate}
			onSubmit={(values: any) => {
				values = { ...values, project: dashboardData?.project?.id };
				props.onSubmit(values);
			}}
		>
			{(formik) => {
				return (
					<Form autoComplete="off" data-testid="form" onChange={clearErrors}>
						<Grid container spacing={4}>
							<Grid item xs={12} md={6}>
								<InputField
									formik={formik}
									name={"name"}
									id={"name"}
									dataTestId="name"
									testId="name"
									label="Name"
									multiline={false}
									rows={1}
									type="text"
									endAdornment={""}
								/>
								{/* <TextField
									fullWidth
									value={formik.values.name}
									error={!!formik.errors.name}
									onChange={formik.handleChange}
									label="Name"
									required
									name="name"
									type="text"
									variant="outlined"
								/> */}
							</Grid>

							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									value={formik.values.short_name}
									error={!!formik.errors.short_name}
									onChange={formik.handleChange}
									label="Short Name"
									name="short_name"
									type="text"
									variant="outlined"
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<TextField
									fullWidth
									value={formik.values.description}
									error={!!formik.errors.description}
									onChange={formik.handleChange}
									label="Description"
									name="description"
									type="text"
									variant="outlined"
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<InputLabel id="demo-simple-select-label">Select Donor</InputLabel>
								<Select
									required
									variant="outlined"
									fullWidth
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									name="donor"
									value={formik.values["donor"]}
									onChange={(event) => {
										formik.handleChange(event);
									}}
								>
									{donorList?.projDonors?.map((project: any) => (
										<MenuItem
											key={project?.donor?.id}
											value={project?.donor?.id}
										>
											{project.donor.name}
										</MenuItem>
									))}
									{!donorList?.projDonors?.length ? (
										<MenuItem disabled>No Donors availabel</MenuItem>
									) : null}
								</Select>
							</Grid>

							<Grid item xs={12} md={12}>
								{/* <DateRangePicker
									disableCloseOnSelect={true}
									startText={from.text}
									endText={to.text}
									value={[fromDateSelected, toDateSelected]}
									inputFormat="dd/MM/yyyy"
									onChange={handleDateChange}
									renderInput={(startProps, endProps) => (
										<>
											<TextField {...startProps} />
											<DateRangeDelimiter> to </DateRangeDelimiter>
											<TextField {...endProps} />
										</>
									)}
								/> */}

								{/* <Field
									name="date"
									disablePast
									component={DatePickerField}
									shouldDisableDate={false}
									getShouldDisableDateError={false}
								/> */}
								<ICustomDatePicker
									from={startDate}
									to={endData}
									onChange={(from, to) => {
										formik.setFieldValue("start_date", from?.toISOString());
										formik.setFieldValue("end_date", to?.toISOString());
									}}
								/>
							</Grid>

							<Button
								disabled={!formik.isValid}
								type="submit"
								data-testid="submit"
								variant="contained"
								color="primary"
							>
								Submit
							</Button>
							<Button onClick={props.onCancel} className={classes.cancelButton}>
								Cancel
							</Button>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}

// Failed Use case of CommonInputForm
// export function GranPeriodForm() {
// 	const onSubmit = () => {
// 		console.log("on submit is called");
// 	};
// 	const validate = (values: { [key: string]: string }) => {
// 		console.log("validate");
// 		return {};
// 	};
// 	const onCancel = () => {
// 		console.log("on cancel");
// 	};
// 	const onUpdate = () => {
// 		console.log("on update");
// 	};

// 	let name = {
// 		name: "name",
// 		id: "name",
// 		dataTestId: "grant_period_name",
// 		testId: "deliverableFormNameInput",
// 		label: "Name",
// 		required: true,
// 		size: 6,
// 	};
// 	let shortName = {
// 		name: "short_name",
// 		id: "short_name",
// 		dataTestId: "short_name",
// 		testId: "short_name",
// 		label: "Short Name",
// 		required: false,
// 		size: 6,
// 	};
// 	let description = {
// 		name: "description",
// 		id: "description",
// 		dataTestId: "description",
// 		testId: "description",
// 		label: "Description",
// 		required: false,
// 		size: 12,
// 	};

// 	let start_date = {
// 		name: "start_date",
// 		id: "start_date",
// 		dataTestId: "start_date",
// 		testId: "start_date",
// 		label: "Start date",
// 		size: 6,
// 		type: "date",
// 		required: false,
// 	};
// 	let end_date = {
// 		name: "end_date",
// 		id: "end_date",
// 		dataTestId: "end_date",
// 		testId: "end_date",
// 		label: "End date",
// 		size: 6,
// 		type: "date",
// 		required: false,
// 	};
// 	const inputFields = [name, shortName, start_date, end_date, description];

// 	let fields: ICommonForm["inputFields"];
// 	let initialValues = {
// 		start_date: "",
// 	};

// 	return (
// 		<div>
// 			<CommonInputForm
// 				formAction={FORM_ACTIONS.CREATE}
// 				inputFields={inputFields}
// 				onCancel={onCancel}
// 				onCreate={onSubmit}
// 				onUpdate={onUpdate}
// 				validate={validate}
// 				initialValues={initialValues}
// 			/>
// 		</div>
// 	);
// }
