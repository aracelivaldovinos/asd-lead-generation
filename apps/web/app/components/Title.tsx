export default function Title({ title, description }: { title: string; description: string }) {
  return (
    <div className="w-full p-2.5 flex flex-col">
      <h2 className="block text-left uppercase leading-5 mb-2 text-xl font-bold">{title}</h2>
      <h3 className="block text-left leading-5 text-lg font-normal text-site-accent">{description}</h3>
    </div>
  );
}
