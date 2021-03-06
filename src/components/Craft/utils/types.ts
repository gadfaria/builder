export type Types = "TEXT" | "BUTTON" | "IMAGE" | "CONTAINER" | "FOOTER";

export interface IBuilder {
  name: string;
  pageTitle?: string;
  createdAt: Date;
  builder?: string;
}

export interface ItemType {
  id: string;
  type: Types;
  content?: any;
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
