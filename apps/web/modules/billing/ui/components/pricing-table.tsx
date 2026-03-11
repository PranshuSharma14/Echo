"use client";

import { PricingTable as ClerkPricingTable } from "@clerk/nextjs";
import { Component, type ReactNode } from "react";

class BillingErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-y-4 p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">
            Billing is not enabled yet. Visit the Clerk dashboard to set up billing.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PricingTable = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <BillingErrorBoundary>
        <ClerkPricingTable
          forOrganizations
          appearance={{
            elements: {
              pricingTableCard: "shadow-none! border! rounded-lg!",
              pricingTableCardHeader: "bg-background!",
              pricingTableCardBody: "bg-background!",
              pricingTableCardFooter: "bg-background!",
            }
          }}
        />
      </BillingErrorBoundary>
    </div>
  )
};