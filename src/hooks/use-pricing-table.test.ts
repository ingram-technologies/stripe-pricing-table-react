import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as fetchModule from "../utils/fetch-pricing-table";
import { usePricingTable } from "./use-pricing-table";

vi.mock("../utils/fetch-pricing-table");

describe("usePricingTable", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should return error if pricingTableId is missing", () => {
		const { result } = renderHook(() =>
			usePricingTable({ pricingTableId: "", publishableKey: "pk_test_123" }),
		);

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(
			"Missing required parameters: pricingTableId and publishableKey",
		);
		expect(result.current.pricingTable).toBe(null);
	});

	it("should return error if publishableKey is missing", () => {
		const { result } = renderHook(() =>
			usePricingTable({ pricingTableId: "prctbl_123", publishableKey: "" }),
		);

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBe(
			"Missing required parameters: pricingTableId and publishableKey",
		);
		expect(result.current.pricingTable).toBe(null);
	});

	it("should fetch pricing table successfully", async () => {
		const mockPricingTable = {
			id: "prctbl_123",
			active: true,
			pricing_table_items: [],
		};

		vi.spyOn(fetchModule, "fetchPricingTable").mockResolvedValue(
			mockPricingTable as any,
		);

		const { result } = renderHook(() =>
			usePricingTable({
				pricingTableId: "prctbl_123",
				publishableKey: "pk_test_123",
			}),
		);

		expect(result.current.loading).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.pricingTable).toEqual(mockPricingTable);
		expect(result.current.error).toBe(null);
		expect(fetchModule.fetchPricingTable).toHaveBeenCalledWith(
			"prctbl_123",
			"pk_test_123",
		);
	});

	it("should handle fetch errors", async () => {
		const errorMessage = "Failed to fetch";
		vi.spyOn(fetchModule, "fetchPricingTable").mockRejectedValue(
			new Error(errorMessage),
		);

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const { result } = renderHook(() =>
			usePricingTable({
				pricingTableId: "prctbl_123",
				publishableKey: "pk_test_123",
			}),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe(errorMessage);
		expect(result.current.pricingTable).toBe(null);
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("should abort fetch on unmount", () => {
		const abortSpy = vi.spyOn(AbortController.prototype, "abort");
		vi.spyOn(fetchModule, "fetchPricingTable").mockImplementation(
			() => new Promise(() => {}), // Never resolves
		);

		const { unmount } = renderHook(() =>
			usePricingTable({
				pricingTableId: "prctbl_123",
				publishableKey: "pk_test_123",
			}),
		);

		unmount();

		expect(abortSpy).toHaveBeenCalled();
		abortSpy.mockRestore();
	});
});
