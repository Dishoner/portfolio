import { projects } from '@/content/projects.json';

// Text Color Configuration - Modify these values to change text colors
const TEXT_COLORS = {
  pageTitle: '#F0F0F0',        // Main "Projects" heading color
  projectTitle: '#F0F0F0',     // Individual project title color
  description: '#F0F0F0',       // Project description text color
  techTagText: '#F0F0F0',      // Technology tag text color
  techTagBackground: '#000000', // Technology tag background color
  liveDemoLink: '#2563EB',     // Live Demo link color
  githubLink: '#F0F0F0',       // GitHub link color
};

export default function Projects() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: TEXT_COLORS.pageTitle }}>Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {projects
            .slice()
            .sort((a, b) => {
              // Extract number from ID format "PJ-{i}"
              const getProjectNumber = (id: string): number => {
                const match = id.match(/PJ-(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
              };
              return getProjectNumber(a.id) - getProjectNumber(b.id);
            })
            .map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition w-full">
            <h2 className="text-xl font-semibold mb-2" style={{ color: TEXT_COLORS.projectTitle }}>{project.title}</h2>
            <p className="text-sm mb-4" style={{ color: TEXT_COLORS.description }}>{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-1 text-xs rounded"
                  style={{ 
                    color: TEXT_COLORS.techTagText,
                    backgroundColor: TEXT_COLORS.techTagBackground
                  }}
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
                  className="text-sm font-medium hover:underline"
                  style={{ color: TEXT_COLORS.liveDemoLink }}
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline"
                  style={{ color: TEXT_COLORS.githubLink }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}