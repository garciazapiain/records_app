import React from "react";
import Headline from "../components/Headline";
import Button from "../components/Button";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-16 bg-gray-800 text-gray-800">
      <Headline
        title="Welcome to the Record App"
        subtitle="Share your thoughts with ease."
      />
      <main className="w-full max-w-4xl flex flex-col gap-6">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4">
          <Button
            label="Create a New Record"
            href="/records/new"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          />
          <Button
            label="View All Records"
            href="/records"
            className="bg-gray-200 hover:bg-gray-300 text-gray-900"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
