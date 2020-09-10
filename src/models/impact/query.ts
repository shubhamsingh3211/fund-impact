import { IProject } from "../project/project";
import { IOrganisation } from "../organisation/types";

export interface IImpactCategoryUnitResponse {
	id: string;
	impact_category_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		organization: IOrganisation;
	};
	impact_units_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		unit_type: string;
		prefix_label: string;
		suffix_label: string;
	};
}
export interface IImpactTargetByProjectResponse {
	id: string;
	name: string;
	target_value: number;
	description: string;
	impact_category_unit: IImpactCategoryUnitResponse;
	project: Partial<IProject>;
}

export interface IImpactTracklineByTargetResponse {
	id: string;
	value: string;
	note: string;
	reporting_date: string;
	impact_target_project: Partial<IImpactTargetByProjectResponse>;
	annual_year: {
		id: string;
		name: string;
		short_name: string;
		start_date: string;
		end_date: string;
	};
	financial_year: {
		id: string;
		name: string;
		country: { id: string; name: string };
	};
}

export interface IGET_IMPACT_TARGET_BY_PROJECT {
	impactTargetProjectList: IImpactTargetByProjectResponse[];
}

export interface IGET_IMPACT_TRACKLINE_BY_TARGET {
	impactTrackingLineitemList: IImpactTracklineByTargetResponse[];
}
