import React, { useState } from 'react';
import { LockIcon, MessageSquareIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { inputClass } from '../ui/Field';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatDateTime } from '../../utils/format';

interface NotesListProps {
  appId: string;
  viewer: 'dealer' | 'admin';
  author: string;
}

export function NotesList({ appId, viewer, author }: NotesListProps) {
  const { notes, addNote } = useDemoData();
  const [body, setBody] = useState('');
  const [internal, setInternal] = useState(viewer === 'admin');
  const [error, setError] = useState('');
  const visible = notes.filter((n) => n.appId === appId && (viewer === 'admin' || !n.internal));

  const submit = () => {
    if (body.trim().length < 3) {
      setError('Write a note before saving');
      return;
    }
    addNote({ appId, author, body: body.trim(), internal: viewer === 'admin' ? internal : false });
    setBody('');
    toast.success(internal && viewer === 'admin' ? 'Internal note added' : 'Note added');
  };

  return (
    <div>
      {visible.length === 0 ?
      <p className="flex items-center gap-2 text-sm text-muted">
          <MessageSquareIcon className="h-4 w-4" /> No notes yet.
        </p> :

      <ul className="space-y-3">
          {visible.map((n) =>
        <li key={n.id} className={twMerge('rounded-lg border p-3', n.internal ? 'border-warning/25 bg-warning-50/60' : 'border-line bg-canvas')}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-ink">{n.author}</span>
                <span className="text-muted">{formatDateTime(n.time)}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{n.body}</p>
              {n.internal &&
          <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-warning-700">
                  <LockIcon className="h-3 w-3" /> Internal — not visible to dealer
                </p>
          }
            </li>
        )}
        </ul>
      }
      <div className="mt-4">
        <label htmlFor={`note-${appId}`} className="sr-only">
          Add a note
        </label>
        <textarea
          id={`note-${appId}`}
          rows={3}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setError('');
          }}
          placeholder={viewer === 'admin' ? 'Add a note for this case…' : 'Add a note for the operations team…'}
          className={inputClass(!!error, 'h-auto resize-none py-2')} />
        
        {error && <p className="mt-1 text-xs text-danger-700">{error}</p>}
        <div className="mt-2 flex items-center justify-between gap-3">
          {viewer === 'admin' ?
          <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} className="h-3.5 w-3.5 accent-brand" />
              Internal only
            </label> :

          <span className="text-xs text-muted">Visible to operations team</span>
          }
          <Button size="sm" variant="secondary" onClick={submit}>
            Add note
          </Button>
        </div>
      </div>
    </div>);

}