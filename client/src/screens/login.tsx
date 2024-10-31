import { Fragment, useState } from "react";
import axios from "axios";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Input de imagem
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Funcao para envio de formulario ao backend
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   if (!file) {
  //     toast({
  //       title: "Selecione uma imagem",
  //       description: "selecione uma imagem para acessar o sistema.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/upload",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     toast({
  //       title: "Imagem enviada com sucesso",
  //       description: "Aguarde um momento para realizar seu login",
  //       variant: "success",
  //     });
  //     navigate("/dashboard");
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     toast({
  //       title: "Erro no envio da imagem",
  //       description:
  //         "Ocorreu um erro no envio da imagem, por favor tente novamente",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast({
        title: "Selecione uma imagem",
        description: "Selecione uma imagem para acessar o sistema.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/identify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { access_level } = response.data;

      // Show success toast
      toast({
        title: "Imagem enviada com sucesso",
        description: "Aguarde um momento para realizar seu login.",
        variant: "success",
      });

      // Redirect based on access level
      if (access_level === 3) {
        navigate("/dashboard");
      } else if (access_level === 2) {
        navigate("/admin");
      } else if (access_level === 1) {
        navigate("/public");
      } else {
        toast({
          title: "Nível de acesso não reconhecido",
          description: "Nenhum nível de acesso correspondente encontrado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error identifying user:", error);
      toast({
        title: "Erro no envio da imagem",
        description:
          "Ocorreu um erro no envio da imagem, por favor tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Fragment>
      <div className="flex h-screen w-full items-center justify-center bg-zinc-200">
        <div className="w-full max-w-md bg-slate-300 shadow rounded-lg p-8">
          <Card className="w-full max-w-md">
            <CardHeader className="flex items-center justify-center text-center">
              <CardTitle className="text-2xl font-bold tracking-tighter">
                Ministerio do meio-ambiente
              </CardTitle>
              <CardDescription className="text-sm">
                Selecione sua imagem para acessar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <form onSubmit={handleSubmit} className="mt-2">
                  <Label htmlFor="send-img">Selecionar imagem para envio</Label>
                  <input type="file" onChange={handleFileChange} id="img" />
                  <Button className="w-full mt-6" type="submit">
                    entrar
                  </Button>
                </form>
              </div>
            </CardContent>
            <CardFooter className="mt-2">
              <p className="text-muted-foreground text-center text-sm">
                Ao entrar em nossa plataforma voce concorda com nossos Termos de
                Uso e Politicas de Privacidade
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form> */}
      <Toaster />
    </Fragment>
  );
}
