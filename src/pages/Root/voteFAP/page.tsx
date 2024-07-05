export default function Page() {
  return (
    <>
      투표 화면
      <ul className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <li key={index} className="aspect-[3/4] w-full rounded-lg bg-gray-100" />
        ))}
      </ul>
    </>
  );
}
