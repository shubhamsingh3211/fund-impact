import React, { useEffect, useState } from "react";
import ImpactCategoryContainer from "./ImpactCategoryContainer";
import { useLazyQuery } from "@apollo/client";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IGetImpactCategory,
	IGetImpactCategoryVariables,
	IGetImpactCategoryUnit,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import { IImpactCategoryData, IImpactUnitData } from "../../../models/impact/impact";

function ImpactCategoryGraphql({
	collapsableTable = true,
	rowId: impactUnitId,
}: {
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const [getImpactCategoryList, { data: impactCategoryListData }] = useLazyQuery<
		IGetImpactCategory,
		IGetImpactCategoryVariables
	>(GET_IMPACT_CATEGORY_BY_ORG, {
		onCompleted: (data) => {
			if (collapsableTable) {
				setImpactCategoryList(data?.impactCategoryOrgList || []);
			}
		},
	});

	const [getImpactCategoryUnitList] = useLazyQuery<
		IGetImpactCategoryUnit,
		IGetImpactCategoryUnitVariables
	>(GET_IMPACT_CATEGORY_UNIT, {
		onCompleted: (data) => {
			if (!collapsableTable) {
				setImpactCategoryList(
					data?.impactCategoryUnitList?.map(
						(element: {
							impact_category_org: IImpactCategoryData;
							impact_units_org: IImpactUnitData;
						}) => element?.impact_category_org
					) || []
				);
			}
		},
	});
	const dashboardData = useDashBoardData();

	const [impactCategoryList, setImpactCategoryList] = useState<IImpactCategoryData[]>([]);

	useEffect(() => {
		if (dashboardData?.organization && collapsableTable) {
			getImpactCategoryList({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	useEffect(() => {
		if (impactUnitId && !collapsableTable) {
			getImpactCategoryUnitList({
				variables: {
					filter: {
						impact_units_org: impactUnitId,
					},
				},
			});
		}
	}, [impactUnitId]);

	return (
		<ImpactCategoryContainer
			impactCategoryList={impactCategoryList}
			collapsableTable={collapsableTable}
		/>
	);
}

export default ImpactCategoryGraphql;
