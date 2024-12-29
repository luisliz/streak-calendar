import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <p className="mx-auto mt-16 mb-16 max-w-[500px] opacity-80 md:text-2xl">
        <span className="font-bold">“You are what you repeatedly do.”</span>
        <br />
        Build lasting habits. Start your streak today and unlock your{" "}
        <span className="font-semibold italic">true potential</span>.
      </p>

      <div className="shadow-lg border-4 border-red-500 rounded-3xl relative w-full max-w-2xl overflow-hidden aspect-video mx-auto transition-[border-color] hover:border-red-400">
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src="https://www.youtube.com/embed/mVQ1bzd816I?si=h-UGS9kLXH-gN2Cs"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className="w-full max-w-2xl text-right pr-2">
        <a
          href="https://youtu.be/u98FTiCfIRg?t=685"
          className="text-sm text-muted-foreground underline opacity-50 hover:opacity-100 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          Full video
        </a>
      </div>

      <div className="cta mt-16">
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/calendars">Go to Calendars</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/pricing">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
