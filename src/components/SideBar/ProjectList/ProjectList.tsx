import { ApolloQueryResult, useQuery } from "@apollo/client";
import { List, ListItem, ListItemText, Button, IconButton, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { IOrganisationWorkspaces } from "../../../models/workspace/query";
import { setProject } from "../../../reducers/dashboardReducer";
import ProjectListSkeleton from "../../Skeletons/projectList";
import Project from "../../Project/Project";
import { PROJECT_ACTIONS } from "../../Project/constants";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { PROJECT_ACTIONS as PROJECT_USER_ACCESS_ACTIONS } from "../../../utils/access/modules/project/actions";
import { useLocation, useNavigate } from "react-router";
import { GET_PROJ_DONORS } from "../../../graphql/project";
import { AttachFile } from "../../../models/AttachFile";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		project: {
			"& :hover": {
				"& $projectEditIcon": {
					opacity: 1,
				},
			},
		},
		selectedProject: {
			backgroundColor: theme.palette.action.selected,
		},
		addProject: {
			color: theme.palette.background.paper,
		},
		projectEditIcon: {
			opacity: 0,
		},
	})
);

function ProjectEditButton({
	project,
	workspaces,
	refetch,
}: {
	project: {
		id: number;
		name: string;
		short_name: string;
		description: string;
		workspace: IOrganisationWorkspaces;
		attachments: AttachFile[];
	};
	workspaces: IOrganisationWorkspaces[];
	refetch:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
}) {
	const classes = useStyles();
	const { data: projDonors } = useQuery(GET_PROJ_DONORS, {
		variables: { filter: { project: project.id } },
	});
	const [projectDetails, setProjectDetails] = useState<any>();

	const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);
	useEffect(() => {
		if (projDonors) {
			let donorIds = projDonors?.projectDonors?.map((donors: any) => donors?.donor?.id);

			setProjectDetails({
				id: project.id,
				name: project.name,
				short_name: project.short_name,
				description: project.description,
				workspace: project.workspace.id,
				donor: donorIds,
				attachments: project.attachments,
			});
		}
	}, [projDonors, project]);
	return (
		<>
			<IconButton
				className={classes.projectEditIcon}
				aria-controls={`projectMenu${project.id}`}
				aria-haspopup="true"
				onClick={() => setOpenUpdateForm(true)}
			>
				<EditOutlinedIcon fontSize="small" />
			</IconButton>
			{openUpdateForm && projectDetails && (
				<Project
					open={projectDetails !== null}
					handleClose={() => setOpenUpdateForm(false)}
					data={projectDetails}
					workspaces={workspaces}
					workspace={project.workspace.id}
					type={PROJECT_ACTIONS.UPDATE}
					reftechOnSuccess={refetch}
				/>
			)}
		</>
	);
}

export default function ProjectList({
	workspaceId,
	projectIndex,
	workspaces,
}: {
	workspaceId: any;
	projectIndex: number;
	workspaces: any;
}) {
	const classes = useStyles();
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const [openFormDialog, setOpenFormDialog] = React.useState<boolean>();
	const { data, loading, refetch } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
	let { pathname } = useLocation();
	const navigate = useNavigate();
	const [isAnyActiveProject, setIsAnyActiveProject] = useState<boolean>(false);

	React.useEffect(() => {
		if (data && projectIndex === 0 && pathname === "/dashboard" && !isAnyActiveProject) {
			dispatch(setProject(data.orgProject[0]));
			setIsAnyActiveProject(true);
		}
	}, [data, dispatch, projectIndex, pathname]);

	const projectCreateAccess = userHasAccess(
		MODULE_CODES.PEOJECT,
		PROJECT_USER_ACCESS_ACTIONS.CREATE_PROJECT
	);

	const projectEditAccess = userHasAccess(
		MODULE_CODES.PEOJECT,
		PROJECT_USER_ACCESS_ACTIONS.UPDATE_PROJECT
	);

	return (
		<>
			{loading ? (
				<ProjectListSkeleton />
			) : (
				<>
					{!data?.orgProject?.length && projectCreateAccess && (
						<Button
							variant="contained"
							color="secondary"
							size="small"
							className={classes.addProject}
							onClick={() => setOpenFormDialog(true)}
						>
							Add project
						</Button>
					)}
					<List>
						{data &&
							data.orgProject &&
							data.orgProject.map(
								(
									project: {
										id: number;
										name: string;
										short_name: string;
										description: string;
										workspace: IOrganisationWorkspaces;
										attachments: AttachFile[];
									},
									index: number
								) => (
									<Box className={classes.project} key={index}>
										<ListItem
											className={
												dashboardData?.project?.id === project.id
													? classes.selectedProject
													: ""
											}
											key={project.id}
											onClick={() => {
												dispatch(setProject(project));
												setIsAnyActiveProject(true);
												if (pathname !== "/dashboard")
													navigate("/dashboard");
											}}
										>
											<ListItemText primary={project.name} />
											{projectEditAccess && (
												<ProjectEditButton
													project={project}
													workspaces={workspaces}
													refetch={refetch}
												/>
											)}
										</ListItem>
									</Box>
								)
							)}
					</List>
					{openFormDialog && (
						<Project
							workspaces={workspaces}
							workspace={dashboardData?.workspace?.id}
							open={openFormDialog}
							handleClose={() => setOpenFormDialog(false)}
							type={PROJECT_ACTIONS.CREATE}
							reftechOnSuccess={refetch}
						/>
					)}
				</>
			)}
		</>
	);
}
