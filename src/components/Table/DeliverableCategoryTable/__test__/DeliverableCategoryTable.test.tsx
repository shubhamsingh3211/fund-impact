import React from "react";
import { waitForElement, fireEvent, wait } from "@testing-library/react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { GET_PROJECT_BUDGET_TARGETS_COUNT } from "../../../../graphql/Budget";
import { GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM } from "../../../../graphql/Budget";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import {
	projectDetails,
	organizationDetails,
	mockBudgetTargetAmountSum,
	mockBudgetTargetCount,
	mockDeliverableCategoryCount,
} from "../../../../utils/testMock.json";
import DeliverableCategoryTable from "../DeliverableCategoryTableGraphql";
import { deliverableCategoryTableHeading, deliverableUnitTableHeadings } from "../../constants";
import {
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
	GET_DELIVERABLE_ORG_CATEGORY,
	GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
} from "../../../../graphql/Deliverable/category";
import {
	deliverableCategoryMock,
	deliverableCategoryUnitListMock,
} from "../../../Deliverable/__test__/testHelp";
import {
	GET_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
} from "../../../../graphql/Deliverable/categoryUnit";
import { GET_DELIVERABLE_UNIT_PROJECT_COUNT } from "../../../../graphql/Deliverable/unit";
import { commonFormTestUtil } from "../../../../utils/commonFormTest.util";
import { deliverableUnitInputFields } from "../../../../pages/settings/DeliverableMaster/inputFields.json";
import { mockUserRoles } from "../../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../../graphql/User/query";

let table: any;

let intialFormValue = {
	name: "new category name",
	code: "deliverable category code",
	description: "deliverable category desc",
};

const deliverableCategoryProjectCountQuery = {
	request: {
		query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
		variables: {
			filter: {
				deliverable_unit_org: "1",
			},
		},
	},
	result: {
		data: { projectCountDelUnit: [{ count: 1 }] },
	},
};

const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "30",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: "1",
				},
			},
		},
		result: { data: mockUserRoles },
	},
	deliverableCategoryProjectCountQuery,
	{
		request: {
			query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_unit_org: "2",
				},
			},
		},
		result: {
			data: { projectCountDelUnit: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_CATEGORY_UNIT,
			variables: {
				filter: { deliverable_category_org: "1" },
				limit: 1,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableCategoryUnitList: deliverableCategoryUnitListMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
			variables: {
				filter: { deliverable_category_org: "1" },
			},
		},
		result: { data: { deliverableCategoryUnitCount: deliverableCategoryUnitListMock.length } },
	},
	{
		request: {
			query: GET_PROJECT_BUDGET_TARGETS_COUNT,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: mockBudgetTargetCount,
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
			variables: {
				filter: {
					organization: "3",
				},
			},
		},
		result: {
			data: mockDeliverableCategoryCount,
		},
	},
	{
		request: {
			query: GET_PROJECT_BUDGET_TARGET_AMOUNT_SUM,
			variables: {
				filter: {
					budgetTargetsProject: "3",
				},
			},
		},
		result: {
			data: mockBudgetTargetAmountSum,
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_ORG_CATEGORY,
			variables: {
				filter: { organization: "3" },
				limit: 2,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: { data: { deliverableCategory: deliverableCategoryMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "1",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
			variables: {
				filter: {
					deliverable_category_org: "2",
				},
			},
		},
		result: {
			data: { projectCountDelCatByOrg: [{ count: 1 }] },
		},
	},
];

beforeEach(() => {
	act(() => {
		table = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<DeliverableCategoryTable />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const { checkElementHaveCorrectValue } = commonFormTestUtil(fireEvent, wait, act);

describe("Deliverable Category Table tests", () => {
	for (let i = 0; i < deliverableCategoryTableHeading.length; i++) {
		test(`Table Headings ${deliverableCategoryTableHeading[i].label} for Deliverable Category Table`, async () => {
			await waitForElement(() =>
				table.getAllByText(deliverableCategoryTableHeading[i].label)
			);
		});
	}
	test("Deliverable Category Table renders correctly", async () => {
		for (let i = 0; i < deliverableCategoryMock.length; i++) {
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableCategoryMock[i].name, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp(deliverableCategoryMock[i].description, "i"))
			);
			await waitForElement(() =>
				table.getAllByText(new RegExp("" + deliverableCategoryMock[i].code, "i"))
			);
		}
	});

	test("Filter List test", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
	});

	test("Table Headings and Data listing of Deliverable Unit table", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});

		for (let i = 0; i < deliverableUnitTableHeadings.length; i++) {
			await waitForElement(() => table.findAllByText(deliverableUnitTableHeadings[i].label));
		}

		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + deliverableCategoryUnitListMock[0].deliverable_units_org.name, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp("" + deliverableCategoryUnitListMock[0].deliverable_units_org.code, "i")
			)
		);
		await waitForElement(() =>
			table.getAllByText(
				new RegExp(
					"" + deliverableCategoryUnitListMock[0].deliverable_units_org.description,
					"i"
				)
			)
		);
	});

	test("Filter List Input Elements test", async () => {
		let collaspeButton = await table.findByTestId(`collaspeButton-${1}`);
		expect(collaspeButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(collaspeButton);
		});
		let filterButton = await table.findByTestId(`filter-button`);
		expect(filterButton).toBeInTheDocument();
		act(() => {
			fireEvent.click(filterButton);
		});

		for (let i = 0; i < deliverableUnitInputFields.length; i++) {
			await checkElementHaveCorrectValue({
				inputElement: deliverableUnitInputFields[i],
				reactElement: table,
				value: intialFormValue[deliverableUnitInputFields[i].name],
			});
		}
	});
});
