/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type url = string;
export type StripeId = string;

type Currency = string;
type UnixEpoch = number;

type BrandingSettings = {
	background_color: string;
	border_style: "default" | string;
	button_color: string;
	font_family: "default" | string;
};

type FeatureFlags = {
	enable_yearly_as_monthly_price_display: boolean;
	use_optimized_images: boolean;
};

type AddressCollection = {
	address_collection_setting: "required" | string;
	allowed_shipping_countries: string[] | null;
	id: string;
};

type AdjustableQuantity = {
	enabled: boolean;
	id: string;
	maximum: number;
	minimum: number;
};

type AutomaticTax = {
	enabled: boolean;
	id: string;
};

type ConfirmationPage = {
	custom_message: string | null;
	id: string;
	redirect_url: string | null;
	type: "confirmation_page";
};

type ConsentCollection = {
	payment_method_reuse_agreement: unknown;
	promotions: "none" | string;
	terms_of_service: "none" | string;
};

type PhoneNumberCollection = {
	enabled: boolean;
	id: string;
};

type Recurring = {
	all_tiers: unknown;
	billing_scheme: "per_unit" | string;
	id: string;
	interval: "month" | "year" | string;
	interval_count: number;
	interval_in_seconds: number;
	tier_prices: Array<number | null>;
	tier_starting_prices: number[];
	tiers: unknown;
	tiers_mode: unknown;
	usage_type: "licensed" | string;
};

type TaxIdCollection = {
	enabled: boolean;
	required: "never" | string;
};

type DropdownOptions = {
	label: string;
	value: string;
};

type CustomField = {
	id: StripeId;
	dropdown: { options: DropdownOptions[] } | null;
	key: string;
	label: {
		custom: string;
		type: "custom";
	};
	numeric: {
		maximum_length: number | null;
		minimum_length: number | null;
	} | null;
	optional: boolean;
	text: {
		maximum_length: number | null;
		minimum_length: number | null;
	} | null;
	type: "text" | "numeric" | "dropdown";
};

export type PricingTableItem = {
	address_collection: AddressCollection;
	adjustable_quantity: AdjustableQuantity;
	allow_promotion_codes: boolean;
	amount: string | null;
	automatic_tax: AutomaticTax;
	call_to_action: string;
	call_to_action_link: url;
	confirmation_page: ConfirmationPage;
	consent_collection: ConsentCollection;
	currency: Currency;
	custom_fields: CustomField[];
	feature_list: string[];
	highlight_text: string | null;
	image_url: string | null;
	is_highlight: boolean;
	name: string;
	payment_method_collection: "always" | string;
	phone_number_collection: PhoneNumberCollection;
	price_id: StripeId;
	price_type: "recurring" | string;
	product_description: string | null;
	product_id: StripeId;
	recurring: Recurring;
	tax_id_collection: TaxIdCollection;
	token: string;
	trial_period_days: number | null;
	trial_settings: unknown;
	unit_label: string | null;
};

export type PricingTable = {
	active: boolean;
	branding_settings: BrandingSettings;
	created: UnixEpoch;
	custom_url_items: unknown;
	default_interval: unknown;
	feature_flags: FeatureFlags;
	has_archived_products_or_prices: boolean;
	id: StripeId;
	livemode: boolean;
	locale: string;
	merchant_id: StripeId;
	merchant_internal_label: string;
	object: "pricing_table";
	pricing_table_items: PricingTableItem[];
};
