import { useQuery } from "@apollo/client";
import {
	Avatar,
	IconButton,
	Menu,
	MenuItem,
	TableCell,
	TablePagination,
	Grid,
	Box,
	Chip,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_IMPACT_TARGETS_COUNT,
} from "../../../graphql/Impact/target";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTarget from "../../Impact/impactTarget";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import { ImpactHeadings } from "../constants";
import FICollaspeTable from "../FICollapseTable";
import ImpactTrackLineTable from "./impactTrackline";
import pagination from "../../../hooks/pagination/pagination";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import { FormattedMessage } from "react-intl";
import FilterList from "../../FilterList";
import { impactTargetInputFields } from "./inputFields.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { GET_SDG } from "../../../graphql/SDG/query";

const chipArray = ({
	arr,
	name,
	removeChips,
}: {
	arr: string[];
	name: string;
	removeChips: (index: number) => void;
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChips(index)}
			/>
		</Box>
	));
};

function EditImpactTargetIcon({ impactTarget }: { impactTarget: any }) {
	const [impactTargetMenuAnchor, setImpactTargetMenuAnchor] = useState<null | HTMLElement>(null);
	const [impactTargetLineDialog, setImpactTargetLineDialog] = useState<boolean>();
	const [impactTargetData, setImpactTargetData] = useState<IImpactTarget | null>();
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setImpactTargetMenuAnchor(event.currentTarget);
	};
	const handleMenuClose = () => {
		setImpactTargetMenuAnchor(null);
	};
	return (
		<>
			<TableCell>
				<IconButton aria-label="impact-target-edit" onClick={handleMenuClick}>
					<MoreVertIcon />
				</IconButton>
			</TableCell>
			<Menu
				id="impact-target-simple-menu"
				anchorEl={impactTargetMenuAnchor}
				keepMounted
				open={Boolean(impactTargetMenuAnchor)}
				onClose={handleMenuClose}
			>
				<MenuItem
					onClick={() => {
						setImpactTargetData({
							id: impactTarget.id,
							name: impactTarget.name,
							target_value: impactTarget.target_value,
							description: impactTarget.description,
							impactCategory:
								impactTarget.impact_category_unit?.impact_category_org.id,
							impactUnit: impactTarget.impact_category_unit?.impact_units_org.id,
							impact_category_unit: impactTarget.impact_category_unit.id,
							sustainable_development_goal:
								impactTarget.sustainable_development_goal?.id,
							project: impactTarget.project.id,
						});
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="editTargetMenu"
						defaultMessage="Edit Target"
						description="This text will be show on deliverable or impact target table for edit target menu"
					/>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleMenuClose();
						setImpactTargetLineDialog(true);
					}}
				>
					<FormattedMessage
						id="reportAchievementMenu"
						defaultMessage="Report Achievement"
						description="This text will be show on deliverable or impact target table for report achievement menu"
					/>
				</MenuItem>
			</Menu>
			{impactTargetData && (
				<ImpactTarget
					open={impactTargetData !== null}
					handleClose={() => setImpactTargetData(null)}
					type={IMPACT_ACTIONS.UPDATE}
					data={impactTargetData}
					project={impactTarget.project.id}
				/>
			)}
			{impactTargetLineDialog && (
				<ImpactTrackLine
					open={impactTargetLineDialog}
					handleClose={() => setImpactTargetLineDialog(false)}
					type={IMPACT_ACTIONS.CREATE}
					impactTarget={impactTarget.id}
				/>
			)}
		</>
	);
}

function ImpactTargetAchievementAndProgress({
	impactTargetId,
	impactTargetValue,
	impactTargetUnit,
}: {
	impactTargetId: string;
	impactTargetValue: number;
	impactTargetUnit: string;
}) {
	const { data } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		variables: { filter: { impactTargetProject: impactTargetId } },
	});
	const [impactTargetAchieved, setImpactTargetAchieved] = useState<number>();
	const [impactTargetProgess, setImpactTargetProgess] = useState<string>();
	useEffect(() => {
		if (data) {
			setImpactTargetAchieved(data.impactTrackingSpendValue);
			setImpactTargetProgess(
				((data.impactTrackingSpendValue / impactTargetValue) * 100).toFixed(2)
			);
		}
	}, [data, impactTargetValue]);
	return (
		<>
			<TableCell>{`${impactTargetAchieved} ${impactTargetUnit}`}</TableCell>
			<TableCell>{impactTargetProgess} %</TableCell>
		</>
	);
}

