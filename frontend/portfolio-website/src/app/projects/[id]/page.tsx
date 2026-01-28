import { projects } from '@/content/projects.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectImage from './ProjectImage';
import BackendProjectCard from './BackendProjectCard';

// Text Color Configuration - Modify these values to change text colors
const TEXT_COLORS = {
  pageTitle: '#F0F0F0',        // Main project title color
  description: '#F0F0F0',       // Project description text color
  shortDescription: '#F0F0F0',  // Short description text color
  techTagText: '#F0F0F0',      // Technology tag text color
  techTagBackground: '#000000', // Technology tag background color
  backButtonText: '#F0F0F0',    // Back button text color
  backButtonBackground: '#2563EB', // Back button background color
  projectPreviewText: '#F0F0F0', // Project preview text color
};

// Backend Project Card Configuration
const BACKEND_CARD_TEXT_CONFIG = {
  // Text Configuration
  color: '#F0F0F0',              // Text color
  fontSize: 'text-xl',           // Text size (Tailwind classes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, etc.)
  fontWeight: 'font-bold',       // Font weight (font-light, font-normal, font-medium, font-semibold, font-bold)
  textAlign: 'text-center',      // Text alignment (text-left, text-center, text-right)
  padding: 'px-8 py-6',          // Padding around text (Tailwind padding classes)
  backgroundOpacity: 0.1,        // Background blur circle opacity (0-1)
  
  // Background and Gradient Configuration
  backgroundColor: '#0A0A0A',     // Card background color (default: gray-900)
  gradientFrom: '#8B5CF6',        // Gradient start color (default: green-500)
  gradientTo: '#EC4899',          // Gradient end color (default: blue-700)
  gradientRadius: 150,            // Radius of the hover circle in pixels (default: 250px)
  gradientBrightness: 0.8,         // Brightness/opacity of the hover gradient (0-1, default: 1.0 = 100%)
};

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Await params before accessing properties (Next.js 16+ requirement)
  const { id } = await params;
  
  // Find the project by ID
  const project = projects.find((p) => p.id === id);

  // If project not found, show 404
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/projects"
          className="inline-block mb-8"
        >
          <button
            className="px-4 py-2 text-sm font-medium rounded hover:opacity-90 transition"
            style={{ 
              color: TEXT_COLORS.backButtonText,
              backgroundColor: TEXT_COLORS.backButtonBackground
            }}
          >
            ← Back to Projects
          </button>
        </Link>

        {/* Project Title */}
        <h1 
          className="text-4xl font-bold mb-6" 
          style={{ color: TEXT_COLORS.pageTitle }}
        >
          {project.title}
        </h1>

        {/* Project Image */}
        {(() => {
          // Check if project has images array with content
          const imagesArray = (project as any).images;
          const hasImagesArray = imagesArray && Array.isArray(imagesArray) && imagesArray.length > 0;
          
          // Check if project has single image field with content
          const singleImage = (project as any).image;
          const hasSingleImage = singleImage && typeof singleImage === 'string' && singleImage.trim() !== '';
          
          // Show images if either exists, otherwise show BackendProjectCard
          if (hasImagesArray || hasSingleImage) {
            return (
              <div className="mb-6">
                <ProjectImage 
                  images={hasImagesArray ? imagesArray : [singleImage]}
                  alt="Project preview"
                  previewTextColor={TEXT_COLORS.projectPreviewText}
                />
              </div>
            );
          } else {
            return (
              <div className="mb-6">
                <BackendProjectCard 
                  text={project.id === 'PJ-2' 
                    ? "This was a backend project, so there is nothing to show :)" 
                    : "Project preview not available"}
                  textConfig={BACKEND_CARD_TEXT_CONFIG}
                />
              </div>
            );
          }
        })()}

        {/* Short Description */}
        {project.ShortDiscription && (
          <p 
            className="text-lg mb-6" 
            style={{ color: TEXT_COLORS.shortDescription }}
          >
            {project.ShortDiscription}
          </p>
        )}

        {/* Full Description */}
        <div className="mb-6">
          <h2 
            className="text-2xl font-semibold mb-4" 
            style={{ color: TEXT_COLORS.pageTitle }}
          >
            About
          </h2>
          <p 
            className="text-base leading-relaxed" 
            style={{ color: TEXT_COLORS.description }}
          >
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h2 
            className="text-2xl font-semibold mb-4" 
            style={{ color: TEXT_COLORS.pageTitle }}
          >
            Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1.5 text-sm rounded"
                style={{ 
                  color: TEXT_COLORS.techTagText,
                  backgroundColor: TEXT_COLORS.techTagBackground
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Demo Notes */}
        {(project.id === 'PJ-1' || project.id === 'PJ-2' || project.id === 'PJ-3' || project.id === 'PJ-4') && (
          <div className="mb-6">
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                borderColor: '#666',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <p 
                className="text-base italic"
                style={{ color: TEXT_COLORS.description }}
              >
                {project.id === 'PJ-1' || project.id === 'PJ-2' 
                  ? 'Note: Demo for this project is not available because it comes under NDA (Non-Disclosure Agreement).'
                  : 'Note: Project demo is not available because it costs a lot to host such projects.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
