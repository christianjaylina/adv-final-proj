import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="w-full px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <Link
          className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
          href="/"
        >
          TodoList
        </Link>
        <nav className="ml-auto flex gap-6 text-sm font-medium">
          <Link
            className="hover:text-indigo-500 dark:hover:text-indigo-300"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="hover:text-indigo-500 dark:hover:text-indigo-300"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="hover:text-indigo-500 dark:hover:text-indigo-300"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-100 mb-6">
              Organize Your Life, the Simple Way
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
              TodoList helps you take control of your day with effortless task
              management and comfort-focused design.
            </p>
            <div className="space-x-4">
              <Link
                href="/signin"
                className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 border border-indigo-500 text-indigo-500 font-medium rounded-lg shadow-lg hover:bg-indigo-100"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Easy Task Management"
                description="Add, edit, and track your tasks effortlessly."
              />
              <FeatureCard
                title="Custom Priorities"
                description="Set what’s most important with just a click."
              />
              <FeatureCard
                title="Deadline Alerts"
                description="Stay ahead with timely notifications."
              />
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-16 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4">
              <li className="text-lg">Sign up for an account.</li>
              <li className="text-lg">Create your first task list.</li>
              <li className="text-lg">Start managing your day efficiently!</li>
            </ol>
          </div>
        </section>

        <section id="pricing" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price="Free"
                features={[
                  "Up to 3 task lists",
                  "Basic task management",
                  "Web access",
                ]}
              />
              <PricingCard
                title="Pro"
                price="$9.99/mo"
                features={[
                  "Unlimited task lists",
                  "Priority settings",
                  "Web & mobile access",
                ]}
              />
              <PricingCard
                title="Team"
                price="$29.99/mo"
                features={[
                  "Everything in Pro",
                  "Team collaboration",
                  "Admin controls",
                ]}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 TodoList. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="#">
              Terms of Service
            </Link>
            <Link className="hover:underline" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function PricingCard({ title, price, features }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-4">{price}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-600 mt-auto"
        href="/signup"
      >
        Get Started
      </Link>
    </div>
  );
}
