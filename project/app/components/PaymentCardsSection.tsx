"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCreditCard, faXmark } from "@fortawesome/free-solid-svg-icons";

type SavedCard = {
  id: string;
  cardBrand: string | null;
  cardLastFour: string;
  cardExpMonth: number;
  cardExpYear: number;
};

export default function PaymentCardsSection({
  savedCards,
  isOpen,
  onToggle,
  onAddCard,
  onRemoveCard,
}: {
  savedCards: SavedCard[];
  isOpen: boolean;
  onToggle: () => void;
  onAddCard: () => void;
  onRemoveCard?: (id: string) => void;
}) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-gray-50 hover:bg-gray-100"
      >
        Payment Methods
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-4 space-y-2">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white"
              >
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="w-5 h-5 text-gray-400 shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {card.cardBrand || "Card"} &bull;&bull;&bull;&bull;{" "}
                    {card.cardLastFour}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {card.cardExpMonth}/{card.cardExpYear}
                  </p>
                </div>
                {onRemoveCard && (
                  <button
                    type="button"
                    onClick={() => onRemoveCard(card.id)}
                    className="text-gray-400 hover:text-gray-800 transition-colors shrink-0 p-1"
                    aria-label="Remove card"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {savedCards.length < 3 && (
              <button
                type="button"
                onClick={onAddCard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-black hover:text-black transition-colors"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded border-2 border-current text-base font-bold shrink-0">
                  +
                </span>
                <span className="text-sm font-semibold">
                  Add payment method
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
