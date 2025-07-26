# stripe-pricing-table-react

A React library for fetching and displaying Stripe pricing tables using Stripe's pricing table API. This library provides components and utilities to render custom pricing tables with data fetched directly from Stripe.

## Important Notice

**This library relies on Stripe's private API endpoints that are not officially documented or supported.** These APIs:

- May change or break without notice
- Are not covered by Stripe's versioning policy
- Could be rate-limited or blocked by Stripe
- Should not be used in production without understanding the risks

**It is strongly recommended to:**

1. Implement fallback mechanisms
2. Cache pricing data to reduce API calls
3. Have a backup pricing table configuration
4. Monitor for API failures
5. Consider using Stripe's official pricing table web component instead

## Installation

```bash
npm install @ingram-tech/stripe-pricing-table-react
```

## Features

- 🎨 Customizable React components for pricing tables
- 🔄 Real-time fetching from Stripe pricing tables
- 📱 Responsive design with mobile support
- 🎯 TypeScript support with full type definitions
- 🧪 Comprehensive test coverage
- 🎭 Custom card components for complete control
- 💰 Multi-currency support
- 🔄 Annual/monthly billing toggle

## Quick Start

### Using the PricingTable Component

```tsx
import { PricingTable } from "stripe-pricing-table-react";

function App() {
	const handlePriceSelection = (priceId, item) => {
		console.log("Selected price:", priceId);
		// Redirect to checkout or handle selection
	};

	return (
		<PricingTable
			pricingTableId="prctbl_1234567890"
			publishableKey="pk_test_..."
			onSelectPrice={handlePriceSelection}
			annual={false}
		/>
	);
}
```

### Using the Hook Directly

```tsx
import { usePricingTable } from "stripe-pricing-table-react";

function CustomPricingTable() {
	const { pricingTable, loading, error } = usePricingTable({
		pricingTableId: "prctbl_1234567890",
		publishableKey: "pk_test_...",
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{pricingTable?.pricing_table_items.map((item) => (
				<div key={item.price_id}>
					<h3>{item.name}</h3>
					<p>{item.amount ? `$${parseInt(item.amount) / 100}` : "Free"}</p>
				</div>
			))}
		</div>
	);
}
```

### Custom Card Component

```tsx
import { PricingTable } from "stripe-pricing-table-react";

const CustomCard = ({ item, isCurrentPrice, onSelect }) => (
	<div className="custom-pricing-card">
		<h3>{item.name}</h3>
		<p className="price">
			${parseInt(item.amount) / 100}/{item.recurring.interval}
		</p>
		<ul>
			{item.feature_list.map((feature, i) => (
				<li key={i}>{feature}</li>
			))}
		</ul>
		<button onClick={onSelect} disabled={isCurrentPrice}>
			{isCurrentPrice ? "Current Plan" : "Select"}
		</button>
	</div>
);

function App() {
	return (
		<PricingTable
			pricingTableId="prctbl_1234567890"
			publishableKey="pk_test_..."
			cardComponent={CustomCard}
		/>
	);
}
```

## API Reference

### Components

#### `<PricingTable />`

Main component for rendering a pricing table.

| Prop               | Type                                                | Default        | Description                       |
| ------------------ | --------------------------------------------------- | -------------- | --------------------------------- |
| `pricingTableId`   | `string`                                            | required       | Your Stripe pricing table ID      |
| `publishableKey`   | `string`                                            | required       | Your Stripe publishable key       |
| `annual`           | `boolean`                                           | `false`        | Show annual or monthly pricing    |
| `currentPriceId`   | `string`                                            | -              | ID of the current plan            |
| `onSelectPrice`    | `(priceId: string, item: PricingTableItem) => void` | -              | Callback when a price is selected |
| `loadingComponent` | `ReactNode`                                         | Default loader | Custom loading component          |
| `errorComponent`   | `(error: string) => ReactNode`                      | Default error  | Custom error component            |
| `cardComponent`    | `React.FC<PricingCardProps>`                        | Default card   | Custom pricing card component     |
| `className`        | `string`                                            | -              | CSS class for the container       |
| `cardClassName`    | `string`                                            | -              | CSS class for the cards grid      |

### Hooks

#### `usePricingTable`

Hook for fetching pricing table data.

```tsx
const { pricingTable, loading, error } = usePricingTable({
	pricingTableId: "prctbl_...",
	publishableKey: "pk_...",
});
```

### Functions

#### `fetchPricingTable`

Low-level function to fetch pricing table data.

```tsx
import { fetchPricingTable } from "stripe-pricing-table-react";

const pricingTable = await fetchPricingTable("prctbl_1234567890", "pk_test_...");
```

## Error Handling

The library includes built-in error handling, but you should implement your own fallbacks:

```tsx
function SafePricingTable() {
	const [fallbackToStatic, setFallbackToStatic] = useState(false);

	if (fallbackToStatic) {
		return <StaticPricingTable />; // Your fallback component
	}

	return (
		<PricingTable
			pricingTableId="prctbl_1234567890"
			publishableKey="pk_test_..."
			errorComponent={(error) => {
				console.error("Pricing table error:", error);
				setFallbackToStatic(true);
				return null;
			}}
		/>
	);
}
```

## Alternatives

Consider these official alternatives:

1. [Stripe Pricing Table Element](https://stripe.com/docs/payments/checkout/pricing-table) - Official web component
2. [Stripe Products API](https://stripe.com/docs/api/products) - Build your own with official APIs
3. [Stripe Checkout](https://stripe.com/docs/payments/checkout) - Pre-built checkout experience
