import { MovieCardSkeleton } from "./MovieCard";

interface MovieCardTicketSkeletonDecoratorProps {
  className?: string;
}

export default function MovieCardTicketSkeletonDecorator({
  className = "",
}: MovieCardTicketSkeletonDecoratorProps) {
  return (
    <MovieCardSkeleton
      className={className}
      footer={<div className="mt-6 h-11 w-full rounded-4xl bg-gray-200 md:max-w-40" />}
    />
  );
}