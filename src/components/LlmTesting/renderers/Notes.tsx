type NotesProps = {
  notes: any;
};

// Render notes section with better formatting
export function Notes({ notes }: NotesProps) {
  if (!notes) return null;
  
  return (
    <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
      <h3 className="text-lg font-bold mb-3">Notes</h3>
      
      {notes.grammarErrors && notes.grammarErrors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Grammar Issues</h4>
          <ul className="list-disc pl-5 text-sm">
            {notes.grammarErrors.map((error: string, index: number) => (
              <li key={`grammar-${index}`} className="mb-1">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {notes.biases && notes.biases.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Potential Biases</h4>
          <ul className="list-disc pl-5 text-sm">
            {notes.biases.map((bias: string, index: number) => (
              <li key={`bias-${index}`} className="mb-1">{bias}</li>
            ))}
          </ul>
        </div>
      )}
      
      {notes.jargonComplexity && notes.jargonComplexity.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Jargon & Complexity</h4>
          <ul className="list-disc pl-5 text-sm">
            {notes.jargonComplexity.map((item: string, index: number) => (
              <li key={`jargon-${index}`} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 