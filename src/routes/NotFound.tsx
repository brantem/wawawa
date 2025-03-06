import { Link } from 'react-router';

export default function NotFound({
  title = "Oops! This page doesn't exist",
  back = { url: '/', text: 'Take Me Back' },
}) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-center text-3xl font-semibold text-balance">{title}</h1>
      <Link
        to={back.url}
        className="rounded-full border border-neutral-200 bg-white px-6 py-2 font-semibold text-neutral-950 hover:bg-neutral-100"
      >
        {back.text}
      </Link>
    </div>
  );
}
