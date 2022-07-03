import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "./FormLogin.module.css";

export const FormLogin = () => {
  const initialFormValues = {
    username: "",
    password: "",
  };

  const handleValidate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Se requiere un nombre de usuario";
    }

    if (!values.password) {
      errors.password = "Se requiere una contraseña";
    }
    return errors;
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className={`row col ${styles.formBackground}`}>
      <Formik
        initialValues={initialFormValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="row justify-content-center mb-1">
            <h1 className="col-auto">Cine Center</h1>
          </div>
          {/*<div className="row justify-content-center">
            <p className="col-auto text-center fw-bold">
              Ingresa tus datos de administrador
            </p>
            <hr />
          </div>*/}

          <div className="form-group row mb-3">
            <label htmlFor="username" className="col-12 col-form-label">
              Nombre de usuario:
            </label>
            <div className="col-12">
              <Field
                id="username"
                className="form-control"
                name="username"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
              />
            </div>
            <div className="col-md-10 text-danger">
              <ErrorMessage name="username" />
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

          <div className="form-group row mb-3">
            <div className="col-12">
              <button type="submit" className="btn btn-danger btn-lg w-100">
                Ingresar
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
