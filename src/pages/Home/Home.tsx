import { Play } from "phosphor-react";
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from "./styles";

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="tasks-suggestion"
            type="text"
            placeholder="Dê um nomepara o seu projeto"
          />

          <datalist id="tasks-suggestion">
            <option value="opa">opa</option>
            <option value="opa">opa</option>
            <option value="opa">opa</option>
          </datalist>

          <label htmlFor="minutosAmount">Durante</label>
          <MinutesAmountInput
           type="number"
            id="minutosAmount"
            placeholder="00" 
            step={5}
            min={5}
            max={60}
            />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDownButton disabled type="submit">
          <Play size={24} />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  );
}
