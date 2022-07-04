import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
