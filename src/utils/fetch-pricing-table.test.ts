import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchPricingTable } from "./fetch-pricing-table";
import { PricingTable } from "../types";

describe("fetchPricingTable", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("should throw an error if key does not start with pk_", async () => {
		await expect(fetchPricingTable("table_123", "sk_test_123")).rejects.toThrow(
			"Stripe key to fetch pricing table must be a public key (pk_...)",
		);
	});

	it("should fetch pricing table successfully", async () => {
		const mockPricingTable: PricingTable = {
			active: true,
			branding_settings: {
				background_color: "#ffffff",
				border_style: "default",
				button_color: "#000000",
				font_family: "default",
			},
			created: 1234567890,
			custom_url_items: null,
			default_interval: null,
			feature_flags: {
				enable_yearly_as_monthly_price_display: false,
				use_optimized_images: true,
			},
			has_archived_products_or_prices: false,
			id: "prctbl_123",
			livemode: false,
			locale: "en",
			merchant_id: "acct_123",
			merchant_internal_label: "Test Table",
			object: "pricing_table",
			pricing_table_items: [],
		};

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPricingTable,
		});

		const result = await fetchPricingTable("prctbl_123", "pk_test_123");

		expect(global.fetch).toHaveBeenCalledWith(
			"https://merchant-ui-api.stripe.com/pricing-table/prctbl_123?key=pk_test_123",
		);
		expect(result).toEqual(mockPricingTable);
	});

	it("should handle fetch errors", async () => {
		const errorMessage = "Pricing table not found";

		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: async () => ({ error: { message: errorMessage } }),
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(fetchPricingTable("prctbl_123", "pk_test_123")).rejects.toThrow(
			errorMessage,
		);

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("should handle errors without message", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: async () => ({ error: {} }),
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(fetchPricingTable("prctbl_123", "pk_test_123")).rejects.toThrow(
			"Failed to fetch pricing table",
		);

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});
