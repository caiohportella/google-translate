import getBaseUrl from "@/lib/getBaseUrl";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { userId } = auth();

  return (
    <header className="flex items-center justify-between px-8 border-b mb-5">
      <div className="flex items-center justify-center overflow-hidden h-20">
        <Link href={"/"}>
          <Image
            src={"https://links.papareact.com/xgu"}
            alt="logo"
            width={200}
            height={100}
            className="object-contain h-32 cursor-pointer"
          />
        </Link>
      </div>

      {userId ? (
        <div>
          <UserButton />
        </div>
      ) : (
        <SignInButton
          afterSignInUrl={`${getBaseUrl()}/translate`}
          mode="modal"
        />
      )}
    </header>
  );
};

export default Header;
