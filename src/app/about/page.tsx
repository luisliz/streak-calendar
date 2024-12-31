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
          <p className="text-muted-foreground">
            Inspired by Jerry Seinfeld&apos;s legendary &quot;Don&apos;t Break the Chain&quot; method, Streak Calendar
            is designed to help you build better habits and conquer procrastination. By making consistency fun and
            rewarding, it turns daily habit tracking into a simple, motivating experience.
          </p>
        </CardContent>
        <CardContent>
          <h2 className="font-heading text-2xl font-bold">What It Is</h2>
          <p className="text-muted-foreground pt-6">
            Streak Calendar is a productivity tool that combines habit tracking, task timing, and progress
            visualization. It supports multiple calendars and habits, allowing you to customize your approach to
            personal growth. Featuring an activity grid similar to GitHub&apos;s contribution tracker, it offers a clear
            view of your achievements over time. Open source and thoughtfully developed, Streak Calendar is built to
            help you stay on track and achieve your goals.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Features</h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 text-muted-foreground">
            <li>
              <strong>Visual Habit Tracking</strong>
              <p>Mark daily accomplishments with X&apos;s and keep your streak alive</p>
            </li>
            <li>
              <strong>Multi-Habit Support</strong>
              <p>Create multiple calendars and assign habits to each</p>
            </li>
            <li>
              <strong>Customizable Themes</strong>
              <p>Personalize each calendar with a unique color theme</p>
            </li>
            <li>
              <strong>Timed Tasks</strong>
              <p>Use the built-in timer to track task durations and mark them complete</p>
            </li>
            <li>
              <strong>Activity Grid</strong>
              <p>See your annual progress in a grid layout inspired by GitHub&apos;s contribution tracker</p>
            </li>
            <li>
              <strong>Flexible Habit Duration</strong>
              <p>Set custom durations for habits to match your needs</p>
            </li>
            <li>
              <strong>Open Source</strong>
              <p>A tool built for the community, by the community</p>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Open Source Project</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Transparency and collaboration are at the heart of Streak Calendar. By making our project open source, we
            invite users to contribute, innovate, and help make the tool better for everyone.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="italic text-muted-foreground">
              &quot;Hi, I&apos;m Ilya Aizenberg, the creator of Streak Calendar. This project combines my passion for
              productivity and tech to offer a simple yet powerful tool for personal growth. I hope you find it as
              valuable as I do.&quot;
            </p>
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
    </div>
  );
}
