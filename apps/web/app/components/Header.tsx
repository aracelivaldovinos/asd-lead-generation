import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/app/lib/site-config";

export default async function Header() {
  const config = await getSiteConfig();
  const { headerLogo } = config.page;

  return (
    <div className="w-full h-9 bg-site-dark">
      <div className="w-full h-full max-w-5xl mx-auto pl-2 flex items-center">
        <Link href="/">
          <Image
            src={headerLogo.src}
            alt={config.name}
            width={headerLogo.width}
            height={headerLogo.height}
            priority
          />
        </Link>
      </div>
    </div>
  );
}
