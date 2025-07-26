import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as usePricingTableModule from "../hooks/use-pricing-table";
import { PricingTableItem, PricingTable as PricingTableType } from "../types";
import { PricingTable } from "./PricingTable";

vi.mock("../hooks/use-pricing-table");

const mockPricingTableItem: PricingTableItem = {
	address_collection: {
		address_collection_setting: "required",
		allowed_shipping_countries: null,
		id: "addr_123",
	},
	adjustable_quantity: {
		enabled: false,
		id: "adj_123",
		maximum: 99,
		minimum: 1,
	},
	allow_promotion_codes: true,
	amount: "2900",
	automatic_tax: {
		enabled: false,
		id: "tax_123",
	},
	call_to_action: "Subscribe",
	call_to_action_link: "https://example.com",
	confirmation_page: {
		custom_message: null,
		id: "conf_123",
		redirect_url: null,
		type: "confirmation_page",
	},
	consent_collection: {
		payment_method_reuse_agreement: null,
		promotions: "none",
		terms_of_service: "none",
	},
	currency: "usd",
	custom_fields: [],
	feature_list: ["Feature 1", "Feature 2", "Feature 3"],
	highlight_text: "Most Popular",
	image_url: null,
	is_highlight: true,
	name: "Pro Plan",
	payment_method_collection: "always",
	phone_number_collection: {
		enabled: false,
		id: "phone_123",
	},
	price_id: "price_123",
	price_type: "recurring",
	product_description: "Best for growing teams",
	product_id: "prod_123",
	recurring: {
		all_tiers: null,
		billing_scheme: "per_unit",
		id: "rec_123",
		interval: "month",
		interval_count: 1,
		interval_in_seconds: 2592000,
		tier_prices: [],
		tier_starting_prices: [],
		tiers: null,
		tiers_mode: null,
		usage_type: "licensed",
	},
	tax_id_collection: {
		enabled: false,
		required: "never",
	},
	token: "tok_123",
	trial_period_days: 14,
	trial_settings: null,
	unit_label: null,
};

const mockPricingTable: PricingTableType = {
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
	pricing_table_items: [mockPricingTableItem],
};

describe("PricingTable", () => {
	it("should render loading state", () => {
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: null,
			loading: true,
			error: null,
		});

		render(
			<PricingTable pricingTableId="prctbl_123" publishableKey="pk_test_123" />,
		);

		expect(screen.getByText("Loading pricing plans...")).toBeInTheDocument();
	});

	it("should render error state", () => {
		const errorMessage = "Failed to load pricing";
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: null,
			loading: false,
			error: errorMessage,
		});

		render(
			<PricingTable pricingTableId="prctbl_123" publishableKey="pk_test_123" />,
		);

		expect(
			screen.getByText(`Error loading pricing: ${errorMessage}`),
		).toBeInTheDocument();
	});

	it("should render empty state", () => {
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: { ...mockPricingTable, pricing_table_items: [] },
			loading: false,
			error: null,
		});

		render(
			<PricingTable pricingTableId="prctbl_123" publishableKey="pk_test_123" />,
		);

		expect(screen.getByText("No pricing plans available")).toBeInTheDocument();
	});

	it("should render pricing cards", () => {
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: mockPricingTable,
			loading: false,
			error: null,
		});

		render(
			<PricingTable pricingTableId="prctbl_123" publishableKey="pk_test_123" />,
		);

		expect(screen.getByText("Pro Plan")).toBeInTheDocument();
		expect(screen.getByText("Best for growing teams")).toBeInTheDocument();
		expect(screen.getByText("$29/mo")).toBeInTheDocument();
		expect(screen.getByText("14-day free trial")).toBeInTheDocument();
		expect(screen.getByText("Feature 1")).toBeInTheDocument();
		expect(screen.getByText("Most Popular")).toBeInTheDocument();
	});

	it("should call onSelectPrice when card is clicked", () => {
		const onSelectPrice = vi.fn();
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: mockPricingTable,
			loading: false,
			error: null,
		});

		render(
			<PricingTable
				pricingTableId="prctbl_123"
				publishableKey="pk_test_123"
				onSelectPrice={onSelectPrice}
			/>,
		);

		const subscribeButton = screen.getByText("Subscribe");
		fireEvent.click(subscribeButton);

		expect(onSelectPrice).toHaveBeenCalledWith("price_123", mockPricingTableItem);
	});

	it("should disable button for current price", () => {
		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: mockPricingTable,
			loading: false,
			error: null,
		});

		render(
			<PricingTable
				pricingTableId="prctbl_123"
				publishableKey="pk_test_123"
				currentPriceId="price_123"
			/>,
		);

		const button = screen.getByText("Current Plan");
		expect(button).toBeDisabled();
	});

	it("should filter by annual/monthly", () => {
		const yearlyItem = {
			...mockPricingTableItem,
			price_id: "price_yearly",
			recurring: { ...mockPricingTableItem.recurring, interval: "year" },
		};

		vi.spyOn(usePricingTableModule, "usePricingTable").mockReturnValue({
			pricingTable: {
				...mockPricingTable,
				pricing_table_items: [mockPricingTableItem, yearlyItem],
			},
			loading: false,
			error: null,
		});

		const { rerender } = render(
			<PricingTable
				pricingTableId="prctbl_123"
				publishableKey="pk_test_123"
				annual={false}
			/>,
		);

		// Should show monthly plan
		expect(screen.getByText("$29/mo")).toBeInTheDocument();

		rerender(
			<PricingTable
				pricingTableId="prctbl_123"
				publishableKey="pk_test_123"
				annual={true}
			/>,
		);

		// Should show yearly plan
		expect(screen.getByText("$29/year")).toBeInTheDocument();
	});
});
