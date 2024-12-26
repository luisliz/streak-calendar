export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-16 px-4 mx-auto">
      <h1 className="text-4xl font-bold mb-8">About Streak Calendar</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Streak Calendar empowers you to build habits and stay consistent with your goals. Inspired by Jerry
              Seinfeld&#039;s &quot;Don&#039;t Break the Chain&quot; method, it turns habit tracking into a visual
              motivator. Each day you stick to a habit, you mark an &#039;
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="inline w-4 h-4 fill-red-500">
                <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
              </svg>
              &#039; on the calendar, creating an unbroken chain that showcases your progress. This simple yet powerful
              approach keeps you inspired to keep going. 💪
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              With customizable views, color-coded progress tracking 🌈, and seamless calendar management 📅, Streak
              Calendar adapts to your unique needs. Whether you&#039;re working on daily routines, achieving long-term
              goals, or just building consistency, its intuitive design makes tracking habits simple, motivating, and
              rewarding. Start small, stay consistent, and watch your streaks grow into lasting success. 🌱
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
