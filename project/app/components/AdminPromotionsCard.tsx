"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faList } from "@fortawesome/free-solid-svg-icons";
import AddPromotionModal from "./AddPromotionModal";
import PromotionsListModal from "./PromotionsListModal";

export default function AdminPromotionsCard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  return (
    <>
      <div className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col gap-3">
        <FontAwesomeIcon icon={faTags} className="text-2xl w-6 h-6" />
        <span className="font-semibold text-lg">Manage Promotions</span>
        <span className="text-neutral-400 text-sm">
          Create and manage promotions
        </span>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm text-white rounded-lg px-3 py-2"
          >
            Add New
          </button>
          <button
            type="button"
            onClick={() => setShowListModal(true)}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 transition-colors text-sm text-white rounded-lg px-3 py-2 flex items-center justify-center gap-1.5"
          >
            <FontAwesomeIcon icon={faList} className="w-3 h-3" />
            View All
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddPromotionModal onClose={() => setShowAddModal(false)} />
      )}
      {showListModal && (
        <PromotionsListModal onClose={() => setShowListModal(false)} />
      )}
    </>
  );
}
