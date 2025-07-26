import React from "react";
import { PricingTableItem } from "../types";
import { usePricingTable } from "../hooks/use-pricing-table";

export interface PricingTableProps {
	pricingTableId: string;
	publishableKey: string;
	annual?: boolean;
	currentPriceId?: string;
	onSelectPrice?: (priceId: string, item: PricingTableItem) => void;
	loadingComponent?: React.ReactNode;
	errorComponent?: (error: string) => React.ReactNode;
	cardComponent?: (props: PricingCardProps) => React.ReactNode;
	className?: string;
	cardClassName?: string;
}

export interface PricingCardProps {
	item: PricingTableItem;
	isCurrentPrice: boolean;
	onSelect: () => void;
}

const defaultErrorComponent = (error: string) => (
	<div style={{ padding: "20px", textAlign: "center", color: "#dc2626" }}>
		Error loading pricing: {error}
	</div>
);

const defaultLoadingComponent = (
	<div style={{ padding: "40px", textAlign: "center" }}>Loading pricing plans...</div>
);

const defaultCardComponent = ({ item, isCurrentPrice, onSelect }: PricingCardProps) => {
	const formatPrice = (
		amount: string | null,
		currency: string,
		interval: string,
	): string => {
		if (!amount) return "Free";

		const numAmount = parseInt(amount) / 100;
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency.toUpperCase(),
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});

		return `${formatter.format(numAmount)}/${interval === "year" ? "year" : "mo"}`;
	};

	const price = formatPrice(item.amount, item.currency, item.recurring.interval);

	return (
		<div
			style={{
				border: "1px solid #e5e5e5",
				borderRadius: "8px",
				padding: "24px",
				backgroundColor: item.is_highlight ? "#f9fafb" : "white",
				position: "relative",
				transform: item.is_highlight ? "scale(1.05)" : "scale(1)",
				boxShadow: item.is_highlight ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
			}}
		>
			{item.is_highlight && item.highlight_text && (
				<div
					style={{
						position: "absolute",
						top: "-12px",
						left: "50%",
						transform: "translateX(-50%)",
						backgroundColor: "#3b82f6",
						color: "white",
						padding: "4px 12px",
						borderRadius: "12px",
						fontSize: "12px",
						fontWeight: "500",
					}}
				>
					{item.highlight_text}
				</div>
			)}
			<h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
				{item.name}
			</h3>
			{item.product_description && (
				<p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
					{item.product_description}
				</p>
			)}
			<div style={{ marginBottom: "24px" }}>
				<div style={{ fontSize: "32px", fontWeight: "700" }}>{price}</div>
				{item.trial_period_days && (
					<p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
						{item.trial_period_days}-day free trial
					</p>
				)}
			</div>
			<ul style={{ listStyle: "none", padding: 0, marginBottom: "24px" }}>
				{item.feature_list.map((feature, index) => (
					<li
						key={index}
						style={{
							display: "flex",
							alignItems: "start",
							marginBottom: "12px",
						}}
					>
						<span style={{ color: "#10b981", marginRight: "8px" }}>✓</span>
						<span style={{ fontSize: "14px", color: "#374151" }}>
							{feature}
						</span>
					</li>
				))}
			</ul>
			<button
				onClick={onSelect}
				disabled={isCurrentPrice}
				style={{
					width: "100%",
					padding: "10px 16px",
					borderRadius: "6px",
					fontWeight: "500",
					cursor: isCurrentPrice ? "not-allowed" : "pointer",
					backgroundColor: isCurrentPrice
						? "#e5e7eb"
						: item.is_highlight
							? "#3b82f6"
							: "white",
					color: isCurrentPrice
						? "#9ca3af"
						: item.is_highlight
							? "white"
							: "#374151",
					border:
						item.is_highlight || isCurrentPrice
							? "none"
							: "1px solid #d1d5db",
				}}
			>
				{isCurrentPrice ? "Current Plan" : item.call_to_action || "Select"}
			</button>
		</div>
	);
};

export const PricingTable: React.FC<PricingTableProps> = ({
	pricingTableId,
	publishableKey,
	annual = false,
	currentPriceId,
	onSelectPrice,
	loadingComponent = defaultLoadingComponent,
	errorComponent = defaultErrorComponent,
	cardComponent: CardComponent = defaultCardComponent,
	className = "",
	cardClassName = "",
}) => {
	const { pricingTable, loading, error } = usePricingTable({
		pricingTableId,
		publishableKey,
	});

	if (loading) {
		return <>{loadingComponent}</>;
	}

	if (error) {
		return <>{errorComponent(error)}</>;
	}

	if (!pricingTable || !pricingTable.pricing_table_items.length) {
		return (
			<div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
				No pricing plans available
			</div>
		);
	}

	const filteredItems = pricingTable.pricing_table_items.filter(({ recurring }) =>
		annual ? recurring.interval === "year" : recurring.interval === "month",
	);

	return (
		<div className={className}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
					gap: "24px",
				}}
				className={cardClassName}
			>
				{filteredItems.map((item) => (
					<CardComponent
						key={item.price_id}
						item={item}
						isCurrentPrice={currentPriceId === item.price_id}
						onSelect={() => onSelectPrice?.(item.price_id, item)}
					/>
				))}
			</div>
		</div>
	);
};
