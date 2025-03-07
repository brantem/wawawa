import { Link } from 'react-router';

export default function NotFoundSection({
  title = "Oops! This page doesn't exist",
  description = '',
  back = { url: '/', text: 'Take Me Back' },
}) {
  return (
    <div className="mx-auto flex size-full flex-col items-center justify-center gap-4 p-4">
      <div>
        <h1 className="text-center text-2xl font-semibold text-balance md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-center text-neutral-500">{description}</p> : null}
      </div>
      <Link
        to={back.url}
        className="rounded-full border border-neutral-200 bg-white px-6 py-2 font-semibold text-neutral-950 hover:bg-neutral-100"
      >
        {back.text}
      </Link>
    </div>
  );
}
