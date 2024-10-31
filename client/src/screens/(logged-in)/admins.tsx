import { Fragment } from "react/jsx-runtime";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Search } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Admin() {
  const navigate = useNavigate();
  return (
    <Fragment>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="p-4">
            <ArrowLeft onClick={() => navigate("/public")} />
          </TooltipTrigger>
          <TooltipContent>
            <p>visualizar dados publicos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Registro de Propriedades - Controle Geral da Administração
        </h1>
        <div className="flex items-center justify-between">
          <form className="flex items-center gap-2">
            <Input
              name="id"
              placeholder="ID do registro"
              className="w-auto"
            ></Input>
            <Input
              name="name"
              placeholder="Nome da propriedade"
              className="w-auto"
            ></Input>
            <Input
              name="owner"
              placeholder="Nome do proprietário"
              className="w-auto"
            ></Input>
            <Button type="submit" variant="link">
              <Search className="w-4 h-4 mr-2" />
              buscar dados
            </Button>
          </form>
        </div>
        <div className="border rounded-lg p-2">
          <Table>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead>Cep</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Rua</TableHead>
              <TableHead>Pesticida</TableHead>
              <TableHead>Plantação</TableHead>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>{idx}</TableCell>
                    <TableCell>propriedade ${idx}</TableCell>
                    <TableCell>Anderson felipe</TableCell>
                    <TableCell>12287937</TableCell>
                    <TableCell>SP</TableCell>
                    <TableCell>Sao Jose do Rio Preto</TableCell>
                    <TableCell>1875</TableCell>
                    <TableCell>rua anything street</TableCell>
                    <TableCell>pesticida Xz</TableCell>
                    <TableCell>Milho</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Fragment>
  );
}
