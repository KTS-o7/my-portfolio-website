// components/Projects.js

export default function Projects() {
  const projects = [
    { id: 1, name: 'Project 1', description: 'This is a brief description of Project 1.', image: '/vercel.svg', github: 'https://github.com/yourusername/project1' },
    { id: 2, name: 'Project 2', description: 'This is a brief description of Project 2.', image: '/next.svg', github: 'https://github.com/yourusername/project2' },
    // Add more projects as needed
  ];

  return (
    <section id="projects" className="py-12 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <h2 className="text-4xl mb-8 text-center font-semibold">Projects</h2>
      <div className="flex flex-wrap -mx-4">
        {projects.map(project => (
          <a key={project.id} href={project.github} target="_blank" rel="noopener noreferrer" className="md:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="rounded shadow p-6 hover:shadow-lg transition-shadow duration-200 ease-in bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300">
              <img src={project.image} alt={project.name} className="w-full h-64 object-cover mb-6 rounded" />
              <h3 className="text-xl mb-4 font-semibold">{project.name}</h3>
              <p className="text-white">{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}