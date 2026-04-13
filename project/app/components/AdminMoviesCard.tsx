"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import AddMovieModal from "./AddMovieModal";

export default function AdminMoviesCard({ icon }: { icon: IconDefinition }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col gap-3 hover:bg-neutral-800 transition-colors text-left"
      >
        <FontAwesomeIcon icon={icon ?? faFilm} className="text-2xl w-6 h-6" />
        <span className="font-semibold text-lg">Manage Movies</span>
        <span className="text-neutral-400 text-sm">
          Add, edit, or remove movies
        </span>
      </button>

      {showModal && <AddMovieModal onClose={() => setShowModal(false)} />}
    </>
  );
}
