export default function Dashboard({ cars }) {
  const availableCars = cars.filter(
    (car) => car.status === 'Available'
  ).length;

  const maintenanceCars = cars.filter(
    (car) => car.status === 'Under Maintenance'
  ).length;

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <img
          className="dashboard-hero-image"
          src="public/images/dashboared.png"
          alt=""
        />

        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">COMPANY CAR MANAGER</span>
          <h1>Dashboard</h1>
          <p>Your fleet, at a glance.</p>
          <span className="dashboard-hero-description">
            Keep track of your cars, their availability, and maintenance
            in one place.
          </span>
        </div>
      </div>

      <div className="dashboard-summary-heading">
        <h2>Fleet overview</h2>
        <p>Updated as you manage your cars.</p>
      </div>

      <div className="dashboard-stats">
        <article>
          <h2>Total Cars</h2>
          <p>{cars.length}</p>
        </article>

        <article>
          <h2>Available Cars</h2>
          <p>{availableCars}</p>
        </article>

        <article>
          <h2>Under Maintenance</h2>
          <p>{maintenanceCars}</p>
        </article>
      </div>
    </section>
  );
}