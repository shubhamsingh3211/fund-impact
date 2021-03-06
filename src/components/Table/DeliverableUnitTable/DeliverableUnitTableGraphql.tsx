import React, { useMemo, useState, useEffect } from "react";
import DeliverableUnitTableContainer from "./DeliverableUnitTableContainer";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../graphql/Deliverable/categoryUnit";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Deliverable/unit";
import { IDeliverableUnitData } from "../../../models/deliverable/deliverableUnit";
import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import pagination from "../../../hooks/pagination";

const removeEmptyKeys = (filterList: { [key: string]: string }) => {
	let newFilterListObject: { [key: string]: string } = {};
	for (let key in filterList) {
		if (filterList[key] && filterList[key].length) {
			newFilterListObject[key] = filterList[key];
		}
	}
	return newFilterListObject;
};

function DeliverableUnitTableGraphql({
	collapsableTable = true,
	rowId: deliverableCategoryId,
	tableFilterList,
}: {
	tableFilterList?: { [key: string]: string };
	collapsableTable?: boolean;
	rowId?: string;
}) {
	const [nestedTableQueryFilter, setNestedTableQueryFilter] = useState({});
	const [nestedTableOrderBy, setNestedTableOrderBy] = useState<string>("created_at");
	const [nestedTableOrder, setNestedTableOrder] = useState<"asc" | "desc">("desc");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [queryFilter, setQueryFilter] = useState({});
	const dashboardData = useDashBoardData();
	const [nestedTableFilterList, setNestedTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
		code: "",
		description: "",
	});

	useEffect(() => {
		setQueryFilter({
			organization: dashboardData?.organization?.id,
		});
	}, [dashboardData]);

	const removeNestedFilterListElements = (key: string, index?: number) => {
		setNestedTableFilterList((nestedTableFilterListObject) => {
			nestedTableFilterListObject[key] = "";
			return { ...nestedTableFilterListObject };
		});
	};

	useEffect(() => {
		setNestedTableQueryFilter({
			deliverable_category_org: deliverableCategoryId,
		});
	}, [deliverableCategoryId]);

	useEffect(() => {
		if (tableFilterList) {
			const newFilterListObject = removeEmptyKeys(tableFilterList);
			setQueryFilter({
				organization: dashboardData?.organization?.id,
				...newFilterListObject,
			});
		}
	}, [tableFilterList, dashboardData]);

	useEffect(() => {
		if (nestedTableFilterList) {
			const newFilterListObject = removeEmptyKeys(nestedTableFilterList);
			setNestedTableQueryFilter(
				Object.assign(
					{},
					{ deliverable_category_org: deliverableCategoryId },
					Object.keys(newFilterListObject).length && {
						deliverable_units_org: {
							...newFilterListObject,
						},
					}
				)
			);
		}
	}, [nestedTableFilterList, deliverableCategoryId]);

	let {
		changePage: changeDeliverableUnitPage,
		count: deliverableUnitCount,
		queryData: deliverableUnitList,
		queryLoading: deliverableUnitLoading,
		countQueryLoading: deliverableUnitCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
		countFilter: queryFilter,
		query: GET_DELIVERABLE_UNIT_BY_ORG,
		queryFilter,
		sort: `${orderBy}:${order.toUpperCase()}`,
		fireRequest: Boolean(dashboardData && collapsableTable),
	});

	let {
		changePage: changeDeliverableCategoryUnitPage,
		count: deliverableCategoryUnitCount,
		queryData: deliverableCategoryUnitList,
		queryLoading: deliverableCategoryUnitLoading,
		countQueryLoading: deliverableCategoryUnitCountLoading,
	} = pagination({
		countQuery: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
		countFilter: nestedTableQueryFilter,
		query: GET_CATEGORY_UNIT,
		queryFilter: nestedTableQueryFilter,
		sort: `${nestedTableOrderBy}:${nestedTableOrder.toUpperCase()}`,
		fireRequest: Boolean(deliverableCategoryId && !collapsableTable),
	});

	const deliverableCategoryUnitListMemoized = useMemo(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList?.map(
				(element: {
					deliverable_category_org: IDeliverableCategoryData;
					deliverable_units_org: IDeliverableUnitData;
				}) => element?.deliverable_units_org
			),
		[deliverableCategoryUnitList]
	);

	return (
		<DeliverableUnitTableContainer
			deliverableUnitList={
				deliverableUnitList?.deliverableUnitOrg || deliverableCategoryUnitListMemoized || []
			}
			collapsableTable={collapsableTable}
			changePage={
				dashboardData && collapsableTable
					? changeDeliverableUnitPage
					: changeDeliverableCategoryUnitPage
			}
			loading={
				deliverableUnitLoading ||
				deliverableUnitCountLoading ||
				deliverableCategoryUnitLoading ||
				deliverableCategoryUnitCountLoading
			}
			count={
				dashboardData && collapsableTable
					? deliverableUnitCount
					: deliverableCategoryUnitCount
			}
			order={collapsableTable ? order : nestedTableOrder}
			setOrder={collapsableTable ? setOrder : setNestedTableOrder}
			orderBy={collapsableTable ? orderBy : nestedTableOrderBy}
			setOrderBy={collapsableTable ? setOrderBy : setNestedTableOrderBy}
			filterList={nestedTableFilterList}
			setFilterList={setNestedTableFilterList}
			removeFilterListElements={removeNestedFilterListElements}
		/>
	);
}

export default DeliverableUnitTableGraphql;
