import Image from "next/image";
import Link from "next/link";
import { Quote } from "@/app/lib/site-config";

export default function Quotes({ quotes }: { quotes: Quote[] }) {
  if (!quotes.length) return null;

  return (
    <div className="flex flex-col md:flex-row md:space-x-10">
      {quotes.map((quote, index) => (
        <div key={index} className="flex-1">
          <div>
            {quote.badge && (
              <div className="float-left pr-3">
                <Image src={quote.badge} alt="badge" width={112} height={109} />
              </div>
            )}
            <em>{quote.text}</em>
            <div className="text-right text-sm py-3">
              -{" "}
              <Link className="hover:underline" href={quote.url} target="_blank">
                {quote.link}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
