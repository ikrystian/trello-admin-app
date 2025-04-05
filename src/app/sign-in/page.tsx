import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Trello Time Report Admin</h1>
          <Link href="/" className="hover:underline">
            Powrót do strony głównej
          </Link>
        </div>
      </header>
      <main className="flex flex-grow justify-center items-center p-4">
        <SignInForm />
      </main>
    </div>
  );
}
