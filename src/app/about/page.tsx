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
            <h2 className="font-heading text-2xl font-bold">What It Is</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              <p>
                Streak Calendar is designed to help you build habits through consistent, daily actions. Inspired by
                Jerry Seinfeld&apos;s &quot;Don&apos;t Break the Chain&quot; method, which emphasizes the psychological
                power of visual motivation, it offers a simple and effective way to track your progress: mark a day on
                the calendar whenever you complete your habit, and watch your streak grow.
              </p>
              <p>
                The core idea is about focusing on consistency over perfection. It&apos;s not about doing everything
                perfectly; it&apos;s about showing up each day. For example, think of a writer who commits to writing
                just one sentence daily. Over time, these small efforts build into pages, and eventually a completed
                work—highlighting how consistency fuels progress. This consistent effort helps you build momentum,
                develop discipline, and achieve your goals through small, steady steps.
              </p>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">How It Works</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Getting started is simple:</p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>
              Choose a habit you want to cultivate, like exercising 🏋️‍♂️, practicing mindfulness 🧘, learning a language
              🌐, journaling ✍️, or even drinking more water 🍽.
            </li>
            <li>Commit to doing it daily—even small steps count.</li>
            <li>Mark your progress on the Streak Calendar.</li>
            <li>Keep the chain going. The longer your streak, the more motivated you&apos;ll feel to maintain it.</li>
          </ol>
          <p className="mt-4 text-muted-foreground">
            This approach encourages steady growth, helps you overcome procrastination, and lays the foundation for
            long-term success.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Features</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-inside space-y-2 text-muted-foreground">
            <li>
              📊 <em>Visual Progress Tracking:</em> Clearly see your streaks and monitor your progress.
            </li>
            <li>
              🎯 <em>Multiple Habit Tracking:</em> Manage several habits at once to achieve a well-rounded routine.
            </li>
            <li>
              📱 <em>Responsive Design:</em> Accessible on any device for convenience.
            </li>
            <li>
              🔒 <em>Secure Data Storage:</em> Your habit data is stored safely and privately.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Open Source</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Streak Calendar is more than just a habit tracker—it&apos;s also an open-source project. Created by me, Ilya
            Aizenberg, it&apos;s built to help individuals stay consistent while allowing developers to learn,
            contribute, and adapt it to their needs. The source code is available on GitHub, where you can explore how
            it works, suggest improvements, or even fork it to make your own version. Collaboration is always welcome!
          </p>
        </CardContent>
      </Card>

      <Card className="shadow p-4">
        <CardHeader>
          <h2 className="font-heading text-2xl font-bold">Start Your Streak</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Building lasting habits starts today. Take a moment to reflect on the goals that matter most to you, then
            sign up for free at streakcalendar.com to begin your journey. If you&apos;re a developer or curious about
            the project, explore the open-source code on GitHub. You can contribute, customize, or run it independently.
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
