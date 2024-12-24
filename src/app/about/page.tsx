export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">About Streak Calendar</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Streak Calendar was created with a simple goal: to help people build and maintain positive habits through
            visual tracking and motivation. We believe that seeing your progress is the key to staying motivated and
            achieving your goals.
          </p>
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
