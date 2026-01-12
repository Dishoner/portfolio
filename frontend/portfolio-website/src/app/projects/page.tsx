import { projects } from '@/content/projects.json';

export default function Projects() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 text-sm font-medium hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}