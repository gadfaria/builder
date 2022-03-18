const ONE_EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validationEmail(value: string): boolean {
  if (value.includes("+")) return false;
  if (ONE_EMAIL_REGEX.test(value) && value !== "") return true;

  return false;
}
