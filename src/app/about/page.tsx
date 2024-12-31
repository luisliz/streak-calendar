import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16 space-y-8 w-full mx-auto">
      <Card className="shadow p-4">
        <CardHeader>
          <h1 className="font-heading text-4xl font-bold">About Streak Calendar</h1>
        </CardHeader>
        <CardContent>
          <section>
            <h2 className="font-heading text-2xl font-bold">Turn Goals into Reality</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Streak Calendar transforms abstract goals into daily achievements. Using the proven &quot;Don&apos;t
                Break the Chain&quot; method, it helps you build lasting habits through visual motivation and consistent
                action.
              </p>
              <p>
                From coding to fitness, every daily action compounds into significant progress. Start small, stay
                consistent, achieve more.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Four Steps to Success</h2>
        </CardHeader>
        <CardContent>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>Define your target habit</li>
            <li>Complete your daily action</li>
            <li>Build your streak</li>
            <li>Let momentum drive you forward</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Essential Features</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-inside space-y-2 text-muted-foreground">
            <li>Visual progress dashboard</li>
            <li>Multi-habit tracking system</li>
            <li>Cross-device compatibility</li>
            <li>Privacy-focused local storage</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Open Source</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Built with transparency and collaboration in mind. Powered by Next.js, TypeScript, and Tailwind CSS, the
            entire codebase is open for exploration, contribution, and customization on GitHub.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/ilyaizen/streak-calendar" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
