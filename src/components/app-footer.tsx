export function AppFooter() {
  return (
    <footer className="py-8 mt-auto bg-sky-100 dark:bg-sky-950">
      <div className="mt-8 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Streak Calendar. All rights reserved.
      </div>
    </footer>
  );
}
