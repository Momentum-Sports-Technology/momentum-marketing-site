import { Save, CheckCircle, AlertCircle } from "lucide-react";
import type { SaveState } from "@/components/admin/types";

interface SaveButtonProps {
  saveState: SaveState;
  disabled?: boolean;
  onClick: () => void;
}

export default function SaveButton({ saveState, disabled, onClick }: SaveButtonProps) {
  const saving = saveState.status === "saving";
  return (
    <div className="sticky bottom-6 flex flex-col items-center gap-3">
      {saveState.status === "error" && (
        <pre className="max-w-2xl whitespace-pre-wrap text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
          {saveState.message}
        </pre>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={saving || disabled}
        className="flex items-center space-x-2 bg-momentum-orange text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all font-semibold text-lg disabled:opacity-50"
      >
        {saveState.status === "saved" ? (
          <>
            <CheckCircle size={24} />
            <span>Saved</span>
          </>
        ) : saveState.status === "error" ? (
          <>
            <AlertCircle size={24} />
            <span>Fix and retry</span>
          </>
        ) : (
          <>
            <Save size={24} />
            <span>{saving ? "Saving..." : "Save changes"}</span>
          </>
        )}
      </button>
    </div>
  );
}
