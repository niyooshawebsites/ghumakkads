import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center items-center px-3 relative">
      <div className="w-full md:w-5/12 bg-blue-50 p-5 rounded-lg space-y-3 z-20 absolute right-60 bottom-28">
        <h1 className="text-4xl text-blue-600 mb-10">Welcome Ghumakkads!</h1>
        <h2 className="text-2xl text-blue-500">
          Discover Stories That Inspire, Inform, and Empower
        </h2>
        <p>
          Explore a growing collection of posts covering wildlife,
          sustainability, technology, education, health, and more. Stay
          informed, learn something new, and discover ideas that matter.
        </p>
        <Link href="/posts">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            variant={"secondary"}
          >
            Explore Posts
          </Button>
        </Link>

        <h1 className="text-2xl my-5 text-red-500">OR</h1>

        <div className="space-y-3">
          <h2 className="text-2xl text-blue-500">
            Share Your Knowledge with the Community
          </h2>
          <p>
            Have a story to tell or expertise to share? Create an account to
            publish your own posts, connect with readers, and contribute
            meaningful content.
          </p>
          <div className="space-x-3">
            <Link href="/login">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                variant={"secondary"}
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button
                variant={"outline"}
                className="cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Image
        src="/Ghumakkad.png"
        width={700}
        height={500}
        alt="Ghumakkads"
        className=" absolute z-10 left-48 top-10 rounded-lg"
      />
    </div>
  );
}
