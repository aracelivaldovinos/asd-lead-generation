import Link from "next/link";
import Image from "next/image";
import { Subject } from "@/app/lib/site-config";

interface SubjectAreaGridProps {
  subjects: Subject[];
  existingParams: Record<string, string>;
}

export default function SubjectAreaGrid({ subjects, existingParams }: SubjectAreaGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 w-full items-stretch">
      {subjects.map((subject) => {
        const params = new URLSearchParams({ ...existingParams, marketContext: subject.marketContext });
        return (
          <Link
            key={subject.marketContext}
            href={`/school-programs?${params.toString()}`}
            prefetch={false}
            className="flex md:flex-col items-center p-4 md:border border-gray-300 rounded hover:bg-gray-100"
          >
            <Image
              src={subject.icon}
              alt={subject.title}
              width={80}
              height={80}
              className="p-2 shrink-0"
            />
            <div className="flex flex-col w-full">
              <h4 className="md:text-center text-xl font-bold py-2 w-full">{subject.title}</h4>
              <p className="md:text-center text-sm md:pb-8 w-full">{subject.description}</p>
            </div>
            <div className="md:hidden shrink-0">
              <Image src="/acols/chevron-right.svg" alt="" width={20} height={20} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
