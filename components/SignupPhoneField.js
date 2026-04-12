"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

/**
 * International phone field with country selector (all countries).
 * UAE (AE) is the default country.
 */
export default function SignupPhoneField({ id, value, onChange }) {
  return (
    <div className="signup-phone-field mt-1.5">
      <PhoneInput
        id={id}
        name="phone"
        international
        defaultCountry="AE"
        value={value}
        onChange={onChange}
        autoComplete="tel"
        placeholder="00 000 0000"
        addInternationalOption={false}
        countrySelectProps={{
          "aria-label": "Country calling code",
        }}
        className="signup-phone-inner"
        numberInputProps={{
          className:
            "signup-phone-input min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-3 pr-3.5 text-[15px] leading-normal tracking-wide text-foreground outline-none ring-0 placeholder:text-foreground/30 focus:ring-0",
        }}
      />
    </div>
  );
}
