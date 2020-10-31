import { gql } from "@apollo/client";

export const GET_CONTACT_LIST = gql`
	query getT4DContacts($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		t4DContacts(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			email
			email_other
			phone
			phone_other
			contact_type
		}
	}
`;

export const GET_CONTACT_LIST_COUNT = gql`
	query t4DContactsConnection($filter: JSON) {
		t4DContactsConnection(where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
