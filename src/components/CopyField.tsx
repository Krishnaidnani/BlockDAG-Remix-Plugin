import { useState } from "react";

const CopyField = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

 const handleCopy = () => {
  const el = document.createElement('textarea');
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};


  return (
    <div className="flex items-start gap-2">
      <strong>{label}:</strong>
      <span className="break-all text-xs sm:text-sm">{value}</span>
      <button
        onClick={handleCopy}
        className="text-green-700 hover:text-green-900 text-lg"
        title="Copy to clipboard"
      >
        {copied ? '✅' : '📋'}
      </button>
    </div>
  );
};
export default CopyField;