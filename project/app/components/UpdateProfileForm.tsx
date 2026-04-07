"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PaymentCardsSection from "./PaymentCardsSection";
import AddCardModal from "./AddCardModal";

type SavedCard = {
  id: string;
  cardBrand: string | null;
  cardLastFour: string;
  cardExpMonth: number;
  cardExpYear: number;
};

export default function UpdateProfileForm({
  firstName,
  lastName,
  email,
  phone = "",
  addressLine1 = "",
  addressLine2 = "",
  city = "",
  state = "",
  postalCode = "",
  country = "",
  isCustomer = false,
  mailingAddressId = null,
  savedCards = [],
  action,
  notifyAction,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isCustomer?: boolean;
  mailingAddressId?: number | null;
  savedCards?: SavedCard[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  notifyAction: (changes: string[]) => Promise<void>;
}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Automatically hide the success message after 2.5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);
  const [isPending, startTransition] = useTransition();
  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLastName, setLocalLastName] = useState(lastName);
  // Format phone number for display (123-456-7890)
  function formatPhoneInput(value: string) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 3 && digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return formatted;
  }

  // Only allow up to 10 digits
  const [localPhone, setLocalPhone] = useState(formatPhoneInput(phone));
  const [localAddressLine1, setLocalAddressLine1] = useState(addressLine1);
  const [localAddressLine2, setLocalAddressLine2] = useState(addressLine2);
  const [localCity, setLocalCity] = useState(city);
  const [localState, setLocalState] = useState(state);
  const [localPostalCode, setLocalPostalCode] = useState(postalCode);
  const [localCountry, setLocalCountry] = useState(country);

  const [editing, setEditing] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
    new Set(),
  );
  const visibleCards = savedCards.filter((c) => !pendingRemovals.has(c.id));

  async function handleRemoveCard(id: string) {
    setPendingRemovals((prev) => new Set(prev).add(id));
    const res = await fetch("/api/paymentCards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setPendingRemovals((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  useEffect(() => {
    if (!editing) {
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const prevValuesRef = useRef({
    firstName,
    lastName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setSuccess(false);
    setError("");
    const phoneDigits = localPhone.replace(/-/g, "");
    if (phoneDigits.length > 0 && phoneDigits.length !== 10) {
      setError("Enter valid phone number");
      return;
    }
    formData.set("firstName", localFirstName);
    formData.set("lastName", localLastName);
    formData.set("phone", phoneDigits);
    if (isCustomer) {
      formData.set("addressLine1", localAddressLine1);
      formData.set("addressLine2", localAddressLine2);
      formData.set("city", localCity);
      formData.set("state", localState);
      formData.set("postalCode", localPostalCode);
      formData.set("country", localCountry);
    }
    const prevValues = { ...prevValuesRef.current };
    const newValues = {
      firstName: localFirstName,
      lastName: localLastName,
      phone: phoneDigits,
      addressLine1: localAddressLine1,
      addressLine2: localAddressLine2,
      city: localCity,
      state: localState,
      postalCode: localPostalCode,
      country: localCountry,
    };
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      prevValuesRef.current = { ...newValues };
      setEditing(false);
      setSuccess(true);
      router.refresh();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        async () => {
          const changes: string[] = [];
          if (newValues.firstName !== prevValues.firstName)
            changes.push("First name");
          if (newValues.lastName !== prevValues.lastName)
            changes.push("Last name");
          if (newValues.phone !== prevValues.phone)
            changes.push("Phone number");
          if (newValues.addressLine1 !== prevValues.addressLine1)
            changes.push("Address");
          if (newValues.city !== prevValues.city) changes.push("City");
          if (newValues.state !== prevValues.state) changes.push("State");
          if (newValues.postalCode !== prevValues.postalCode)
            changes.push("Postal code");
          if (newValues.country !== prevValues.country) changes.push("Country");
          if (changes.length > 0) await notifyAction(changes);
        },
        // 10 * 60 * 1000,  this is a cooldown of 10 minutes for account changes
        0, // I'm chaing this to 0 for the demo so we can get the email faster
      );
    });
  }

  if (!editing) {
    return (
      <>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                First name
              </label>
              <div className="px-4 py-3 border border-gray-300 rounded-md bg-white text-black text-base font-normal">
                {localFirstName ? (
                  localFirstName
                ) : (
                  <span className="text-gray-400">Add first name</span>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Last name
              </label>
              <div className="px-4 py-3 border border-gray-300 rounded-md bg-white text-black text-base font-normal">
                {localLastName ? (
                  localLastName
                ) : (
                  <span className="text-gray-400">Add last name</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <div className="px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-base font-normal">
              {email}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Phone number
            </label>
            <div className="px-4 py-3 border border-gray-300 rounded-md bg-white text-black text-base font-normal">
              {localPhone ? (
                localPhone
              ) : (
                <span className="text-gray-400">Add phone number</span>
              )}
            </div>
          </div>
          {isCustomer && (
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setAddressOpen(!addressOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-gray-50 hover:bg-gray-100"
              >
                Mailing Address
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-4 h-4 transition-transform duration-300 ${addressOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${addressOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-6 px-4 pb-4 pt-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Address line 1
                      </label>
                      <input
                        readOnly
                        value={localAddressLine1}
                        placeholder="Address"
                        className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Address line 2
                      </label>
                      <input
                        readOnly
                        value={localAddressLine2}
                        placeholder="Apt, suite, etc. (optional)"
                        className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          City
                        </label>
                        <input
                          readOnly
                          value={localCity}
                          placeholder="City"
                          className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold">
                          State
                        </label>
                        <input
                          readOnly
                          value={localState}
                          placeholder="State"
                          className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-40">
                        <label className="mb-2 block text-sm font-semibold">
                          Postal code
                        </label>
                        <input
                          readOnly
                          value={localPostalCode}
                          placeholder="Postal code"
                          className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
                        />
                      </div>
                      <div className="w-28">
                        <label className="mb-2 block text-sm font-semibold">
                          Country
                        </label>
                        <input
                          readOnly
                          value={localCountry}
                          placeholder="Country"
                          className="w-full pointer-events-none select-none rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCustomer && (
            <PaymentCardsSection
              savedCards={visibleCards}
              isOpen={paymentOpen}
              onToggle={() => setPaymentOpen(!paymentOpen)}
              onAddCard={() => setAddingCard(true)}
              onRemoveCard={handleRemoveCard}
            />
          )}
          <button
            type="button"
            className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
          {success && (
            <p className="text-green-600 text-sm font-medium mt-2">
              Changes saved successfully
            </p>
          )}
        </div>
        {addingCard && (
          <AddCardModal
            addressLine1={localAddressLine1}
            addressLine2={localAddressLine2}
            city={localCity}
            state={localState}
            postalCode={localPostalCode}
            country={localCountry}
            mailingAddressId={mailingAddressId}
            onClose={() => setAddingCard(false)}
          />
        )}
      </>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">First name</label>
          <input
            name="firstName"
            value={localFirstName}
            onChange={(e) => setLocalFirstName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Last name</label>
          <input
            name="lastName"
            value={localLastName}
            onChange={(e) => setLocalLastName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">Phone number</label>
        <input
          type="tel"
          name="phone"
          value={localPhone}
          onChange={(e) => {
            // Only allow up to 10 digits, auto-format with dashes
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            setLocalPhone(formatPhoneInput(digits));
          }}
          maxLength={12} // 123-456-7890
          placeholder="123-456-7890"
          className="w-full rounded-md border border-gray-300 px-4 py-3"
        />
        {error && (
          <p className="text-red-600 text-sm font-medium mt-2">{error}</p>
        )}
      </div>
      {isCustomer && (
        <div className="rounded-md border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setAddressOpen(!addressOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-gray-50 hover:bg-gray-100"
          >
            Mailing Address
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-4 h-4 transition-transform duration-300 ${addressOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ${addressOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              <div className="space-y-6 px-4 pb-4 pt-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Address line 1
                  </label>
                  <input
                    name="addressLine1"
                    value={localAddressLine1}
                    onChange={(e) => setLocalAddressLine1(e.target.value)}
                    placeholder="123 Main St"
                    maxLength={255}
                    className="w-full rounded-md border border-gray-300 px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Address line 2
                  </label>
                  <input
                    name="addressLine2"
                    value={localAddressLine2}
                    onChange={(e) => setLocalAddressLine2(e.target.value)}
                    placeholder="Apt, suite, etc. (optional)"
                    maxLength={255}
                    className="w-full rounded-md border border-gray-300 px-4 py-3"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      City
                    </label>
                    <input
                      name="city"
                      value={localCity}
                      onChange={(e) => setLocalCity(e.target.value)}
                      placeholder="City"
                      maxLength={100}
                      className="w-full rounded-md border border-gray-300 px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      State
                    </label>
                    <input
                      name="state"
                      value={localState}
                      onChange={(e) => setLocalState(e.target.value)}
                      placeholder="State"
                      maxLength={100}
                      className="w-full rounded-md border border-gray-300 px-4 py-3"
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-40">
                    <label className="mb-2 block text-sm font-semibold">
                      Postal code
                    </label>
                    <input
                      name="postalCode"
                      value={localPostalCode}
                      onChange={(e) => setLocalPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      maxLength={20}
                      className="w-full rounded-md border border-gray-300 px-4 py-3"
                    />
                  </div>
                  <div className="w-28">
                    <label className="mb-2 block text-sm font-semibold">
                      Country
                    </label>
                    <input
                      name="country"
                      value={localCountry}
                      onChange={(e) =>
                        setLocalCountry(
                          e.target.value.toUpperCase().slice(0, 2),
                        )
                      }
                      placeholder="US"
                      maxLength={2}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCustomer && (
        <PaymentCardsSection
          savedCards={visibleCards}
          isOpen={paymentOpen}
          onToggle={() => setPaymentOpen(!paymentOpen)}
          onAddCard={() => setAddingCard(true)}
          onRemoveCard={handleRemoveCard}
        />
      )}
      <div className="flex gap-4">
        <button
          type="button"
          className="rounded-full bg-gray-300 px-6 py-3 font-semibold text-black hover:bg-gray-400"
          onClick={() => {
            setError("");
            setLocalPhone(formatPhoneInput(phone));
            setLocalAddressLine1(addressLine1);
            setLocalAddressLine2(addressLine2);
            setLocalCity(city);
            setLocalState(state);
            setLocalPostalCode(postalCode);
            setLocalCountry(country);
            setEditing(false);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-red-800 px-6 py-3 font-semibold text-white hover:bg-red-900 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {success && (
        <p className="text-green-600 text-sm font-medium mt-2">
          Changes saved successfully
        </p>
      )}
      {addingCard && (
        <AddCardModal
          addressLine1={localAddressLine1}
          addressLine2={localAddressLine2}
          city={localCity}
          state={localState}
          postalCode={localPostalCode}
          country={localCountry}
          mailingAddressId={mailingAddressId}
          onClose={() => setAddingCard(false)}
        />
      )}
    </form>
  );
}
