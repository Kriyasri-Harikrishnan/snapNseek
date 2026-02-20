export default function ResultsDisplay({ results }) {
  if (!results) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Analysis Results</h2>

      <div>
        <h3 className="font-semibold">Labels / Attributes:</h3>
        <ul>
          {results.labels?.map((label, idx) => (
            <li key={idx}>{label}</li>
          ))}
        </ul>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold">Web References:</h3>
        <ul>
          {results.webRefs?.map((ref, idx) => (
            <li key={idx}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                <img src={ref.imgUrl} alt="web ref" className="w-32 h-32 object-contain" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
