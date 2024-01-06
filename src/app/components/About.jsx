export default function About() {
  return (
    <section
      id="about"
      className="py-12 px-4 text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
    >
      <h2 className="text-4xl mb-4 font-semibold">About Me</h2>
      <p className="text-xl mx-auto max-w-2xl">
        I'm a web developer with a passion for coding and problem-solving. I
        specialize in building high-quality websites and applications using
        modern technologies like React, Node.js, and Next.js.
      </p>
      <div className="mt-8">
        <a
          href="#contact"
          className="bg-white text-blue-500 py-2 px-4 rounded shadow-lg hover:bg-blue-500 hover:text-white transition duration-300"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
