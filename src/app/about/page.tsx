import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16 space-y-8 w-full mx-auto">
      <Card className="shadow rounded-xl p-4">
        <CardHeader>
          <h1 className="font-heading text-4xl font-bold">About Streak Calendar</h1>
        </CardHeader>
        <CardContent>
          <section>
            <h2 className="font-heading text-2xl font-bold">What It Is</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Streak Calendar is here to help you turn small, daily actions into habits—because apparently,
                consistency is <em>really</em> hard. Inspired by Jerry Seinfeld&apos;s &quot;Don&apos;t Break the
                Chain&quot; method, it&apos;s simple: mark an &apos;
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="inline w-4 h-4 fill-red-500">
                  <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
                </svg>
                &apos; on the calendar every time you actually do the thing, and voilà—your streak grows. The longer
                your streak, the guiltier you&apos;ll feel about stopping. Genius, right?
              </p>
              <p>
                But there&apos;s more to this than just guilt and markers. The Seinfeld Strategy is all about{" "}
                <strong>consistency over perfection</strong>. It&apos;s not about doing something flawlessly; it&apos;s
                about showing up every single day. The goal? Build momentum 💪, develop discipline 🧠, and ultimately
                achieve mastery 🌟 through small, daily efforts.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow rounded-xl p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">How It Works</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here&apos;s how simple it is:</p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>Pick a habit you want to build—anything from exercising 🏋️‍♂️ to learning to meditate 🧘.</li>
            <li>Do it daily. Even small efforts count.</li>
            <li>
              Mark an &apos;
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="inline w-4 h-4 fill-red-500">
                <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
              </svg>
              &apos; on your Streak Calendar.
            </li>
            <li>Don&apos;t break the chain. The longer it grows, the more motivated you&apos;ll feel to keep going.</li>
          </ol>
          <p className="mt-4 text-muted-foreground">
            This isn&apos;t about big wins overnight; it&apos;s about building discipline 📅, overcoming procrastination
            🕒, and achieving long-term success 🚀.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow rounded-xl p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Features</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-inside space-y-2 text-muted-foreground">
            <li>
              📊 <em>Visual Progress Tracking:</em> Keep your goals in sight with a clear streak view.
            </li>
            <li>
              🎯 <em>Multiple Habit Tracking:</em> For those ambitious enough to juggle more than one goal.
            </li>
            <li>
              📱 <em>Responsive Design:</em> Works seamlessly on any device.
            </li>
            <li>
              🔒 <em>Secure Data Storage:</em> Because your streak deserves privacy.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow rounded-xl p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Start Your Streak</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ready to start building the habits that lead to success? Sign up for free on streakcalendar.com and start
            your streak today. Or, if you&apos;re a developer (or just curious), check out the project on GitHub.
            It&apos;s open source, so you can dive in, contribute, or even run it yourself.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/pricing">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/ilyavishnev/streak-calendar-v2" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
