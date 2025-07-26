import { useEffect, useState } from "react";
import { fetchPricingTable } from "../utils/fetch-pricing-table";
import { PricingTable } from "../types";

export interface UsePricingTableOptions {
	pricingTableId: string;
	publishableKey: string;
}

export interface UsePricingTableResult {
	pricingTable: PricingTable | null;
	loading: boolean;
	error: string | null;
}

export const usePricingTable = ({
	pricingTableId,
	publishableKey,
}: UsePricingTableOptions): UsePricingTableResult => {
	const [pricingTable, setPricingTable] = useState<PricingTable | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!pricingTableId || !publishableKey) {
			setError("Missing required parameters: pricingTableId and publishableKey");
			setLoading(false);
			return;
		}

		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				const data = await fetchPricingTable(pricingTableId, publishableKey);

				if (!abortController.signal.aborted) {
					setPricingTable(data);
				}
			} catch (err) {
				if (!abortController.signal.aborted) {
					const errorMessage =
						err instanceof Error
							? err.message
							: "Failed to fetch pricing table";
					setError(errorMessage);
					console.error("Failed to fetch pricing table:", err);
				}
			} finally {
				if (!abortController.signal.aborted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		return () => abortController.abort();
	}, [pricingTableId, publishableKey]);

	return { pricingTable, loading, error };
};
