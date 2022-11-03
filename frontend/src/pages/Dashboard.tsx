import { TableMovies, TableUsers } from "../components";

const Dashboard = () => {
  return (
    <main className="pageContainer">
      <TableUsers />
      <TableMovies />
    </main>
  );
};

export default Dashboard;
