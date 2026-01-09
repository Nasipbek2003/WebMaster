import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-8xl md:text-9xl font-bold gradient-text mb-4">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Страница не найдена</p>
        <p className="text-gray-500 mb-8">К сожалению, запрашиваемая страница не существует</p>
      </div>
      <Link
        href="/"
        className="inline-block btn-primary"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}

