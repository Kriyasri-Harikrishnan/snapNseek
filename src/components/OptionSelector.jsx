import { CheckCircle } from "lucide-react";

export default function OptionSelector({ selected, onSelect }) {
  const options = [
    { id: "direct", label: "eBay Image Search" },
    { id: "rekog", label: "AWS Rekognition" },
    { id: "gcva", label: "Google Cloud Vision" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex items-center justify-center gap-2 min-w-[170px] px-4 py-2 rounded-xl border font-medium transition-all duration-200
              ${isSelected
                ? "bg-green-500 text-white border-green-600 shadow-md scale-[1.03]"
                : "bg-white border-gray-300 hover:bg-blue-50 text-gray-800"}`}
          >
            {/* Icon container to prevent layout shift */}
            <span className="w-5 h-5 flex items-center justify-center">
              {isSelected && <CheckCircle className="w-5 h-5" />}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
