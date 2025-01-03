# Streak Calendar

Streak Calendar is an open source productivity tool that combines habit tracking, task timing, and progress visualization. It supports multiple calendars and habits, allowing you to customize your approach to personal growth. Featuring an activity grid similar to GitHub's contribution tracker, it offers a clear view of your achievements over time.

This project is currently in its experimental/alpha stage and is solely developed by me. Any feedback, contributions, or support would be greatly appreciated as I continue to improve and refine it.

## Features

Explore a range of features designed to help you stay motivated and organized:

- **Visual Habit Tracking**: Mark daily accomplishments with X's and keep your streak alive
- **Multi-Habit Support**: Create multiple calendars and assign habits to each
- **Customizable Themes**: Personalize each calendar with a unique color theme
- **Timed Tasks**: Use the built-in timer to track task durations and mark them complete
- **Activity Grid**: See your annual progress in a grid layout inspired by GitHub's contribution tracker
- **Flexible Habit Duration**: Set custom durations for habits to match your needs
- **Responsive Design**: Fully responsive UI that works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: Built-in theme support for comfortable viewing in any lighting
- **Internationalization**: Support for multiple languages and locales
- **Open Source**: A tool built for the community, by the community

## Technologies Used

Built with a modern tech stack to ensure efficiency, scalability, and an engaging user experience:

- Framework: [Next.js](https://nextjs.org/)
- Backend: [Convex](https://www.convex.dev/)
- Authentication: [Clerk](https://clerk.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- UI: [shadcn/ui](https://ui.shadcn.com/)

Also used: [Canvas Confetti](https://www.kirilv.com/canvas-confetti/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [date-fns](https://date-fns.org/), [shadcn-pricing-page](https://github.com/aymanch-03/shadcn-pricing-page)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ilyaizen/streak-calendar.git

# Navigate to the project
cd streak-calendar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the app running.

## Project Structure

```
streak-calendar/
├── src/
│   ├── app/             # Next.js app router pages and layouts
│   ├── components/      # Reusable UI components
│   │   ├── calendar/    # Calendar-specific components
│   │   └── ui/          # Base UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared logic
│   └── types.ts         # TypeScript type definitions
├── public/              # Static assets
├── convex/              # Convex backend functions and schema
├── .env.local           # Environment variables
└── package.json         # Project dependencies and scripts
```

## Contributing

Streak Calendar is open source to encourage transparency and collaboration. Contributions and innovations from users are welcome, helping to continuously improve the tool and make it even more effective for everyone.

## Links

- [GitHub Repository](https://github.com/ilyaizen/streak-calendar)
- Creator: [Ilya Aizenberg](https://github.com/ilyaizen)

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy tracking! 🎯
