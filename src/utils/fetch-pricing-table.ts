import { PricingTable } from "../types";

const BASE_PRIVATE_API = "https://merchant-ui-api.stripe.com";

export const fetchPricingTable = async (
	id: string,
	key: string,
): Promise<PricingTable> => {
	if (!key.startsWith("pk_"))
		throw TypeError(
			"Stripe key to fetch pricing table must be a public key (pk_...)",
		);
	const url = new URL(`${BASE_PRIVATE_API}/pricing-table/${id}`);
	url.searchParams.set("key", key);
	const response = await fetch(url.toString());
	if (!response.ok) {
		const { error } = await response.json();
		console.error(error);
		throw Error(error.message || "Failed to fetch pricing table");
	}
	return response.json() as Promise<PricingTable>;
};
