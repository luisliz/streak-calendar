"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import NumberFlow from "@number-flow/react";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FREQUENCIES = ["monthly", "yearly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

interface PricingTier {
  name: string;
  description: string;
  features: string[];
  price: {
    monthly: number;
    yearly: number;
  };
  cta: {
    text: string;
    href?: string;
  };
  isComingSoon?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    description: "Perfect for regular users",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: ["Up to 2 calendars", "Up to 2 habits per calendar", "90-day history"],
    cta: {
      text: "Sign Up for Free",
      href: "/calendars",
    },
  },
  {
    name: "Premium",
    description: "For power users",
    price: {
      monthly: 2.99,
      yearly: 19.99,
    },
    features: ["Unlimited calendars", "Unlimited habits per calendar", "Unlimited history", "Priority support"],
    cta: {
      text: "Coming Soon",
    },
    isComingSoon: true,
  },
];

function FrequencyToggle({ frequency, onChange }: { frequency: Frequency; onChange: (f: Frequency) => void }) {
  return (
    <div className="mx-auto flex w-fit rounded-full bg-secondary p-1">
      {FREQUENCIES.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`relative flex items-center gap-2.5 px-4 py-2 text-sm font-semibold capitalize transition-colors ${
            frequency === f ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          <span className="relative z-10">{f}</span>
          {frequency === f && <span className="absolute inset-0 rounded-full bg-background shadow-sm" />}
          {f === "yearly" && (
            <span className="relative z-10 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Save 44%</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  return (
    <section className="flex flex-col items-center gap-10 py-16">
      {/* Section Header */}
      <div className="space-y-7 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium md:text-5xl">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that works best for you</p>
        </div>
        <FrequencyToggle frequency={frequency} onChange={setFrequency} />
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
        {PRICING_TIERS.map((tier) => (
          <div key={tier.name} className={tier.isComingSoon ? "relative opacity-35" : "relative"}>
            {tier.isComingSoon && (
              <div className="absolute -top-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                Coming Soon
              </div>
            )}
            <Card
              className={`relative flex flex-col overflow-hidden border transition-all duration-300 ${
                tier.isComingSoon ? "border-2 border-primary shadow-lg hover:shadow-xl" : "shadow hover:shadow-lg"
              }`}
            >
              {tier.isComingSoon && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="relative mb-6">
                  <div className="text-4xl font-medium">
                    <NumberFlow
                      format={{
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                        currencyDisplay: "narrowSymbol",
                      }}
                      value={tier.price[frequency]}
                    />
                    <span className="text-lg font-normal text-muted-foreground">/{frequency}</span>
                  </div>
                  {frequency === "yearly" && tier.price.yearly > 0 && (
                    <div className="mt-1.5 text-sm text-muted-foreground">
                      ${(tier.price.yearly / 12).toFixed(2)} per month, billed annually
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.isComingSoon ? (
                  <Button size="lg" className="w-full" disabled>
                    {tier.cta.text}
                  </Button>
                ) : (
                  <>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button size="lg" className="w-full" type="button">
                          Sign Up for Free
                        </Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <Button size="lg" className="w-full" asChild>
                        <Link href="/calendars">Go to Calendars</Link>
                      </Button>
                    </SignedIn>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
