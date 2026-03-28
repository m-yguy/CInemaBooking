"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({
  firstName,
  lastName,
  email,
  phone = "",
  action,
  notifyAction,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  action: (formData: FormData) => Promise<void>;
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

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) {
      setLocalPhone(formatPhoneInput(phone));
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const prevValuesRef = useRef({ firstName, lastName, phone });
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
    if (phoneDigits.length !== 10) {
      setError("Enter valid phone number");
      return;
    }
    formData.set("firstName", localFirstName);
    formData.set("lastName", localLastName);
    formData.set("phone", phoneDigits);
    const prevValues = { ...prevValuesRef.current };
    const savedFirstName = localFirstName;
    const savedLastName = localLastName;
    const savedPhone = phoneDigits;
    startTransition(async () => {
      await action(formData);
      prevValuesRef.current = {
        firstName: savedFirstName,
        lastName: savedLastName,
        phone: savedPhone,
      };
      setEditing(false);
      setSuccess(true);
      router.refresh();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        async () => {
          const changes: string[] = [];
          if (savedFirstName !== prevValues.firstName)
            changes.push("First name");
          if (savedLastName !== prevValues.lastName) changes.push("Last name");
          if (savedPhone !== prevValues.phone) changes.push("Phone number");
          if (changes.length > 0) await notifyAction(changes);
        },
        10 * 60 * 1000,
      );
    });
  }

  if (!editing) {
    return (
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
      <div className="flex gap-4">
        <button
          type="button"
          className="rounded-full bg-gray-300 px-6 py-3 font-semibold text-black hover:bg-gray-400"
          onClick={() => {
            setError(""); // Clear error when cancel is clicked
            setLocalPhone(formatPhoneInput(phone));
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
    </form>
  );
}
