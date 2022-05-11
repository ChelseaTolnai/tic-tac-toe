export enum EmailErrors {
  EmailRequired = 'Email address is required',
  EmailMissingAt = 'Email address requires "@" character',
  EmailDomainInvalid = 'Email domain after "@" is missing or invalid',
  EmailUserInvalid = 'Email information before "@" is missing or invalid',
  EmailInvalid = 'Invalid email address'
}

const valueExists = (email: string): boolean => !!email.length;
const emailContainsAt = (email: string): boolean => /@/.test(email);

const validUser = (email: string): boolean => {
  /* 
    user starts with `^` 1 or more of any word characters aka any casing letters and/or digits `\w+`

    can have 0 or 1 of the "." or "-" characters within string `[.-]` but cannot repeat immediately after itself `?`
    may then contain 1 or more any word characters `\w+` after the ".=" characters but ".=" characters does not have to exist
   
    ends with `$` 0 or more `()*` of the ".=" characters and/or word characters after initial word character(s)
  */
  const userRegex = /^\w+([.-]?\w+)*$/;
  const userInfo = email.split('@')[0]; // take all string before "@"
  return userRegex.test(userInfo);
};

const validDomain = (email: string): boolean => {
  /*
    domain starts with `^` 1 or more of any word characters aka any casing letters and/or digits `\w+`

    can have 0 or 1 of the "." or "-" characters within string `[.-]` but cannot repeat immediately after itself `?`
    may then contain 1 or more any word characters `\w+` after the ".=" characters but ".=" characters does not have to exist
    can have 0 or more `()*` of the ".=" characters and/or word characters after initial word character(s)

    end with `$` matches 1 or more with "." character followed by 2-3 word characters `(\.\w{2,3})+`
  */
  const domainRegex = /^\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const domain = email.split('@')[1]; // take all string after "@"
  return domainRegex.test(domain);
}

const validEmail = (email: string): boolean => {
  // email starts with `^` proper user followed by @ symbol and ends with `$` proper domain
  const userRegex = /\w+([.-]?\w+)*/;
  const domainRegex = /\w+([.-]?\w+)*(\.\w{2,3})+/;
  const emailRegex = new RegExp(`^${userRegex.source}@${domainRegex.source}$`);
  return emailRegex.test(email);
}

export const validateEmail = (email: string): EmailErrors | undefined => {
  // 1) check there is an input value. If no input value display form error of missing email
  if (!valueExists(email)) { return EmailErrors.EmailRequired; };

  /* 2) 
    Validate that input is proper email address.
    Email is separated into two parts by require @ symbol
    First part is user and second part is the domain
  */

  // 2a) check there is required @ symbol within value
  if (!emailContainsAt((email))) { return EmailErrors.EmailMissingAt; };

  // 2b) validate user information of email
  if (!validUser(email)) { return EmailErrors.EmailUserInvalid; };

  // 2c) validate domain information of email
  if (!validDomain(email)) { return EmailErrors.EmailDomainInvalid; };

  // 2d) perform full validation check as fallback
  // could use this validation only if you only needed one generic email invalid message
  if (!validEmail(email)) { return EmailErrors.EmailInvalid; };

  // if no error return undefined so no error message displays to user
  return undefined;
};