import React from 'react';
import { Layers, Database, Server, Code, Lock } from 'lucide-react';

export function TechStackPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h1>
        <p className="text-lg text-gray-600 mb-8">
          This application follows a modern, full-stack architecture with a unified Express server backing a React frontend, strictly typed and optimized for scalability and rapid iterations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Frontend */}
          <div className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg h-fit">
              <Code size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Frontend Options</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium text-gray-900">Framework:</span> React 18+ (Vite)</li>
                <li><span className="font-medium text-gray-900">Language:</span> TypeScript</li>
                <li><span className="font-medium text-gray-900">Styling:</span> Tailwind CSS</li>
                <li><span className="font-medium text-gray-900">Icons:</span> Lucide React</li>
                <li><span className="font-medium text-gray-900">Data Fetching:</span> TanStack React Query</li>
              </ul>
            </div>
          </div>

          {/* Backend */}
          <div className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg h-fit">
              <Server size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Backend Architecture</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium text-gray-900">Runtime:</span> Node.js 22 (tsx)</li>
                <li><span className="font-medium text-gray-900">Framework:</span> Express.js</li>
                <li><span className="font-medium text-gray-900">API Standard:</span> REST API</li>
                <li><span className="font-medium text-gray-900">Validation:</span> Zod (Schema parsing)</li>
                <li><span className="font-medium text-gray-900">Static Serving:</span> Express static middleware</li>
              </ul>
            </div>
          </div>

          {/* AI Services */}
          <div className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg h-fit">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Integration</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><span className="font-medium text-gray-900">Provider:</span> Google Gemini AI</li>
                <li><span className="font-medium text-gray-900">SDK:</span> @google/genai</li>
                <li><span className="font-medium text-gray-900">Safety:</span> Isolated server-side keys</li>
                <li><span className="font-medium text-gray-900">Format:</span> Structured JSON schema enforcing</li>
              </ul>
            </div>
          </div>

          {/* Database Recommendation */}
          <div className="flex gap-4 p-6 bg-orange-50 rounded-xl border border-orange-100">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg h-fit">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Database Recommendation</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                For a system handling analytics, structured schemas, CRM relationships, and high-velocity reads/writes, we recommend using a <strong>Relational Database</strong>.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li>👉 <strong>PostgreSQL</strong> (Highly Recommended)</li>
                <li>👉 <strong>Neon</strong> or <strong>Supabase</strong> (for Serverless/Cloud Postgres)</li>
                <li>Used with an ORM like <strong>Prisma</strong> or <strong>Drizzle</strong> to maintain full-stack type safety alongside Zod.</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-500" />
            Security & Isolation Principles
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Security is treated as a first-class citizen inside the architectural pattern. The system heavily guards third-party integrations and ensures isolated data flow:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li><strong>AI Key Isolation:</strong> The Gemini SDK is intentionally restricted to the Express server inside <code>/src/server</code>. The React client has no awareness of the SDK or the API key.</li>
            <li><strong>Type Safety:</strong> Frontend and backend share isolated types found in <code>/src/types/api.ts</code>. Request validation occurs on the server side using Zod, ensuring malformed payloads cannot crash backend processing.</li>
            <li><strong>Single Entry Point:</strong> The production build merges Vite's static output inside standard Express routing, streamlining deployment containers and circumventing complex proxy configurations.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
