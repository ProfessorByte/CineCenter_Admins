import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Header } from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api, { key } from "../services/api";
import { db } from "../services/database";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import styles from "./Home.module.css";

export const Home = () => {
  const [onBillboard, setOnBillboard] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [addTo, setAddTo] = useState("");
  const [someMovieDeleted, setSomeMovieDeleted] = useState(false);
  const { user, logout, loading: loadingUser } = useAuth();
  const navigate = useNavigate();

  const ADD_TO_BILLBOARD = "onBillboard";
  const ADD_TO_COMING_SOON = "comingSoon";

  const initialFormValues = {
    linkTMDB: "",
    linkCinema: "",
  };

  const initialValuesMoviesLists = {
    onBillboardList: [],
    comingSoonList: [],
  };

  useEffect(() => {
    let isActive = true;
    const ac = new AbortController();

    async function getMovies(itemsOnBillboard, itemsComingSoon) {
      const listOnBillboard = await Promise.all(
        itemsOnBillboard.map(
          async (item) =>
            await api.get(`/movie/${item.idTMDB}`, {
              params: {
                api_key: key,
                language: "es-BO",
              },
            })
        )
      );
      const listComingSoon = await Promise.all(
        itemsComingSoon.map(
          async (item) =>
            await api.get(`/movie/${item.idTMDB}`, {
              params: {
                api_key: key,
                language: "es-BO",
              },
            })
        )
      );
      if (isActive) {
        setOnBillboard([]);
        setComingSoon([]);
        listOnBillboard.forEach((movie, index) => {
          setOnBillboard((prev) => [
            ...prev,
            { ...movie.data, linkCinema: itemsOnBillboard[index].linkCinema },
          ]);
        });
        listComingSoon.forEach((movie, index) => {
          setComingSoon((prev) => [
            ...prev,
            { ...movie.data, linkCinema: itemsComingSoon[index].linkCinema },
          ]);
        });
        setLoadingMovies(false);
      }
    }

    const billboardCollectionRef = collection(db, "billboard");
    const billboardQueryRef = query(
      billboardCollectionRef,
      orderBy("priority", "asc")
    );

    const comingSoonCollectionRef = collection(db, "comingSoon");
    const comingSoonQueryRef = query(
      comingSoonCollectionRef,
      orderBy("priority", "asc")
    );

    onSnapshot(billboardQueryRef, (snapshot) => {
      const itemsOnBillboard = snapshot.docs.map((doc) => doc.data());
      onSnapshot(comingSoonQueryRef, (snapshot) => {
        const itemsComingSoon = snapshot.docs.map((doc) => doc.data());
        getMovies(itemsOnBillboard, itemsComingSoon);
      });
    });

    return () => {
      isActive = false;
      ac.abort();
    };
  }, []);

  const exchangePositions = (index1, index2, state, setState) => {
    const newState = [...state];
    const aux = newState[index1];
    newState[index1] = newState[index2];
    newState[index2] = aux;
    setState(newState);
  };

  const reloadPage = () => {
    navigate(0);
  };

  const handleValidate = (values) => {
    const errors = {};
    if (!values.linkTMDB) {
      errors.linkTMDB =
        "Se requiere un link de la película de la página de TMDB";
    } else if (
      !/^(https:\/\/www.themoviedb.org\/movie\/)/.test(values.linkTMDB)
    ) {
      errors.linkTMDB = "El link debe ser de la página de TMDB";
    }

    if (!values.linkCinema) {
      errors.linkCinema =
        "Se requiere un link de la página oficial de Cine Center";
    } else if (
      !/^(https:\/\/cinecenter.com.bo\/#\/pelicula\/)[0-9]+$/.test(
        values.linkCinema
      )
    ) {
      errors.linkCinema = "El link debe ser de Cine Center";
    }
    return errors;
  };

  const handleSubmit = async (values, actions) => {
    const { linkTMDB, linkCinema } = values;
    const idTMDB = linkTMDB.split("/")[4].split("-")[0];

    const getNewMovie = async () => {
      const movie = await api.get(`/movie/${idTMDB}`, {
        params: {
          api_key: key,
          language: "es-BO",
        },
      });
      return movie.data;
    };

    const newMovie = await getNewMovie();

    if (addTo === ADD_TO_BILLBOARD) {
      if (onBillboard.map((item) => item.id).includes(newMovie.id)) {
        alert("La película ya está en la cartelera");
      } else if (onBillboard.length >= 10) {
        alert("La cartelera está llena");
      } else {
        setOnBillboard((prev) => [...prev, { ...newMovie, linkCinema }]);
      }
    }

    if (addTo === ADD_TO_COMING_SOON) {
      if (comingSoon.map((item) => item.id).includes(newMovie.id)) {
        alert("La película ya está entre los próximos estrenos");
      } else if (comingSoon.length >= 10) {
        alert("La lista de próximos estrenos está llena");
      } else {
        setComingSoon((prev) => [...prev, { ...newMovie, linkCinema }]);
      }
    }
    actions.resetForm(initialFormValues);
  };

  const handleDeleteMoviesLists = (values) => {
    setOnBillboard((prev) =>
      prev.filter(
        (item) => !values.onBillboardList.includes(item.id.toString())
      )
    );
    setComingSoon((prev) =>
      prev.filter((item) => !values.comingSoonList.includes(item.id.toString()))
    );
    setSomeMovieDeleted(true);
  };

  if (loadingUser || loadingMovies) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.backgroundColor}>
      <Header user={user} logout={logout} />
      <div className="container">
        <Formik
          initialValues={initialFormValues}
          validate={handleValidate}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          <Form>
            <div className="row justify-content-start mb-1">
              <h1 className="col-auto">Modificar la lista de películas</h1>
            </div>
            <div className="form-group row mb-3">
              <div className="col-md-6 mb-1">
                <Field
                  id="linkTMDB"
                  className="form-control"
                  name="linkTMDB"
                  type="url"
                  placeholder="Link de la película en la página de TMDB"
                />
                <div className={`text-light bg-danger ${styles.errorMessage}`}>
                  <ErrorMessage name="linkTMDB" />
                </div>
              </div>
              <div className="col-md-6 mb-1">
                <Field
                  id="linkCinema"
                  className="form-control"
                  name="linkCinema"
                  type="url"
                  placeholder="Link de la película en la página oficial de Cine Center"
                />
                <div className={`text-light bg-danger ${styles.errorMessage}`}>
                  <ErrorMessage name="linkCinema" />
                </div>
              </div>
            </div>
            <div className="form-group row mb-3 justify-content-end">
              <div className="col-md-auto col-12">
                <button
                  type="submit"
                  className="btn btn btn-success mb-1 col-12"
                  onClick={() => setAddTo(ADD_TO_BILLBOARD)}
                >
                  Agregar a Cartelera
                </button>
              </div>

              <div className="col-md-auto col-12">
                <button
                  type="submit"
                  className="btn btn btn-success mb-1 col-12"
                  onClick={() => setAddTo(ADD_TO_COMING_SOON)}
                >
                  Agregar a Próximos Estrenos
                </button>
              </div>
            </div>
          </Form>
        </Formik>
        <hr />
        <Formik
          initialValues={initialValuesMoviesLists}
          onSubmit={handleDeleteMoviesLists}
          enableReinitialize={true}
        >
          <Form>
            <div className="row ms-auto">
              <div className="col-md-6 col-12 list-group mb-3">
                <div className="list-group-item list-group-item-primary">
                  <h2>Cartelera</h2>
                </div>

                {onBillboard.map((movie, index) => (
                  <label
                    className="col-12 list-group-item list-group-item-primary"
                    key={`onBillboard${movie.id}`}
                  >
                    <div className="row ms-auto d-flex align-items-center">
                      <div className="col-md-8 mb-2">
                        <Field
                          className="form-check-input me-1"
                          type="checkbox"
                          name="onBillboardList"
                          value={movie.id.toString()}
                        />
                        {movie.title}
                      </div>
                      <div className="btn-group col-lg-4 p-1" role="group">
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={index === 0}
                          onClick={() =>
                            exchangePositions(
                              index,
                              index - 1,
                              onBillboard,
                              setOnBillboard
                            )
                          }
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={index === onBillboard.length - 1}
                          onClick={() =>
                            exchangePositions(
                              index,
                              index + 1,
                              onBillboard,
                              setOnBillboard
                            )
                          }
                        >
                          Bajar
                        </button>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="col-md-6 col-12 list-group mb-3">
                <div className="list-group-item list-group-item-primary">
                  <h2>Próximos Estrenos</h2>
                </div>

                {comingSoon.map((movie, index) => (
                  <label
                    className="col-12 list-group-item list-group-item-primary"
                    key={`comingSoon${movie.id}`}
                  >
                    <div className="row ms-auto d-flex align-items-center">
                      <div className="col-md-8 mb-2">
                        <Field
                          className="form-check-input me-1"
                          type="checkbox"
                          name="comingSoonList"
                          value={movie.id.toString()}
                        />
                        {movie.title}
                      </div>
                      <div className="btn-group col-lg-4 p-1" role="group">
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={index === 0}
                          onClick={() =>
                            exchangePositions(
                              index,
                              index - 1,
                              comingSoon,
                              setComingSoon
                            )
                          }
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={index === comingSoon.length - 1}
                          onClick={() =>
                            exchangePositions(
                              index,
                              index + 1,
                              comingSoon,
                              setComingSoon
                            )
                          }
                        >
                          Bajar
                        </button>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="row justify-content-end ms-auto">
              {someMovieDeleted && (
                <div className="col-md-auto col-12 mb-3">
                  <button
                    type="button"
                    className="btn btn-warning col-12"
                    onClick={reloadPage}
                  >
                    Deshacer las eliminaciones
                  </button>
                </div>
              )}
              <div className="col-md-auto col-12 mb-3">
                <button type="submit" className="btn btn-danger col-12">
                  Borrar películas seleccionadas
                </button>
              </div>
              <div className="col-md-auto col-12 mb-3">
                <button type="button" className="btn btn-success col-12">
                  Enviar todas las películas al servidor
                </button>
              </div>
            </div>
          </Form>
        </Formik>
        <div className="row"></div>
      </div>
    </div>
  );
};
