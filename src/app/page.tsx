import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center">
      <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
        <div className="flex flex-col gap-6 py-10 rounded-xl bg-black/90 w-[90%] sm:w-3/5 lg:w-3/6 mx-auto text-white sm:text-2xl border border-white">
          <h1 className="text-xl sm:text-3xl font-bold">
            Al-Asi Computer
            <br />
            Repair Shop
          </h1>
          <address>
            7 Port Said Street,
            <br />
            Mit Ghamr City, Dakahlia
          </address>
          <p>Open Daily: 9am to 6pm</p>
          <Link href="tel:01554879094" className="hover:underline">
            015-5487-9094
          </Link>

          <Button asChild className="w-fit mx-auto text-lg rounded-full">
            <LoginLink>Sign In</LoginLink>
          </Button>
        </div>
      </main>
    </div>
  );
}
