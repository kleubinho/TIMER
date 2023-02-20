import { differenceInSeconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CountDownContainer, Separator } from "./styles";

export function CountDown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFineshed,
    amountSecondPassed,
    setSecondsPassed
  } = useContext(CyclesContext);

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
          markCurrentCycleAsFineshed();

          setSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecondsPassed(secondsDifference);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFineshed, setSecondsPassed]);

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

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  );
}
