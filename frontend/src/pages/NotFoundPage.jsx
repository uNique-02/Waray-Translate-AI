const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-center">
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-300 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-lg shadow hover:shadow-lg transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
