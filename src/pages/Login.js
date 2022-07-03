import { FormLogin } from "../components/FormLogin";
import styles from "./Login.module.css";

export const Login = () => {
  return (
    <div className={styles.backgroundColor}>
      <div className="container">
        <div
          className={`row d-flex justify-content-center ${styles.formHeight}`}
        >
          <div className="col-md-5 d-flex align-content-center flex-wrap">
            <FormLogin />
          </div>
        </div>
      </div>
    </div>
  );
};
