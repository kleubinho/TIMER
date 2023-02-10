import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from "./styles";
import { useEffect, useState } from "react";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no maximo 60 minutos"),
});

type NewCycleFormatData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondPassed, setAmountSecondsPassed] = useState(0); // total de segundos que já se passaram desde que um ciclo iniciou-se

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormatData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; //Converte o numero de minutos em segundos

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycles(state =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecondsPassed(totalSeconds)
           clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  function handleCreateNewCycle(data: NewCycleFormatData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setActiveCycleId(null);

    setCycles(state =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  const currentSecond = activeCycle ? totalSeconds - amountSecondPassed : 0; //o tanto de tempo que já se passou

  const minutesAmount = Math.floor(currentSecond / 60); //Arredondando numero pra baixo
  const secondsAmout = currentSecond % 60; //quantos segundos eu tenho do resto da divisão acima

  const minutes = String(minutesAmount).padStart(2, "0"); //método que preenche uma string até um tamnho especifico com algum caracter, caso ela ainda não tenha o tamanho
  const seconds = String(secondsAmout).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="tasks-suggestion"
            type="text"
            placeholder="Dê um nomepara o seu projeto"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <datalist id="tasks-suggestion">
            <option value="opa">opa</option>
            <option value="opa">opa</option>
            <option value="opa">opa</option>
          </datalist>

          <label htmlFor="minutesAmount">Durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  );
}
