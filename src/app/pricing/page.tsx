import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container max-w-5xl py-16 px-4 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">Choose the plan that works best for you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Tier */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Up to 3 habit calendars</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Basic habit tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>30-day history</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="w-full" asChild>
                <Link href="/calendars">Go to Calendars</Link>
              </Button>
            </SignedIn>
          </CardFooter>
        </Card>

        {/* Premium Tier */}
        <Card className="flex flex-col border-2 border-primary relative opacity-40">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Coming Soon
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>For power users</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-4xl font-bold mb-6">
              $2.99<span className="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited habit calendars</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Unlimited history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
