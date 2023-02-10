import styled, { css } from "styled-components";

export const HomeContainer = styled.main`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
  }
`;

export const BasetCountDownButton = styled.button`
  width: 100%;
  border: 0;
  padding: 1rem;
  border-radius: 8px;
  color: ${(props) => props.theme["gray-100"]};

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;
  font-weight: bold;

  cursor: pointer;

  &:disabled {
    opacity: 0.7;
  }
`;

export const StartCountDownButton = styled(BasetCountDownButton)`
  ${({ theme }) => css`
    background: ${theme["green-500"]};

    &:not(:disabled):hover {
      background: ${theme["green-700"]};
    }
  `}
`;

export const StopCountDownButton = styled(BasetCountDownButton)`
  ${({ theme }) => css`
    background: ${theme["red-500"]};

    &:not(:disabled):hover {
      background: ${theme["red-700"]};
    }
  `}
`;
