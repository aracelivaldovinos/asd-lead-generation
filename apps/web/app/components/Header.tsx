import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/app/lib/site-config";

export default async function Header() {
  const config = await getSiteConfig();
  const { headerLogo } = config.page;

  const isFunnel = config.type === "funnel";

  return (
    <div className={`w-full ${isFunnel ? "h-9 bg-site-dark" : "h-16 bg-white"}`}>
      <div className={`w-full h-full flex items-center ${isFunnel ? "max-w-5xl mx-auto pl-2" : "pl-4 md:pl-16"}`}>
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
