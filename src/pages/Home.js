import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import styles from "./Home.module.css";

export const Home = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.backgroundColor}>
      <Header user={user} logout={logout} />
      <div className="container">
        <div className="row">Hola</div>
      </div>
    </div>
  );
};
