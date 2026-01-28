import { projects } from '@/content/projects.json';
import Link from 'next/link';

// Text Color Configuration - Modify these values to change text colors
const TEXT_COLORS = {
  pageTitle: '#F0F0F0',        // Main "Projects" heading color
  projectTitle: '#F0F0F0',     // Individual project title color
  description: '#F0F0F0',       // Project description text color
  techTagText: '#F0F0F0',      // Technology tag text color
  techTagBackground: '#000000', // Technology tag background color
  detailsButtonText: '#F0F0F0', // Details button text color
  detailsButtonBackground: '#2563EB', // Details button background color
};

export default function Projects() {
  // Sort projects
  const sortedProjects = projects
    .slice()
    .sort((a, b) => {
      // Extract number from ID format "PJ-{i}"
      const getProjectNumber = (id: string): number => {
        const match = id.match(/PJ-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getProjectNumber(a.id) - getProjectNumber(b.id);
    });

  const isOddCount = sortedProjects.length % 2 !== 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: TEXT_COLORS.pageTitle }}>Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {sortedProjects.map((project, index) => {
            const isLastItem = index === sortedProjects.length - 1;
            const shouldCenter = isLastItem && isOddCount;
            
            return (
              <div 
                key={project.id} 
                className={`border border-gray-200 rounded-lg p-6 hover:shadow-md transition w-full ${
                  shouldCenter ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''
                }`}
              >
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

                <Link href={`/projects/${project.id}`}>
                  <button
                    className="px-4 py-2 text-sm font-medium rounded hover:opacity-90 transition"
                    style={{ 
                      color: TEXT_COLORS.detailsButtonText,
                      backgroundColor: TEXT_COLORS.detailsButtonBackground
                    }}
                  >
                    Details
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}