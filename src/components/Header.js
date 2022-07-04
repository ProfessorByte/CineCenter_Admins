import styles from "./Header.module.css";
import logo_cinecenter from "../assets/img/logo_cinecenter.png";

export const Header = ({ user, logout }) => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a
          className="navbar-brand"
          href="https://cinecenter.com.bo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logo_cinecenter}
            alt="Logo del Cine Center"
            className={styles.logoImg}
          />
        </a>
        <button
          type="button"
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#userDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="userDropdown" className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TMDB
              </a>
            </li>
            {/*<li className="nav-item">
                <a href="#" className="nav-link">
                  Profile
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Messages
                </a>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    Inbox
                  </a>
                  <a href="#" className="dropdown-item">
                    Drafts
                  </a>
                  <a href="#" className="dropdown-item">
                    Sent Items
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item">
                    Trash
                  </a>
                </div>
              </li>*/}
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.email}
              </button>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                <button
                  className="dropdown-item"
                  onClick={() =>
                    alert("Página de configuraciones en desarrollo")
                  }
                >
                  Configuraciones
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
