import React, { useState, useRef, useEffect, useMemo } from "react";
import DeliverableUnitTableView from "./DeliverableUnitTableView";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { IDeliverableCategoryData } from "../../../models/deliverable/deliverable";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";

const getInitialValues = (
	deliverableUnit: IDeliverableUnitData | null,
	organization: string | number,
	deliverableCategory: string[]
): IDeliverableUnit => {
	return {
		code: deliverableUnit?.code || "",
		description: deliverableUnit?.description || "",
		id: parseInt(deliverableUnit?.id || ""),
		name: deliverableUnit?.name || "",
		prefix_label: deliverableUnit?.prefix_label || "",
		suffix_label: deliverableUnit?.suffix_label || "",
		unit_type: deliverableUnit?.unit_type || "",
		deliverableCategory,
		organization,
	};
};

function DeliverableUnitTableContainer({
	deliverableUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
}: {
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	orderBy: string;
	deliverableUnitList: IDeliverableUnitData[];
	filterList: {
		[key: string]: string;
	};
	loading: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) {
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

	const selectedDeliverableUnit = useRef<IDeliverableUnitData | null>(null);
	const dashboardData = useDashBoardData();
	const [getcategoryUnit, { data: deliverableCategoryUnitList }] = useLazyQuery(
		GET_CATEGORY_UNIT
	);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedDeliverableUnit.current && openDialogs[0]) {
			getcategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: selectedDeliverableUnit.current.id,
					},
				},
			});
		}
	}, [openDialogs, getcategoryUnit]);

	const deliverableCategoryMemoized = useMemo<string[]>(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList.map(
				(element: {
					deliverable_category_org: IDeliverableCategoryData;
					deliverable_units_org: IDeliverableUnitData;
				}) => element.deliverable_category_org.id
			),
		[deliverableCategoryUnitList]
	);

	const deliverableUnitEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<DeliverableUnitTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedDeliverableUnit={selectedDeliverableUnit}
			initialValues={getInitialValues(
				selectedDeliverableUnit.current,
				dashboardData?.organization?.id || "",
				deliverableCategoryMemoized || []
			)}
			deliverableUnitList={deliverableUnitList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			deliverableUnitEditAccess={deliverableUnitEditAccess}
			deliverableCategoryFindAccess={deliverableCategoryFindAccess}
		/>
	);
}

export default DeliverableUnitTableContainer;
