import { atom } from "recoil";
import { IBuilder } from "./types";

export const builderAtom = atom<IBuilder | null>({
  key: "BuilderAtom",
  default: null,
});
