import Image from "next/image";

export default function HeroImage({ src }: { src: string }) {
  return (
    <div className="w-full">
      <Image
        src={src}
        alt="hero"
        width={960}
        height={500}
        sizes="100vw"
        priority
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
