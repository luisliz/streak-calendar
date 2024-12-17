import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen p-8">
      <main>
        <p>Hello World</p>
        {userId ? <SignOutButton /> : <SignInButton />}
        <div className="absolute top-0 right-0">
          <UserButton />
        </div>
      </main>
    </div>
  );
}
