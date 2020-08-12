import React from "react";
import { ListItem, ListItemText, List } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";
import { useQuery } from "@apollo/client";
import { useDashboardDispatch } from "../../../contexts/dashboardContext";
import { setProject } from "../../../reducers/dashboardReducer";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		ProjectList: {
			padding: theme.spacing(0),
		},
	})
);

export default function ProjectList({ workspaceId }: { workspaceId: any }) {
	const classes = useStyles();
	const dispatch = useDashboardDispatch();
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const { data } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
	React.useEffect(() => {
		if (data) {
			dispatch(setProject(data.orgProject[0]));
		}
	}, [data]);
	return (
		<List>
			{data &&
				data.orgProject &&
				data.orgProject.map((project: { id: number; name: string }) => (
					<ListItem
						button
						key={project.id}
						onClick={() => {
							dispatch(setProject(project));
						}}
					>
						<ListItemText primary={project.name} />
					</ListItem>
				))}
		</List>
	);
}
