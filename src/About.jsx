export default function About() {
  return (
    <section>
      <h1>About the Project</h1>

      <p>
        Company Car Manager is an academic project developed for
        SE411. It demonstrates a React frontend for managing
        a company’s car assets.
      </p>

      <h2>Project Purpose</h2>
      <p>
        The application allows users to add, view, edit, and delete
        car records. Users can search and filter cars, switch between
        card and table views, and check fleet statistics on the Dashboard.
      </p>

      <h2>Project Scope</h2>
      <p>
        This phase focuses on the frontend. Car records are stored as
        JavaScript objects in React state, so changes reset when the
        page is refreshed. Backend development is planned for Part 2.
      </p>

      <h2>Development and Testing</h2>
      <p>
        The project uses React, Vite, and CSS. AI tools assisted with
        code generation, interface design, and automated tests.
        Tests use Vitest and React Testing Library.
      </p>

      <h2>Our Team</h2>
      <ul>
        <li>Roaa Hamdan — 222410471</li>
        <li>Reema Alnamazi — 221511324</li>
        <li>Renad Al Zahrani — 221410628</li>
      </ul>
    </section>
  );
}