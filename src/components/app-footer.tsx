import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Streak Calendar</h3>
            <p className="text-sm text-muted-foreground">Build better habits with visual progress tracking</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calendars" className="hover:text-primary">
                  Calendars
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Streak Calendar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
