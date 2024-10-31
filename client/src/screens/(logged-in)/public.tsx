import { Fragment } from "react/jsx-runtime";
import image from "../../assets/firstImage.svg";

export function Public() {
  return (
    <Fragment>
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center mt-6">
          Registro de Propriedades - Dados Públicos
        </h1>
        <div className="border rounded-lg p-2">
          <p className="text-center mt-10 text-muted-foreground">
            nenhuma informação pública disponível no momento
          </p>
          <br />
          <img
            src={image}
            alt="treee_image"
            className="max-w-40 ml-auto mr-auto"
          />
        </div>
      </div>
    </Fragment>
  );
}
