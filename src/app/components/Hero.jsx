export default function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
      <p className="text-xl mx-auto max-w-2xl">
        I'm a web developer with a passion for coding and problem-solving.
      </p>
      <div className="mt-8">
        <a href="#contact" className="bg-white text-blue-500 py-2 px-4 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition duration-300">
          Contact Me
        </a>
      </div>
    </section>
  );
}
