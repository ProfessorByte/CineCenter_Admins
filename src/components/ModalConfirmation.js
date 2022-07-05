import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../services/database";
import styles from "./ModalConfirmation.module.css";

export const ModalConfirmation = ({
  idModalConfirm,
  onBillboard,
  comingSoon,
}) => {
  const sendDataToServer = async () => {
    try {
      const deleteAll = async (collectionName) => {
        const billboardCollectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(billboardCollectionRef);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      };

      await deleteAll("billboard");
      await deleteAll("comingSoon");
      onBillboard.forEach(async (movie, index) => {
        await addDoc(collection(db, "billboard"), {
          idTMDB: movie.id,
          linkCinema: movie.linkCinema,
          priority: index,
        });
      });
      comingSoon.forEach(async (movie, index) => {
        await addDoc(collection(db, "comingSoon"), {
          idTMDB: movie.id,
          linkCinema: movie.linkCinema,
          priority: index,
        });
      });
      alert("Envío de datos realizado con éxtito");
    } catch (error) {
      alert("Error al enviar los datos");
    }
  };

  return (
    <div
      className="modal fade"
      id={idModalConfirm}
      tabIndex={-1}
      aria-hidden={true}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header ${styles.modalBackgroundDark}`}>
            <h5 className="modal-title">Envío de datos al servidor</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className={`modal-body ${styles.modalBackgroundDark}`}>
            <p>¿Confirma que desea enviar los datos al servidor?</p>
            <p>
              Recuerde que esta acción se reflejará inmediatamente en todos los
              dispositios móviles que tengan instalada la aplicación CenterApp.
            </p>
          </div>
          <div
            className={`modal-footer ${styles.modalBackgroundDark}`}
            style={{ backgroundColor: "#212529" }}
          >
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={() => sendDataToServer()}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
