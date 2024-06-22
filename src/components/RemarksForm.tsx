"use client";
import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

type RemarksFormProps = {
  remarks: string;
  onRemarksChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  saveRemarks: () => void;
  onCancel: () => void;
  deleteRemarks: () => void; // New prop for deleting remarks
};

export default function RemarksForm({
  remarks,
  onRemarksChange,
  saveRemarks,
  onCancel,
  deleteRemarks // New prop for deleting remarks
}: RemarksFormProps) {
  return (
    <div>
      <textarea
        value={remarks}
        onChange={onRemarksChange}
        rows={3}
        className="mt-1 block w-full border border-gray-300"
        placeholder="Bemerkungen"
      />
      <div className="flex justify-end mt-2 space-x-2">
  <button
    type="button"
    onClick={deleteRemarks}
    className="bg-red-500 text-white py-1 px-3 rounded basis-1/4"
  >
    <FontAwesomeIcon icon={faTrash} className="text-lg" />
  </button>
  <button
    type="button"
    onClick={saveRemarks}
    className="bg-customYellow-200 text-black py-1 px-3 rounded basis-3/4"
  >
    <FontAwesomeIcon icon={faSave} className="text-lg" />
  </button>
</div>


    </div>
  );
}
