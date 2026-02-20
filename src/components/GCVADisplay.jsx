export default function GCVADisplay({ data, darkMode }) {
  if (!data) return null;

  const renderImageCard = (url, pageUrl) => (
    <div
      key={url + pageUrl}
      className={`rounded-2xl shadow p-2 flex flex-col items-center transition-colors duration-300 ${
        darkMode ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <img
        src={url}
        alt="web match"
        className="h-40 w-full object-contain mb-2 rounded-xl"
      />
      {pageUrl && (
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm font-medium underline truncate w-full text-center ${
            darkMode ? "text-blue-300 hover:text-blue-400" : "text-blue-600 hover:text-blue-800"
          }`}
        >
          View Page
        </a>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {data.pages_with_matching_images?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Pages with Matching Images:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.pages_with_matching_images.map((p, idx) => {
              const allImages = [
                ...(p.full_matching_images || []),
                ...(p.partial_matching_images || []),
              ];
              return allImages.map((imgUrl) => renderImageCard(imgUrl, p.url));
            })}
          </div>
        </div>
      )}

      {data.visually_similar_images?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Visually Similar Images:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.visually_similar_images.map((url) => renderImageCard(url))}
          </div>
        </div>
      )}
    </div>
  );
}
