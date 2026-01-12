export default function Contact() {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Contact</h1>
        <p className="max-w-2xl">
          Email me at: <strong>your.email@example.com</strong>
        </p>
        <p className="mt-4">
          Or connect on{" "}
          <a href="https://linkedin.com/in/yourprofile" className="text-blue-600 underline">
            LinkedIn
          </a>{" "}
          and{" "}
          <a href="https://github.com/yourname" className="text-blue-600 underline">
            GitHub
          </a>.
        </p>
        {/* <!-- BE-ready --> Future form goes here */}
      </div>
    );
  }