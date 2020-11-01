import { ApolloQueryResult, QueryLazyOptions } from "@apollo/client";
import { PROJECT_ACTIONS } from "../../components/Project/constants";
import { IWorkspace } from "../workspace/workspace";
import { IPROJECT_FORM } from "./projectForm";

export interface IProject {
	id?: number;
	name: string;
	short_name?: string;
	description?: string;
	workspace?: any;
}
export type ProjectProps = {
	workspaces: NonNullable<Pick<IWorkspace, "id" | "name">>[];
	open: boolean;
	handleClose: () => void;
	workspace: string;
	reftechOnSuccess:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| ((options?: QueryLazyOptions<{ filter: { workspace: any } }> | undefined) => void)
		| undefined;
} & (
	| {
			type: PROJECT_ACTIONS.CREATE;
	  }
	| {
			type: PROJECT_ACTIONS.UPDATE;
			data: IPROJECT_FORM;
	  }
);

export interface IGetProject {
	orgProject: { id: string; name: string; workspace: { id: string; name: string } }[];
}

export interface ICreateProjectDonor {
	createProjDonor: {
		id: string;
		project: {
			id: string;
			name: string;
		};
		donor: {
			id: string;
			name: string;
		};
	};
}

export interface ICreateProjectDonorVariables {
	input: {
		project: string;
		donor: string;
	};
}

export interface IGetProjectDonor {
	projectDonors: {
		id: string;
		project: {
			id: string;
			name: string;
		};
		donor: {
			id: string;
			name: string;
		};
	}[];
}
