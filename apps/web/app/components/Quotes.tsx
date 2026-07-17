import Image from "next/image";
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
            {quote.html ? (
              <div dangerouslySetInnerHTML={{ __html: quote.html }} />
            ) : (
              <>
                <em>{quote.text}</em>
                {quote.link && quote.url && (
                  <div className="text-right text-sm py-3">
                    -{" "}
                    <a href={quote.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-site-accent">
                      {quote.link}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
