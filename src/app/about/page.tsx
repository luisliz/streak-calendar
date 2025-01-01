import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto w-full max-w-3xl space-y-8 py-16">
      <Card className="p-4 shadow">
        <CardHeader>
          <h1 className="font-heading text-4xl font-bold">About Streak Calendar</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Inspired by Jerry Seinfeld&apos;s legendary &quot;Don&apos;t Break the Chain&quot; method, Streak Calendar
            is designed to help you build better habits and conquer procrastination. By making consistency fun and
            rewarding, it turns daily habit tracking into a simple, motivating experience.
          </p>
        </CardContent>
        <CardContent>
          <h2 className="font-heading text-2xl font-bold">What It Is</h2>
          <p className="pt-6 text-muted-foreground">
            Streak Calendar is an open source productivity tool that combines habit tracking, task timing, and progress
            visualization. It supports multiple calendars and habits, allowing you to customize your approach to
            personal growth. Featuring an activity grid similar to GitHub&apos;s contribution tracker, it offers a clear
            view of your achievements over time. Open source and thoughtfully developed, Streak Calendar is built to
            help you stay on track and achieve your goals.
          </p>
        </CardContent>
      </Card>

      <Card className="p-4 shadow">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Features</h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-muted-foreground">
            <li>
              <strong className="text-primary">Visual Habit Tracking</strong>
              <p>Mark daily accomplishments with X&apos;s and keep your streak alive</p>
            </li>
            <li>
              <strong className="text-primary">Multi-Habit Support</strong>
              <p>Create multiple calendars and assign habits to each</p>
            </li>
            <li>
              <strong className="text-primary">Customizable Themes</strong>
              <p>Personalize each calendar with a unique color theme</p>
            </li>
            <li>
              <strong className="text-primary">Timed Tasks</strong>
              <p>Use the built-in timer to track task durations and mark them complete</p>
            </li>
            <li>
              <strong className="text-primary">Activity Grid</strong>
              <p>See your annual progress in a grid layout inspired by GitHub&apos;s contribution tracker</p>
            </li>
            <li>
              <strong className="text-primary">Flexible Habit Duration</strong>
              <p>Set custom durations for habits to match your needs</p>
            </li>
            <li>
              <strong className="text-primary">Open Source</strong>
              <p>A tool built for the community, by the community</p>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="p-4 shadow">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Open Source Project</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Streak Calendar is open source to encourage transparency and collaboration. Contributions and innovations
            from users are welcome, helping to continuously improve the tool and make it even more effective for
            everyone.
          </p>
          <div className="flex items-end">
            <div className="mt-4 rounded-sm rounded-br-none bg-muted p-4">
              <p className="italic text-muted-foreground">
                &quot;Hi, I&apos;m Ilya Aizenberg, the creator of Streak Calendar. This project combines my passion for
                productivity and tech to offer a simple yet powerful tool for personal growth. I hope you find it as
                valuable as I do.&quot;
              </p>
            </div>

            <Avatar className="relative top-6 ml-2 h-12 w-12">
              <AvatarImage src="https://avatars.githubusercontent.com/u/8214158?s=100" />
              <AvatarFallback>IA</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button asChild variant="outline" size="lg">
            <Link href="https://github.com/ilyaizen/streak-calendar" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="p-4 shadow">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">The Seinfeld Strategy</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full md:w-2/3">
            <Image
              src="/never-miss-twice.jpg"
              alt="Never miss twice calendar visualization"
              fill
              className="rounded-sm object-cover"
            />
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-muted-foreground">
              The story behind this method comes from Brad Isaac, a young comedian who met Jerry Seinfeld backstage and
              asked for advice. Seinfeld told him that to be a better comic, he needed to create better jokes - and the
              way to create better jokes was to write every day.
            </p>

            <blockquote className="my-6 border-l-2 pl-6 italic text-muted-foreground">
              &quot;He told me to get a big wall calendar that has a whole year on one page and hang it on a prominent
              wall. The next step was to get a big red magic marker. He said for each day that I do my task of writing,
              I get to put a big red X over that day. After a few days you&apos;ll have a chain. Just keep at it and the
              chain will grow longer every day. You&apos;ll like seeing that chain, especially when you get a few weeks
              under your belt. Your only job is to not break the chain.&quot;
            </blockquote>

            <p className="text-muted-foreground">
              What makes this strategy powerful is its simplicity. It doesn&apos;t matter if you&apos;re motivated or
              not. It doesn&apos;t matter if you&apos;re producing great work or not. All that matters is not breaking
              the chain.
            </p>

            <h3 className="mb-6 mt-6 text-xl font-bold">Why It Works</h3>
            <p className="text-muted-foreground">
              The Seinfeld Strategy works because it shifts focus from individual performances to the process itself.
              Instead of worrying about how inspired you are or how brilliant your work is that day, you simply focus on
              showing up and not breaking the chain. This consistency is what separates top performers from everyone
              else.
            </p>

            <div className="mt-6 rounded-sm bg-muted p-4">
              <h4 className="flex justify-center font-bold">Key Principles:</h4>
              <ul className="mt-2 list-disc pl-6 text-muted-foreground">
                <li>Choose a meaningful but sustainable daily task</li>
                <li>Focus on the process, not the results</li>
                <li>Build the chain one day at a time</li>
                <li>Never break the chain</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Content adapted from{" "}
            <Link
              href="https://jamesclear.com/stop-procrastinating-seinfeld-strategy"
              className="font-bold hover:text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              James Clear&apos;s article
            </Link>{" "}
            on the Seinfeld Strategy
          </p>
        </CardFooter>
      </Card>

      <div className="flex justify-center">
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/calendars">Go to Calendars</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button asChild size="lg">
            <Link href="/pricing">Get Started</Link>
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}
