export default function ProductCard({ item, darkMode }) {
  return (
    <div
      className={`rounded-2xl shadow p-4 flex flex-col items-center transition-colors duration-300 ${
        darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <img
        src={item.image?.imageUrl || item.image}
        alt={item.title}
        className="h-40 object-contain"
      />
      <h3 className="font-semibold text-center mt-2">{item.title}</h3>
      <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {item.price
          ? `${item.price.value} ${item.price.currency}`
          : "Price not available"}
      </p>
      <a
        href={item.itemWebUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 hover:underline ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}
      >
        View on eBay →
      </a>
    </div>
  );
}
