/**
 * Root layout component for the Streak Calendar application.
 * This is the top-level layout that wraps all pages and provides common functionality.
 */
import "./globals.css";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <html suppressHydrationWarning>{children}</html>;
}