let impactCategoryHash: { [key: string]: string } = {};
let sustainableDevelopmentHash: { [key: string]: string } = {};

const mapIdToName = (arr: { id: string; name: string }[], obj: { [key: string]: string }) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		obj
	);
};

export default function ImpactsTable() {
	const dashboardData = useDashBoardData();
	const [rows, setRows] = useState<
		{ collaspeTable: React.ReactNode; column: React.ReactNode[] }[]
	>([]);

	const [impactPage, setImpactPage] = React.useState(0);

	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		target_value: "",
		impact_category_org: [],
		sustainable_development_goal: [],
	});

	const { data: categories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	const { data: sdgList } = useQuery(GET_SDG);

	useEffect(() => {
		if (categories) {
			impactTargetInputFields[2].optionsArray = categories.impactCategoryOrgList;
			impactCategoryHash = mapIdToName(categories.impactCategoryOrgList, impactCategoryHash);
		}
	}, [categories]);

	useEffect(() => {
		setQueryFilter({
			project: dashboardData?.project?.id,
		});
	}, [dashboardData]);

	useEffect(() => {
		if (sdgList) {
			impactTargetInputFields[3].optionsArray = sdgList.sustainableDevelopmentGoalList;
			sustainableDevelopmentHash = mapIdToName(
				sdgList.sustainableDevelopmentGoalList,
				sustainableDevelopmentHash
			);
		}
	}, [sdgList]);

	const removeFilterListElements = (key: string, index?: number) => {
		setFilterList((obj) => {
			if (Array.isArray(obj[key])) {
				obj[key] = (obj[key] as string[]).filter((ele, i) => index !== i);
			} else {
				obj[key] = "";
			}
			return { ...obj };
		});
	};

	useEffect(() => {
		if (filterList) {
			setQueryFilter(() => {
				let filter: {
					[key: string]: string | string[] | number | { [keyName: string]: string[] };
				} = {
					project: dashboardData?.project?.id || "",
				};
				if (filterList.name) {
					filter.name = filterList.name;
				}
				if (filterList.target_value) {
					filter.target_value = filterList.target_value;
				}
				if (filterList.sustainable_development_goal.length) {
					filter.sustainable_development_goal = filterList.sustainable_development_goal;
				}
				if (filterList.impact_category_org.length) {
					filter.impact_category_unit = {
						impact_category_org: filterList.impact_category_org as string[],
					};
				}
				return filter;
			});
		}
	}, [filterList, dashboardData]);

	let {
		count,
		queryData: impactTargets,
		changePage,
		countQueryLoading,
		queryLoading,
	} = pagination({
		query: GET_IMPACT_TARGET_BY_PROJECT,
		countQuery: GET_IMPACT_TARGETS_COUNT,
		countFilter: queryFilter,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
	});
	const limit = 10;
	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > impactPage) {
			changePage();
		} else {
			changePage(true);
		}
		setImpactPage(newPage);
	};

	useEffect(() => {
		if (impactTargets) {
			let impactTargetProjectList = impactTargets.impactTargetProjectList;
			let array: { collaspeTable: React.ReactNode; column: React.ReactNode[] }[] = [];
			for (let i = 0; i < impactTargetProjectList.length; i++) {
				let row: { collaspeTable: React.ReactNode; column: React.ReactNode[] } = {
					collaspeTable: null,
					column: [],
				};

				row.collaspeTable = (
					<ImpactTrackLineTable impactTargetId={impactTargetProjectList[i].id} />
				); // row collaspeTable for impact

				if (impactTargetProjectList[i].impact_category_unit) {
					let column = [
						<TableCell component="td" scope="row" key={impactTargetProjectList[i]?.id}>
							{impactPage * limit + i + 1}
						</TableCell>,
						<TableCell
							key={
								impactTargetProjectList[i]?.name +
								`${impactTargetProjectList[i]?.id}-1`
							}
						>
							{impactTargetProjectList[i].name}
						</TableCell>,
						<TableCell
							key={
								impactTargetProjectList[i]?.impact_category_unit.impact_category_org
									.name + `${impactTargetProjectList[i]?.id}-2`
							}
						>
							{
								impactTargetProjectList[i].impact_category_unit.impact_category_org
									.name
							}
						</TableCell>,
						<TableCell
							key={
								impactTargetProjectList[i]?.target_value +
								`${impactTargetProjectList[i]?.id}-3`
							}
						>{`${impactTargetProjectList[i].target_value} ${impactTargetProjectList[i].impact_category_unit.impact_units_org.name}`}</TableCell>,
					];
					column.push(
						<ImpactTargetAchievementAndProgress
							key={Math.random()}
							impactTargetId={impactTargetProjectList[i].id}
							impactTargetValue={impactTargetProjectList[i].target_value}
							impactTargetUnit={
								impactTargetProjectList[i].impact_category_unit.impact_units_org
									.name
							}
						/>
					);
					column.push(
						<TableCell
							key={impactTargetProjectList[i]?.sustainable_development_goal?.id}
						>
							{impactTargetProjectList[i]?.sustainable_development_goal?.name ? (
								<Avatar
									alt="SD"
									src={
										impactTargetProjectList[i]?.sustainable_development_goal
											?.icon
									}
								/>
							) : (
								"-"
							)}
							{}
						</TableCell>
					);

					column.push(
						<EditImpactTargetIcon
							key={Math.random()}
							impactTarget={impactTargetProjectList[i]}
						/>
					);

					row.column = column;
					array.push(row);
				}
			}
			setRows(array);
		} else {
			setRows([]);
		}
	}, [impactTargets]);

	let impactTablePagination = (
		<TablePagination
			rowsPerPageOptions={[]}
			colSpan={9}
			count={count}
			rowsPerPage={count > limit ? limit : count}
			page={impactPage}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={() => {}}
			style={{ paddingRight: "40px" }}
		/>
	);
	return (
		<>
			{queryLoading || countQueryLoading ? (
				<TableSkeleton />
			) : (
				<>
					<Grid container>
						<Grid item xs={11}>
							<Box my={2} display="flex" flexWrap="wrap">
								{Object.entries(filterList).map((element) => {
									if (element[1] && Array.isArray(element[1])) {
										if (element[0] === "impact_category_org") {
											return chipArray({
												arr: element[1].map(
													(ele) => impactCategoryHash[ele]
												),
												name: "ic",
												removeChips: (index: number) => {
													removeFilterListElements(element[0], index);
												},
											});
										}
										if (element[0] === "sustainable_development_goal") {
											return chipArray({
												arr: element[1].map(
													(ele) => sustainableDevelopmentHash[ele]
												),
												name: "sdg",
												removeChips: (index: number) => {
													removeFilterListElements(element[0], index);
												},
											});
										}
									}
									if (element[1] && typeof element[1] == "string") {
										return chipArray({
											arr: [element[1]],
											name: element[0].slice(0, 4),
											removeChips: (index: number) => {
												removeFilterListElements(element[0]);
											},
										});
									}
									return null;
								})}
							</Box>
						</Grid>
						<Grid item xs={1}>
							<Box mt={2}>
								<FilterList
									initialValues={{
										name: "",
										target_value: "",
										sustainable_development_goal: [],
										impact_category_org: [],
									}}
									setFilterList={setFilterList}
									inputFields={impactTargetInputFields}
								/>
							</Box>
						</Grid>
					</Grid>
					<FICollaspeTable
						order={order}
						orderBy={orderBy}
						setOrder={setOrder}
						setOrderBy={setOrderBy}
						tableHeading={ImpactHeadings}
						rows={rows}
						pagination={impactTablePagination}
					/>
				</>
			)}
		</>
	);
}
