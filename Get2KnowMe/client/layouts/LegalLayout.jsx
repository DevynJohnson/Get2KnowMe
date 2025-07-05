import React from 'react';
import { Link } from 'react-router-dom';

const LegalLayout = ({ title, children }) => {
  return (
    <main className="min-h-screen bg-white text-gray-800 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <div className="text-sm text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <article className="prose prose-lg">{children}</article>
      </div>
    </main>
  );
};

export default LegalLayout;
// This component provides a consistent layout for legal pages like Privacy Policy and Terms of Service