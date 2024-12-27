export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-16 px-4 mx-auto">
      <h1 className="text-4xl font-bold mb-8">About Streak Calendar</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What It Is</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Streak Calendar helps you turn small, daily actions into powerful habits. Inspired by Jerry
              Seinfeld&apos;s &quot;Don&apos;t Break the Chain&quot; method, it&apos;s a simple yet effective way to
              stay consistent. Mark an &apos;
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="inline w-4 h-4 fill-red-500">
                <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
              </svg>
              &apos; on the calendar every time you complete a habit, and watch your chain grow. The longer the streak,
              the harder it is to stop!
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you&apos;re exercising, learning, or just building better routines, Streak Calendar adapts to your
              goals with features like color-coded tracking 🌈, multiple habit management 🎯, and progress insights 📊.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our platform provides an intuitive way to track your daily habits using a visual calendar system. Each day
              you complete a habit, you build your streak. The longer your streak, the more motivated you&apos;ll be to
              maintain it.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you&apos;re trying to exercise more, read daily, or learn a new skill, Streak Calendar helps you
              stay accountable and motivated.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="grid gap-4 text-lg text-muted-foreground">
            <li>📊 Visual progress tracking</li>
            <li>🎯 Multiple habit tracking</li>
            <li>📱 Responsive design for all devices</li>
            <li>🔄 Daily, weekly, and monthly views</li>
            <li>📈 Progress analytics</li>
            <li>🔒 Secure data storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Ready to start building better habits? Sign up for free and begin your journey toward positive change. Our
            intuitive interface makes it easy to get started, and our community is here to support you along the way.
          </p>
        </section>
      </div>
    </div>
  );
}
