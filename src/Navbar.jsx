
export default function Navbar({ setCurrentPage }) { {
  return (
    <nav className="navbar">
      <h2>Car Management System</h2>

      <div className="nav-links">
        <button onClick={() => setCurrentPage("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setCurrentPage("cars")}>
          Car Management
        </button>

        <button onClick={() => setCurrentPage("about")}>
          About
        </button>
      </div>
    </nav>
  );
}
}