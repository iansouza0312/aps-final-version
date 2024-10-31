import { Fragment } from "react/jsx-runtime";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";

const chartData = [
  { estado: "sao_paulo", quantidade: 275, fill: "var(--color-sao_paulo)" },
  {
    estado: "rio_de_janeiro",
    quantidade: 200,
    fill: "var(--color-rio_de_janeiro)",
  },
  { estado: "brasilia", quantidade: 187, fill: "var(--color-brasilia)" },
  { estado: "fortaleza", quantidade: 173, fill: "var(--color-fortaleza)" },
  { estado: "salvador", quantidade: 90, fill: "var(--color-salvador)" },
];

const description =
  "quatidade de propriedades registradas nas 5 principais capitais do pais";

const chartConfig = {
  quantidade: {
    label: "quantidade",
  },
  sao_paulo: {
    label: "Sao Paulo",
    color: "hsl(var(--chart-1))",
  },
  rio_de_janeiro: {
    label: "Rio de Janeiro",
    color: "hsl(var(--chart-2))",
  },
  brasilia: {
    label: "Brasilia",
    color: "hsl(var(--chart-3))",
  },
  fortaleza: {
    label: "Fortaleza",
    color: "hsl(var(--chart-4))",
  },
  salvador: {
    label: "Salvador",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const secondaryData = [
  { browser: "total", quantidade: 1260, fill: "var(--color-total)" },
];

const secChartConfig = {
  quantidade: {
    label: "propriedades",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const today = new Date();
const formattedDate = today.toLocaleDateString();

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <Fragment>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="p-4">
            <ArrowLeft onClick={() => navigate("/admin")} />
          </TooltipTrigger>
          <TooltipContent>
            <p>visualizar dados da secretaria</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex h-screen w-full items-center justify-center bg-zinc-200">
        <div className="w-full max-w-5xl bg-slate-300 shadow rounded-lg p-8">
          <Card className="w-full">
            <CardHeader className="flex items-center justify-center ">
              <CardTitle className="text-2xl font-bold tracking-tighter text-center">
                Registro de propriedades - Indicadores especiais
              </CardTitle>
              <CardDescription className="text-sm">
                acompanhamento de informações especiais p/ o ministro do
                meio-ambiente
                <p>Última atualização em: {formattedDate}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 mt-2">
              <div className="grid grid-cols-2 gap-4 items-center">
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="estado"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        chartConfig[value as keyof typeof chartConfig]?.label
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="quantidade"
                      strokeWidth={2}
                      radius={8}
                      activeIndex={2}
                      activeBar={({ ...props }) => {
                        return (
                          <Rectangle
                            {...props}
                            fillOpacity={0.8}
                            stroke={props.payload.fill}
                            strokeDasharray={4}
                            strokeDashoffset={4}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ChartContainer>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="estado"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        chartConfig[value as keyof typeof chartConfig]?.label
                      }
                    />
                    <XAxis dataKey="quantidade" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="quantidade" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
              </div>
              <div>
                <ChartContainer
                  config={secChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadialBarChart
                    data={secondaryData}
                    endAngle={100}
                    innerRadius={80}
                    outerRadius={140}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <RadialBar dataKey="quantidade" background />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-4xl font-bold"
                                >
                                  {chartData[0].quantidade.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  propriedades
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <div className="leading-none text-muted-foreground">
                <p>{description}</p>
                {/* exibindo quantidade total de propriedades registradas */}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}
