
export default function Dashboard({ cars }) {
  const totalCars = cars.length;

  const availableCars = cars.filter(
    (car) => car.status === "Available"
  ).length;

  const maintenanceCars = cars.filter(
    (car) => car.status === "Under Maintenance"
  ).length;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Overview of company cars</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Total Cars</h2>
          <p>{totalCars}</p>
        </div>

        <div className="dashboard-card">
          <h2>Available Cars</h2>
          <p>{availableCars}</p>
        </div>

        <div className="dashboard-card">
          <h2>Under Maintenance</h2>
          <p>{maintenanceCars}</p>
        </div>
      </div>
    </div>
  );
}
