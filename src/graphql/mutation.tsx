import { gql } from "@apollo/client";

export const CREATE_ORGANIZATION_CURRENCY = gql`
	mutation createOrgCurrency($input: OrganizationCurrencyInput!) {
		createOrgCurrency(input: $input) {
			id
		}
	}
`;

export const UPDATE_ORG_CURRENCY = gql`
	mutation updateOrgCurrency($id: ID!, $input: OrganizationCurrencyInput) {
		updateOrgCurrency(id: $id, input: $input) {
			id
			isHomeCurrency
			currency {
				name
				code
			}
		}
	}
`;

export const UPDATE_ORGANIZATION = gql`
	mutation updateOrganization($input: updateOrganizationInput!) {
		updateOrganization(input: $input) {
			organization {
				id
				name
				short_name
				legal_name
				organization_registration_type {
					id
					reg_type
				}
				country {
					id
					name
				}
				account {
					id
					name
				}
				logo {
					id
					url
				}
				currency {
					id
				}
				theme
			}
		}
	}
`;
