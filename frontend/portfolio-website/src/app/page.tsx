import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Name</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">Frontend Developer</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition"
            >
              Contact Me
            </Link>
          </div>
        </section>

        {/* Preview of Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Project {i}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Short description of what this project does and the tech used.
                </p>
                <Link href="/projects" className="text-blue-600 text-sm font-medium">
                  See details →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}