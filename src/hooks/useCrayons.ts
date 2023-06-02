import { useCallback } from 'react';
import { atom, useSetRecoilState } from 'recoil';

export const crayonAtom = atom<number | null>({
  key: 'crayon',
  default: null,
});

export const useCrayons = () => {
  const draw = useSetRecoilState(crayonAtom);
  const setEmoji = useCallback(
    (
      wallPaperIndexingNumberToDetermineWhichImageToUseBecauseTheIndexIsInTheNameOfTheFileName: number
    ) => {
      localStorage.setItem(
        'WPINTDWITUTIIITNOTFN69',
        `${wallPaperIndexingNumberToDetermineWhichImageToUseBecauseTheIndexIsInTheNameOfTheFileName}`
      );
      draw(
        wallPaperIndexingNumberToDetermineWhichImageToUseBecauseTheIndexIsInTheNameOfTheFileName
      );
    },
    [draw]
  );
  return setEmoji;
};

export const getDrawing = () => {
  const drawing = localStorage.getItem('WPINTDWITUTIIITNOTFN69');
  if (drawing) {
    return drawing;
  }
  return null;
};
