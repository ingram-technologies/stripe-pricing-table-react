import React from "react";
import { PricingTable, usePricingTable } from "../src";

// Example 1: Basic usage
export function BasicExample() {
	return (
		<PricingTable
			pricingTableId="prctbl_1234567890"
			publishableKey="pk_test_..."
			onSelectPrice={(priceId) => {
				console.log("Selected price:", priceId);
				// Redirect to checkout
				window.location.href = `/checkout?price=${priceId}`;
			}}
		/>
	);
}

// Example 2: With custom styling and current plan
export function StyledExample() {
	const currentPriceId = "price_123"; // Get from your user data

	return (
		<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
			<h2 style={{ textAlign: "center", marginBottom: "40px" }}>
				Choose Your Plan
			</h2>
			<PricingTable
				pricingTableId="prctbl_1234567890"
				publishableKey="pk_test_..."
				currentPriceId={currentPriceId}
				annual={false}
				className="pricing-container"
				onSelectPrice={(priceId, item) => {
					if (priceId === currentPriceId) return;

					if (confirm(`Switch to ${item.name}?`)) {
						// Handle plan change
						fetch("/api/change-plan", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ priceId }),
						});
					}
				}}
			/>
		</div>
	);
}

// Example 3: Using the hook for custom implementation
export function CustomImplementation() {
	const { pricingTable, loading, error } = usePricingTable({
		pricingTableId: "prctbl_1234567890",
		publishableKey: "pk_test_...",
	});

	if (loading) {
		return (
			<div style={{ textAlign: "center", padding: "40px" }}>
				<div className="spinner" />
				<p>Loading pricing options...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div style={{ textAlign: "center", padding: "40px", color: "red" }}>
				<p>Error loading pricing: {error}</p>
				<button onClick={() => window.location.reload()}>Retry</button>
			</div>
		);
	}

	return (
		<div className="custom-pricing-grid">
			{pricingTable?.pricing_table_items.map((item) => (
				<div key={item.price_id} className="custom-price-card">
					<h3>{item.name}</h3>
					<div className="price">
						{item.amount
							? `$${(parseInt(item.amount) / 100).toFixed(2)}`
							: "Free"}
						{item.amount && `/${item.recurring.interval}`}
					</div>
					{item.trial_period_days && (
						<p className="trial">{item.trial_period_days}-day free trial</p>
					)}
					<ul>
						{item.feature_list.map((feature, i) => (
							<li key={i}>{feature}</li>
						))}
					</ul>
					<button
						onClick={() => handleSubscribe(item.price_id)}
						className={item.is_highlight ? "primary" : "secondary"}
					>
						{item.call_to_action || "Subscribe"}
					</button>
				</div>
			))}
		</div>
	);

	function handleSubscribe(priceId: string) {
		// Your custom checkout logic
		console.log("Subscribe to:", priceId);
	}
}

// Example 4: With fallback for error handling
export function ProductionExample() {
	const [useFallback, setUseFallback] = React.useState(false);

	// Fallback static pricing data
	const staticPricing = [
		{ id: "basic", name: "Basic", price: 9, features: ["Feature 1", "Feature 2"] },
		{
			id: "pro",
			name: "Pro",
			price: 29,
			features: ["Everything in Basic", "Feature 3", "Feature 4"],
		},
		{
			id: "enterprise",
			name: "Enterprise",
			price: 99,
			features: ["Everything in Pro", "Feature 5", "Priority Support"],
		},
	];

	if (useFallback) {
		return (
			<div className="static-pricing">
				{staticPricing.map((plan) => (
					<div key={plan.id}>
						<h3>{plan.name}</h3>
						<p>${plan.price}/mo</p>
						<ul>
							{plan.features.map((f, i) => (
								<li key={i}>{f}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		);
	}

	return (
		<PricingTable
			pricingTableId={process.env.REACT_APP_STRIPE_PRICING_TABLE_ID!}
			publishableKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!}
			errorComponent={(error) => {
				console.error("Failed to load Stripe pricing:", error);
				setUseFallback(true);
				return null;
			}}
			onSelectPrice={(priceId) => {
				// Implement your checkout flow
				window.location.href = `/api/create-checkout-session?price=${priceId}`;
			}}
		/>
	);
}
