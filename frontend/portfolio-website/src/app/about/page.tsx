import { type FC } from 'react';

// Import the entire JSON object
import skillsData from '@/content/skills.json';

export default function About() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">About Me</h1>
      
      <p className="max-w-2xl text-gray-700 mb-12">
        I'm a frontend developer passionate about building fast, accessible, and user-friendly web applications.
        When I'm not coding, you'll find me [add personal touch].
      </p>

      {/* Skills Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="space-y-6">
          {Object.entries(skillsData).map(([category, skills]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {(skills as string[]).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}