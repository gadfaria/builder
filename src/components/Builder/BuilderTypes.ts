import BuilderEditor from "./BuilderEditor";
import BuilderInputs from "./BuilderInputs";

export type Types =
  | "TEXT"
  | "BUTTON"
  | "IMAGE"
  | "FORM"
  | "MAIN"
  | "CHECKBOX"
  | "FOOTER";

export interface IBuilder {
  name: string;
  url: string;
  createdAt: Date;
  builder?: any;
  thankYouBuilder?: any;
  hasThankYouBuilder?: boolean;
}

export interface ItemType {
  id: string;
  type: Types;
  content?: typeof BuilderInputs | typeof BuilderEditor;
  style?: {
    fontFamily?: string;
    color?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    checkbox?: boolean;
    fontSize?: string;
    width?: string;
    opacity?: string;
    borderRadius?: string;
    lineHeight?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marginBottom?: string;
    linkColor?: string;
    visitedLinkColor?: string;
    checkboxColor?: string;
  };
  state?: any;
  deleted?: boolean;
}
