import AuthForm from '../../components/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-primary">
            The Habit Hero
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Level up your life by building better habits
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
