import { atom } from "jotai";
import { IForm, ItemType } from "./BuilderTypes";
import { splitAtomWithFallback } from "./splitAtomWithFallback";

export const indexesAtom = atom<number[]>([]);
export const itemsAtom = atom<ItemType[]>([]);
export const itemListAtom = splitAtomWithFallback(itemsAtom);
export const formAtom = atom<IForm | null>(null);
export const selectedItemAtom = atom<number | null>(0);
export const formBuilderCheckboxAtom = atom<boolean | null>(null);
export const isThankYouAtom = atom<boolean>(false);
