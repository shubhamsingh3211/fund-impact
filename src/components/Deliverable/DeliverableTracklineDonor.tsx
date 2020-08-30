import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import {
	Grid,
	Button,
	Box,
	makeStyles,
	createStyles,
	Theme,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Typography,
} from "@material-ui/core";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_DELIVERABLE_LINEITEM_FYDONOR,
	UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
	GET_DELIVERABLE_LINEITEM_FYDONOR,
} from "../../graphql/queries/Deliverable/trackline";
import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../graphql/queries/index";
import { DELIVERABLE_ACTIONS } from "./constants";
import FullScreenLoader from "../commons/GlobalLoader";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { TracklineDonorFormProps } from "../../models/TracklineDonor/tracklineDonor";
import { FORM_ACTIONS } from "../Forms/constant";
import DonorYearTagForm from "../Forms/FYDonorYearTagsForm/FYDonorYearTags";

function getInitialValues(props: TracklineDonorFormProps) {
	if (props.type === FORM_ACTIONS.UPDATE) return { ...props.data };
	let initialValuesObj: any = {};
	props.donors?.forEach(
		(elem: {
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}) => {
			initialValuesObj[`${elem.id}mapValues`] = {
				financial_year:
					props.organizationCountry && props.organizationCountry === elem.donor.country.id
						? props.TracklineFyId
						: "", //
				grant_periods_project: "",
				project_donor: elem.id,
				deliverable_tracking_lineitem: props.TracklineId,
			};
		}
	);
	return initialValuesObj;
}

function DeliverableTracklineDonorYearTags(props: TracklineDonorFormProps) {
	const dashboardData = useDashBoardData();
	let organizationCountry = dashboardData?.organization?.country?.id;
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValues({ ...props, organizationCountry });
	const [createDeliverableLineitemFydonor, { loading }] = useMutation(
		CREATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags created successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags creation Failed !"
					)
				);
			},
		}
	);

	const [updateDeliverableLineitemFydonor, { loading: updateLoading }] = useMutation(
		UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags updated successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				console.log("err", data);
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags updation Failed !"
					)
				);
			},
		}
	);

	const onCreate = (value: any) => {
		console.log("formik", value);
		let finalvalues = Object.values(value);
		console.log(finalvalues);
		for (let i = 0; i < finalvalues.length; i++) {
			createDeliverableLineitemFydonor({
				variables: { input: finalvalues[i] },
				refetchQueries: [
					{
						query: GET_DELIVERABLE_LINEITEM_FYDONOR,
						variables: { filter: { deliverable_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};
	const onUpdate = (value: any) => {
		let finalvalues: any = Object.values(value);
		for (let i = 0; i < finalvalues.length; i++) {
			let deliverable_lineitem_fy_id = finalvalues[i]?.id;
			delete finalvalues[i].id;
			updateDeliverableLineitemFydonor({
				variables: { id: deliverable_lineitem_fy_id, input: finalvalues[i] },
				refetchQueries: [
					{
						query: GET_DELIVERABLE_LINEITEM_FYDONOR,
						variables: { filter: { deliverable_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		props.donors?.forEach(
			(elem: {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
			}) => {
				if (!values[`${elem.id}mapValues.financial_year`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.financial_year`] = "Financial Year is required";
				}
				if (!values[`${elem.id}mapValues.grant_periods_project`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.grant_periods_project`] =
						"Grant Period is required";
				}
			}
		);

		return errors;
	};

	const formAction = props.type;
	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
			{props.donors && (
				<DonorYearTagForm
					{...{
						initialValues,
						donors: props.donors,
						TracklineFyId: props.TracklineFyId,
						organizationCountry,
						validate,
						onCancel: props.onCancel,
						onUpdate,
						onCreate,
						formAction,
					}}
				/>
			)}
		</>
	);
}

export default DeliverableTracklineDonorYearTags;
