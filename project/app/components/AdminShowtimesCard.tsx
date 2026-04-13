"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import ManageShowtimesModal from "./ManageShowtimesModal";

export default function AdminShowtimesCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col gap-3 hover:bg-neutral-800 transition-colors text-left"
      >
        <FontAwesomeIcon icon={faClock} className="text-2xl w-6 h-6" />
        <span className="font-semibold text-lg">Manage Showtimes</span>
        <span className="text-neutral-400 text-sm">
          Manage movie showtimes
        </span>
      </button>

      {showModal && <ManageShowtimesModal onClose={() => setShowModal(false)} />}
    </>
  );
}
