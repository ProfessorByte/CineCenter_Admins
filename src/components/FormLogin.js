import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./FormLogin.module.css";

export const FormLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [currentError, setCurrentError] = useState("");

  const initialFormValues = {
    email: "",
    password: "",
  };

  const handleValidate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Se requiere un correo electrónico";
    } else if (
      !/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
        values.email
      )
    ) {
      errors.email = "El correo electrónico no es válido";
    }

    if (!values.password) {
      errors.password = "Se requiere una contraseña";
    }
    return errors;
  };

  const handleSubmit = async (values, actions) => {
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setCurrentError("El correo electrónico no existe");
      } else if (error.code === "auth/wrong-password") {
        setCurrentError("La contraseña no es correcta");
      } else {
        setCurrentError("Error desconocido");
      }
    }
    actions.resetForm(initialFormValues);
  };

  return (
    <div className={`row col ${styles.formBackground}`}>
      <Formik
        initialValues={initialFormValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        <Form>
          <div className="row justify-content-center mb-1">
            <h1 className="col-auto">Cine Center</h1>
          </div>
          <div className="row justify-content-center">
            {currentError !== "" && (
              <p className="col-auto text-center text-danger fw-bold">
                {currentError}
              </p>
            )}
            <hr />
          </div>

          <div className="form-group row mb-3">
            <label htmlFor="email" className="col-12 col-form-label">
              Correo electrónico:
            </label>
            <div className="col-12">
              <Field
                id="email"
                className="form-control"
                name="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>
            <div className="col-md-10 text-danger">
              <ErrorMessage name="email" />
            </div>
          </div>

          <div className="form-group row mb-3">
            <label htmlFor="password" className="col-12 col-form-label">
              Contraseña:
            </label>
            <div className="col-12">
              <Field
                id="password"
                className="form-control"
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
              />
            </div>
            <div className="col-md-10 text-danger">
              <ErrorMessage name="password" />
            </div>
          </div>

          <div className="form-group row mb-3 mt-4">
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-danger btn-lg w-100"
                onClick={() => setCurrentError("")}
              >
                Ingresar
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
