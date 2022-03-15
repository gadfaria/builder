/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { SetStateAction, useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { toast } from "react-toastify";
import StyledButton from "./StyledButton";
import { formAtom, formBuilderCheckboxAtom, ItemType } from "./Builder";
import { validationEmail } from "../../utils/Validation";
import StyledInput from "./StyledInput";

const Container = styled.div<{ isSelected?: boolean }>`
  padding: ${(props) => (props.isSelected ? "10px" : "0px")};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .fake-input {
    opacity: 0;
    position: absolute;
    z-index: -999;
  }
`;

const InputCss = css`
  margin-bottom: 12px;
  width: 340px;
  height: 46px;
  font-size: 18px;

  ::placeholder {
    letter-spacing: 0px;
    color: #979797;
    font-size: 18px;
  }
`;

const ButtonCss = css`
  width: 340px;
  font-size: 18px;
  height: 46px;
  font-weight: bold;
`;

interface Props {
  item: ItemType;
  setItem: (update: SetStateAction<ItemType>) => void;
  isSelected?: boolean;
  isPreview?: boolean;
}

export default function FormBuilderInputs(props: Props): JSX.Element {
  const [form] = useAtom(formAtom);
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkbox] = useAtom(formBuilderCheckboxAtom);
  const [hasError, setHasError] = useState(false);
  const [inputPhoneCss, setInputPhoneCss] = useState<React.CSSProperties>({
    width: "340px",
    height: "46px",
    marginBottom: "12px",
    fontSize: "18px",
    border: "1px solid #dddddd",
    color: "#383838",
    boxShadow: "none",
  });
  // BOT DETECT
  const [username, setUsername] = useState("");

  const disable =
    username.length > 0 ||
    (checkbox !== null && !checkbox) ||
    email.length === 0 ||
    (props.item.state?.fields?.includes("FIRST_NAME") &&
      firstName.length === 0) ||
    (props.item.state?.fields?.includes("LAST_NAME") &&
      lastName.length === 0) ||
    (props.item.state?.fields?.includes("FULL_NAME") && fullName.length === 0);

  async function handleClick() {
    setIsLoading(true);

    if (email.includes("+")) {
      setHasError(true);
      setIsLoading(false);
      toast(
        "Test does not allow the '+keyword' based alias emails. Instead of entering troy+test@troybroussard.com you will need to enter troy@troybroussard.com as the email address. For CAN-SPAM reasons we cannot alter the email you enter, so you'll need to re-enter it.",
        { type: "error" }
      );
      return;
    }

    if (!validationEmail(email)) {
      setHasError(true);
      setIsLoading(false);
      toast("Incorrect email format", { type: "error" });
      return;
    }

    if (props.item.state?.fields?.includes("PHONE") && phone.length <= 7) {
      toast("Incorrect phone", { type: "error" });
      setInputPhoneCss((i) => ({
        ...i,
        borderColor: "#c41700",
        boxShadow: "0px 0px 6px #c417004d",
      }));
      setIsLoading(false);
      return;
    }

    const response = false;

    if (!response) {
      toast("Failed to add your contact", { type: "error" });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (!props.item.state?.fields?.includes("PHONE")) return;
    (async () => {
      const test = await fetch("https://ipapi.co/json/");
      const testObject = await test.json();
      setPhone(testObject.country_calling_code);

      !props.item.state?.fields?.length && emailRef.current?.focus();
    })();
  }, []);

  return (
    <Container
      isSelected={props.isSelected}
      css={css`
        pointer-events: ${props.isPreview ? "auto" : "none"};
        input {
          ${InputCss};
          ${props.item.state?.formColor &&
          css`
            :focus {
              box-shadow: 0px 0px 6px ${`${props.item.state?.formColor}80`};
              border: 1px solid ${props.item.state?.formColor};
            }
          `}
        }
        button {
          ${ButtonCss};
          ${props.item.state?.formColor &&
          css`
            background-color: ${props.item.state?.formColor};
            border-color: ${props.item.state?.formColor};
          `}
        }
      `}
    >
      <div className="fake-input">
        <input
          autoComplete="off"
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {props.item.state?.fields?.includes("FIRST_NAME") && (
        <StyledInput
          value={firstName}
          onChange={(evt) => setFirstName(evt.target.value)}
          placeholder="First Name"
        />
      )}

      {props.item.state?.fields?.includes("LAST_NAME") && (
        <StyledInput
          value={lastName}
          onChange={(evt) => setLastName(evt.target.value)}
          placeholder="Last Name"
        />
      )}

      {props.item.state?.fields?.includes("FULL_NAME") && (
        <StyledInput
          value={fullName}
          onChange={(evt) => setFullName(evt.target.value)}
          placeholder="Full Name"
        />
      )}

      <StyledInput
        value={email}
        error={hasError}
        onChange={(evt) => {
          setHasError(false);
          setEmail(evt.target.value.split(" ").join("").trim());
        }}
        onKeyPress={(evt) => {
          if (evt.code === "Enter" && !props.item.state?.fields?.length) {
            setTimeout(() => {
              handleClick();
            }, 500);
          }
        }}
        type="email"
        placeholder="Email"
        ref={emailRef}
      />

      {props.item.state?.fields?.includes("PHONE") && (
        <div>
          <PhoneInput
            inputStyle={inputPhoneCss}
            onFocus={() =>
              setInputPhoneCss((i) => ({
                ...i,
                borderColor: props.item.state?.formColor || "#fb972e",
                boxShadow: `0px 0px 6px ${`${
                  props.item.state?.formColor || "#fb972e"
                }80`}`,
              }))
            }
            onBlur={() =>
              setInputPhoneCss((i) => ({
                ...i,
                borderColor: "#dddddd",
                boxShadow: "none",
              }))
            }
            country={"us"}
            value={phone}
            onChange={(e, data, event, form) => {
              /* This lib accepts the country code as zero and to fix this you have to change the value directly in the html 
               because the value attribute is only used in the mount */
              if (form.startsWith("+0")) {
                form = form.replace("+0", "+1");
                let phoneInputElement = document.querySelector(
                  ".form-control"
                ) as HTMLInputElement | null;

                if (phoneInputElement) {
                  phoneInputElement.value = form;
                }
              }

              setPhone(form);
            }}
          />
        </div>
      )}

      <div data-tip data-for="button-disabled">
        {/* {disable && (
          <ReactTooltip
            id="button-disabled"
            place="top"
            effect="solid"
            backgroundColor="#333333"
            css={customTooltip}
          >
            <TooltipText>
              {email.length === 0 ? "Type your email" : "Confirm checkbox"}
            </TooltipText>
          </ReactTooltip>
        )} */}

        <StyledButton
          isLoading={isLoading}
          disable={disable}
          onClick={handleClick}
        >
          {props.item.state?.buttonText
            ? props.item.state.buttonText
            : "Get Started"}
        </StyledButton>
      </div>
    </Container>
  );
}
