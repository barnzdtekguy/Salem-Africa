'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentItem, ContentKind, ContentStatus } from '@/lib/content/types';
import type { StaffContext, StaffRole } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';

type View = 'dashboard' | 'weekly_program' | 'event' | 'devotional' | 'media' | 'users';
type Draft = {
  kind: ContentKind;
  title: string;
  slug: string;
  status: ContentStatus;
  publishAt: string;
  imageUrl: string;
  imageAlt: string;
  data: Record<string, unknown>;
};

type StaffUser = { user_id: string; email: string; role: StaffRole; active: boolean };
type MediaFile = { name: string; url: string; created_at: string | null };

const NAV_ITEMS: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'weekly_program', label: 'Weekly Programs' },
  { view: 'event', label: 'Events' },
  { view: 'devotional', label: 'Devotionals' },
  { view: 'media', label: 'Media' },
  { view: 'users', label: 'Users' },
];
const STATUS_OPTIONS: ContentStatus[] = ['draft', 'scheduled', 'published', 'archived'];

function text(data: Record<string, unknown>, key: string, fallback = '') {
  const value = data[key];
  return typeof value === 'string' ? value : fallback;
}

function dateInLagos() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function toDraft(item: ContentItem): Draft {
  return {
    kind: item.kind,
    title: item.title,
    slug: item.slug,
    status: item.status,
    publishAt: item.publish_at
      ? new Date(new Date(item.publish_at).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
      : '',
    imageUrl: item.image_url ?? '',
    imageAlt: item.image_alt,
    data: item.data,
  };
}

function newDraft(kind: ContentKind): Draft {
  const today = dateInLagos();
  const shared: Draft = {
    kind,
    title: '',
    slug: '',
    status: 'draft',
    publishAt: '',
    imageUrl: '',
    imageAlt: '',
    data: {},
  };
  if (kind === 'weekly_program') {
    shared.data = {
      description: '',
      dayOfWeek: 'Sunday',
      startTime: '09:00',
      endTime: '',
      venue: '',
      minister: '',
      recurrence: 'weekly',
      specificDates: [],
      livestreamUrl: '',
      exceptions: [],
    };
  } else if (kind === 'event') {
    shared.data = {
      theme: '',
      description: '',
      startDate: today,
      endDate: today,
      startTime: '09:00',
      endTime: '',
      venue: '',
      speakers: [],
      registrationUrl: '',
      livestreamUrl: '',
    };
  } else {
    shared.data = {
      publicationDate: today,
      author: '',
      bibleReference: '',
      scriptureText: '',
      message: '',
      prayer: '',
      furtherReading: '',
    };
  }
  return shared;
}

function toDateTime(value: string) {
  if (!value) return null;
  return new Date(`${value}+01:00`).toISOString();
}

function byKind(items: ContentItem[], kind: ContentKind) {
  return items.filter((item) => item.kind === kind);
}

export function AdminDashboard({ staff }: { staff: StaffContext }) {
  const router = useRouter();
  const [view, setView] = useState<View>('dashboard');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewBusy, setPreviewBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>('editor');
  const [exceptionDate, setExceptionDate] = useState('');
  const [exceptionStatus, setExceptionStatus] = useState<'changed' | 'cancelled'>('cancelled');
  const [exceptionTime, setExceptionTime] = useState('');
  const [exceptionVenue, setExceptionVenue] = useState('');
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function loadContent() {
    setLoading(true);
    setLoadError('');
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not load content.');
      setItems(result.items as ContentItem[]);
    } catch (requestError) {
      setLoadError(requestError instanceof Error ? requestError.message : 'Could not load content.');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Could not load staff.');
    setUsers(result.users as StaffUser[]);
  }

  async function loadMedia() {
    const response = await fetch('/api/admin/media', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Could not load media.');
    setMedia(result.files as MediaFile[]);
  }

  useEffect(() => {
    void loadContent();
  }, []);

  useEffect(() => {
    function warnBeforeLeave(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [dirty]);

  useEffect(() => {
    if (view === 'users' && staff.role === 'administrator') {
      void loadUsers().catch((loadUsersError: unknown) => setError(loadUsersError instanceof Error ? loadUsersError.message : 'Could not load staff.'));
    }
    if (view === 'media') {
      void loadMedia().catch((loadMediaError: unknown) => setError(loadMediaError instanceof Error ? loadMediaError.message : 'Could not load media.'));
    }
  }, [view, staff.role]);

  const visibleItems = useMemo(() => {
    const kind = view === 'weekly_program' || view === 'event' || view === 'devotional' ? view : null;
    return items.filter((item) =>
      (!kind || item.kind === kind)
      && (filter === 'all' || item.status === filter)
      && (!search || item.title.toLowerCase().includes(search.toLowerCase())),
    );
  }, [items, view, filter, search]);

  function changeView(next: View) {
    if (dirty && !window.confirm('Discard your unsaved changes and leave this editor?')) return;
    setDraft(null);
    setEditing(null);
    setDirty(false);
    setPreview(false);
    setPreviewHtml('');
    setSelectedImage(null);
    setError('');
    setNotice('');
    setView(next);
  }

  function editItem(item: ContentItem) {
    if (dirty && !window.confirm('Discard your unsaved changes and open another item?')) return;
    setEditing(item);
    setDraft(toDraft(item));
    setDirty(false);
    setPreview(false);
    setPreviewHtml('');
    setError('');
    setNotice('');
    setView(item.kind);
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => current ? { ...current, ...patch } : current);
    setDirty(true);
  }

  function updateData(key: string, value: unknown) {
    setDraft((current) => current ? { ...current, data: { ...current.data, [key]: value } } : current);
    setPreview(false);
    setPreviewHtml('');
    setDirty(true);
  }

  function createItem(kind: ContentKind) {
    if (dirty && !window.confirm('Discard your unsaved changes and create another item?')) return;
    setEditing(null);
    setDraft(newDraft(kind));
    setSelectedImage(null);
    setDirty(false);
    setPreview(false);
    setPreviewHtml('');
    setError('');
    setNotice('');
    setView(kind);
  }

  function addException() {
    if (!draft || !exceptionDate) return;
    const exceptions = Array.isArray(draft.data.exceptions) ? draft.data.exceptions as Record<string, string>[] : [];
    if (exceptions.some((item) => item.date === exceptionDate)) {
      setError('There is already a date-specific change for this date.');
      return;
    }
    updateData('exceptions', [
      ...exceptions,
      { date: exceptionDate, status: exceptionStatus, startTime: exceptionTime, venue: exceptionVenue, note: '' },
    ]);
    setExceptionDate('');
    setExceptionTime('');
    setExceptionVenue('');
    setError('');
  }

  function insertMarkdown(before: string, after = '') {
    const input = messageRef.current;
    if (!input || !draft) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const message = text(draft.data, 'message');
    const selected = message.slice(start, end) || 'text';
    const next = `${message.slice(0, start)}${before}${selected}${after}${message.slice(end)}`;
    updateData('message', next);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  async function uploadImage() {
    if (!selectedImage || !draft) return;
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.set('file', selectedImage);
      body.set('altText', draft.imageAlt);
      const response = await fetch('/api/admin/media', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Image upload failed.');
      updateDraft({ imageUrl: result.url, imageAlt: result.alt });
      setSelectedImage(null);
      setNotice('Image uploaded. Save the content item to attach it.');
      await loadMedia();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function saveContent(status = draft?.status) {
    if (!draft || !status) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const data = { ...draft.data };
      if (draft.kind === 'event') {
        data.speakers = String(data.speakers ?? '').split(',').map((speaker) => speaker.trim()).filter(Boolean);
      }
      if (draft.kind === 'weekly_program' && typeof data.specificDates === 'string') {
        data.specificDates = data.specificDates.split(',').map((date) => date.trim()).filter(Boolean);
      }
      const publicationDate = draft.kind === 'devotional' ? text(data, 'publicationDate') : null;
      const payload = {
        kind: draft.kind,
        title: draft.title,
        slug: draft.slug,
        status,
        publish_at: status === 'scheduled' ? toDateTime(draft.publishAt) : null,
        starts_at: draft.kind === 'event' ? toDateTime(`${text(data, 'startDate')}T${text(data, 'startTime')}`) : null,
        ends_at: draft.kind === 'event' && text(data, 'endTime')
          ? toDateTime(`${text(data, 'endDate')}T${text(data, 'endTime')}`)
          : null,
        publication_date: publicationDate,
        image_url: draft.imageUrl || null,
        image_alt: draft.imageAlt,
        expected_version: editing?.version,
        data,
      };
      const endpoint = editing ? `/api/admin/content/${editing.id}` : '/api/admin/content';
      const response = await fetch(endpoint, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not save this item.');
      const savedItem = result.item as ContentItem;
      setItems((current) => editing
        ? current.map((item) => item.id === savedItem.id ? savedItem : item)
        : [savedItem, ...current]);
      setEditing(savedItem);
      setDraft(toDraft(savedItem));
      setDirty(false);
      setPreview(false);
      setPreviewHtml('');
      setNotice(status === 'published' ? 'Published successfully.' : status === 'scheduled' ? 'Publication scheduled.' : 'Saved successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this item.');
    } finally {
      setBusy(false);
    }
  }

  async function togglePreview() {
    if (preview) {
      setPreview(false);
      return;
    }
    if (!draft || draft.kind !== 'devotional') {
      setPreview(true);
      return;
    }
    setPreviewBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: text(draft.data, 'message') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not render the preview.');
      setPreviewHtml(result.html as string);
      setPreview(true);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Could not render the preview.');
    } finally {
      setPreviewBusy(false);
    }
  }

  async function deleteItem(item: ContentItem) {
    if (!window.confirm(`Permanently delete “${item.title}”? This cannot be undone.`)) return;
    setError('');
    const response = await fetch(`/api/admin/content/${item.id}?version=${item.version}`, { method: 'DELETE' });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not delete the item.');
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (editing?.id === item.id) {
      setEditing(null);
      setDraft(null);
      setDirty(false);
    }
    setNotice('Item deleted.');
  }

  async function inviteStaff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: staffEmail, role: staffRole }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not invite staff member.');
      setStaffEmail('');
      setNotice('Invitation sent. Ask the staff member to check their email.');
      await loadUsers();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Could not invite staff member.');
    } finally {
      setBusy(false);
    }
  }

  async function updateStaff(id: string, changes: { role?: StaffRole; active?: boolean }) {
    setError('');
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Could not update staff account.');
      return;
    }
    await loadUsers();
    setNotice('Staff account updated.');
  }

  async function signOut() {
    try {
      const { error: signOutError } = await authClient.signOut();
      if (signOutError) throw signOutError;
      router.replace('/admin/login');
      router.refresh();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Could not sign out.');
    }
  }

  const currentKind = view === 'weekly_program' || view === 'event' || view === 'devotional' ? view : null;
  const recentDevotionals = byKind(items, 'devotional').slice(0, 5);
  const drafts = items.filter((item) => item.status === 'draft');
  const upcoming = items.filter((item) =>
    item.kind !== 'devotional'
    && item.status === 'published'
    && (item.kind === 'weekly_program' || (item.starts_at && new Date(item.starts_at).getTime() >= Date.now())),
  );
  const formHeading = draft?.kind === 'weekly_program'
    ? 'Weekly program'
    : draft?.kind === 'event' ? 'Event' : 'Daily devotional';

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">Salem Africa <span>Content studio</span></Link>
        <nav aria-label="Admin navigation" className="admin-navigation">
          {NAV_ITEMS.filter((item) => item.view !== 'users' || staff.role === 'administrator').map((item) => (
            <button
              type="button"
              key={item.view}
              onClick={() => changeView(item.view)}
              className={view === item.view ? 'is-active' : ''}
              aria-current={view === item.view ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-account">
          <strong>{staff.email}</strong>
          <span>{staff.role === 'administrator' ? 'Administrator' : 'Editor'}</span>
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Salem Africa</p>
            <h1>{NAV_ITEMS.find((item) => item.view === view)?.label}</h1>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" className="admin-secondary-button" onClick={() => createItem('weekly_program')}>Add Weekly Program</button>
            <button type="button" className="admin-secondary-button" onClick={() => createItem('event')}>Add Event</button>
            <button type="button" className="admin-primary-button" onClick={() => createItem('devotional')}>Write Devotional</button>
          </div>
        </header>

        {notice && <p role="status" className="admin-feedback admin-success">{notice}</p>}
        {error && <p role="alert" className="admin-feedback admin-error">{error}</p>}
        {loadError && <p role="alert" className="admin-feedback admin-error">{loadError}</p>}

        {view === 'dashboard' && (
          <div className="admin-dashboard-content">
            <div className="admin-stat-grid">
              <article><span>Upcoming programs and events</span><strong>{upcoming.length}</strong></article>
              <article><span>Recent devotionals</span><strong>{recentDevotionals.length}</strong></article>
              <article><span>Drafts awaiting publication</span><strong>{drafts.length}</strong></article>
            </div>
            <div className="admin-dashboard-columns">
              <section className="admin-panel">
                <h2>Upcoming programs and events</h2>
                {upcoming.slice(0, 6).map((item) => (
                  <button type="button" key={item.id} className="admin-list-row" onClick={() => editItem(item)}>
                    <span><strong>{item.title}</strong><small>{item.kind === 'event' ? 'Event' : 'Weekly program'}</small></span>
                    <time>{item.starts_at ? new Date(item.starts_at).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : ''}</time>
                  </button>
                ))}
                {!upcoming.length && <p className="admin-empty">No upcoming dated programs or events yet.</p>}
              </section>
              <section className="admin-panel">
                <h2>Recent devotionals</h2>
                {recentDevotionals.map((item) => (
                  <button type="button" key={item.id} className="admin-list-row" onClick={() => editItem(item)}>
                    <span><strong>{item.title}</strong><small>{item.status}</small></span>
                    <time>{item.publication_date ?? ''}</time>
                  </button>
                ))}
                {!recentDevotionals.length && <p className="admin-empty">No devotionals yet. Start with a new draft.</p>}
              </section>
            </div>
            <section className="admin-panel">
              <h2>Drafts awaiting publication</h2>
              {drafts.slice(0, 8).map((item) => (
                <button type="button" key={item.id} className="admin-list-row" onClick={() => editItem(item)}>
                  <span><strong>{item.title}</strong><small>{item.kind.replace('_', ' ')}</small></span>
                  <span>Edit draft</span>
                </button>
              ))}
              {!drafts.length && <p className="admin-empty">There are no drafts awaiting publication.</p>}
            </section>
          </div>
        )}

        {currentKind && (
          <div className="admin-content-layout">
            <section className="admin-panel admin-content-list">
              <div className="admin-list-controls">
                <label className="admin-search-label">
                  Search
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title" />
                </label>
                <label>
                  Status
                  <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
              </div>
              {loading ? <p className="admin-empty">Loading content…</p> : visibleItems.map((item) => (
                <div className={`admin-list-row ${editing?.id === item.id ? 'is-selected' : ''}`} key={item.id}>
                  <button type="button" onClick={() => editItem(item)}>
                    <strong>{item.title}</strong>
                    <small>{item.status} · edited {new Date(item.updated_at).toLocaleDateString('en-NG')}</small>
                  </button>
                  <button type="button" aria-label={`Delete ${item.title}`} onClick={() => void deleteItem(item)}>Delete</button>
                </div>
              ))}
              {!loading && !visibleItems.length && <p className="admin-empty">No matching items.</p>}
            </section>

            {draft ? (
              <section className="admin-panel admin-editor">
                <div className="admin-editor-heading">
                  <div>
                    <p className="admin-eyebrow">{editing ? 'Edit content' : 'New draft'}</p>
                    <h2>{draft.title || `New ${formHeading}`}</h2>
                  </div>
                  {editing && <p>Version {editing.version}</p>}
                </div>
                <form onSubmit={(event) => { event.preventDefault(); void saveContent(); }} className="admin-form-stack">
                  <label>
                    Title
                    <input required maxLength={180} value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} />
                  </label>
                  <label>
                    Page address
                    <input value={draft.slug} onChange={(event) => updateDraft({ slug: event.target.value })} placeholder="Created from the title if blank" />
                  </label>

                  {draft.kind === 'weekly_program' && (
                    <>
                      <div className="admin-field-grid">
                        <label>Day of week
                          <select value={text(draft.data, 'dayOfWeek', 'Sunday')} onChange={(event) => updateData('dayOfWeek', event.target.value)}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day}>{day}</option>)}
                          </select>
                        </label>
                        <label>Recurrence
                          <select value={text(draft.data, 'recurrence', 'weekly')} onChange={(event) => updateData('recurrence', event.target.value)}>
                            <option value="weekly">Every week</option>
                            <option value="specific_dates">Specific dates</option>
                          </select>
                        </label>
                        <label>Start time
                          <input type="time" required value={text(draft.data, 'startTime')} onChange={(event) => updateData('startTime', event.target.value)} />
                        </label>
                        <label>End time (optional)
                          <input type="time" value={text(draft.data, 'endTime')} onChange={(event) => updateData('endTime', event.target.value)} />
                        </label>
                      </div>
                      {draft.data.recurrence === 'specific_dates' && (
                        <label>Program dates
                          <input value={Array.isArray(draft.data.specificDates) ? (draft.data.specificDates as string[]).join(', ') : text(draft.data, 'specificDates')} onChange={(event) => updateData('specificDates', event.target.value)} placeholder="YYYY-MM-DD, YYYY-MM-DD" />
                        </label>
                      )}
                      <label>Venue
                        <input required value={text(draft.data, 'venue')} onChange={(event) => updateData('venue', event.target.value)} />
                      </label>
                      <label>Minister or speaker (optional)
                        <input value={text(draft.data, 'minister')} onChange={(event) => updateData('minister', event.target.value)} />
                      </label>
                      <label>Livestream link (optional)
                        <input type="url" value={text(draft.data, 'livestreamUrl')} onChange={(event) => updateData('livestreamUrl', event.target.value)} />
                      </label>
                      <fieldset className="admin-exceptions">
                        <legend>Date-specific change or cancellation</legend>
                        <div className="admin-field-grid">
                          <label>Date<input type="date" value={exceptionDate} onChange={(event) => setExceptionDate(event.target.value)} /></label>
                          <label>Change type
                            <select value={exceptionStatus} onChange={(event) => setExceptionStatus(event.target.value as 'changed' | 'cancelled')}>
                              <option value="cancelled">Cancel this date</option>
                              <option value="changed">Change this date</option>
                            </select>
                          </label>
                          {exceptionStatus === 'changed' && <>
                            <label>New start time<input type="time" value={exceptionTime} onChange={(event) => setExceptionTime(event.target.value)} /></label>
                            <label>New venue<input value={exceptionVenue} onChange={(event) => setExceptionVenue(event.target.value)} /></label>
                          </>}
                        </div>
                        <button type="button" className="admin-secondary-button" onClick={addException}>Add date change</button>
                        {Array.isArray(draft.data.exceptions) && (draft.data.exceptions as Record<string, string>[]).map((entry) => (
                          <div key={entry.date} className="admin-exception-entry">
                            <span>{entry.date}: {entry.status === 'cancelled' ? 'Cancelled' : `Changed${entry.startTime ? ` to ${entry.startTime}` : ''}${entry.venue ? ` at ${entry.venue}` : ''}`}</span>
                            <button type="button" onClick={() => updateData('exceptions', (draft.data.exceptions as Record<string, string>[]).filter((value) => value.date !== entry.date))}>Remove</button>
                          </div>
                        ))}
                      </fieldset>
                    </>
                  )}

                  {draft.kind === 'event' && (
                    <>
                      <label>Theme (optional)
                        <input value={text(draft.data, 'theme')} onChange={(event) => updateData('theme', event.target.value)} />
                      </label>
                      <div className="admin-field-grid">
                        <label>Start date<input type="date" required value={text(draft.data, 'startDate')} onChange={(event) => updateData('startDate', event.target.value)} /></label>
                        <label>End date<input type="date" required value={text(draft.data, 'endDate')} onChange={(event) => updateData('endDate', event.target.value)} /></label>
                        <label>Start time<input type="time" required value={text(draft.data, 'startTime')} onChange={(event) => updateData('startTime', event.target.value)} /></label>
                        <label>End time (optional)<input type="time" value={text(draft.data, 'endTime')} onChange={(event) => updateData('endTime', event.target.value)} /></label>
                      </div>
                      <label>Venue<input required value={text(draft.data, 'venue')} onChange={(event) => updateData('venue', event.target.value)} /></label>
                      <label>Speakers or ministers
                        <input value={Array.isArray(draft.data.speakers) ? (draft.data.speakers as string[]).join(', ') : text(draft.data, 'speakers')} onChange={(event) => updateData('speakers', event.target.value)} placeholder="Separate names with commas" />
                      </label>
                      <label>Registration link (optional)<input type="url" value={text(draft.data, 'registrationUrl')} onChange={(event) => updateData('registrationUrl', event.target.value)} /></label>
                      <label>Livestream link (optional)<input type="url" value={text(draft.data, 'livestreamUrl')} onChange={(event) => updateData('livestreamUrl', event.target.value)} /></label>
                    </>
                  )}

                  {draft.kind === 'devotional' && (
                    <>
                      <div className="admin-field-grid">
                        <label>Publication date
                          <input type="date" required value={text(draft.data, 'publicationDate', dateInLagos())} onChange={(event) => updateData('publicationDate', event.target.value)} />
                          <span>Dates and schedules use Africa/Lagos time (WAT, UTC+01:00).</span>
                        </label>
                        <label>Author<input required value={text(draft.data, 'author')} onChange={(event) => updateData('author', event.target.value)} /></label>
                        <label>Bible reference<input required value={text(draft.data, 'bibleReference')} onChange={(event) => updateData('bibleReference', event.target.value)} placeholder="e.g. Psalm 23:1" /></label>
                      </div>
                      <label>Scripture text
                        <textarea required rows={4} value={text(draft.data, 'scriptureText')} onChange={(event) => updateData('scriptureText', event.target.value)} />
                      </label>
                      <label>Main devotional message
                        <div className="admin-markdown-toolbar" aria-label="Message formatting">
                          <button type="button" onClick={() => insertMarkdown('## ')}>Heading</button>
                          <button type="button" onClick={() => insertMarkdown('**', '**')}><strong>B</strong></button>
                          <button type="button" onClick={() => insertMarkdown('\n- ')}>List</button>
                          <button type="button" onClick={() => insertMarkdown('[', '](https://)')}>Link</button>
                        </div>
                        <textarea ref={messageRef} required rows={12} value={text(draft.data, 'message')} onChange={(event) => updateData('message', event.target.value)} />
                        <span>Formatting: headings with ##, bold with **, lists with - and links with [text](URL).</span>
                      </label>
                      <label>Prayer<textarea required rows={5} value={text(draft.data, 'prayer')} onChange={(event) => updateData('prayer', event.target.value)} /></label>
                      <label>Further reading (optional)<input value={text(draft.data, 'furtherReading')} onChange={(event) => updateData('furtherReading', event.target.value)} /></label>
                    </>
                  )}

                  {draft.kind !== 'devotional' && (
                    <label>Description
                      <textarea rows={5} value={text(draft.data, 'description')} onChange={(event) => updateData('description', event.target.value)} />
                    </label>
                  )}

                  <fieldset className="admin-image-field">
                    <legend>Flyer or cover image</legend>
                    <label>Choose an image (JPEG, PNG, WebP, up to 10 MB)
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)} />
                    </label>
                    <label>Alternative text
                      <input value={draft.imageAlt} onChange={(event) => updateDraft({ imageAlt: event.target.value })} placeholder="Describe the image for visitors using screen readers" />
                    </label>
                    {selectedImage && <button type="button" className="admin-secondary-button" onClick={() => void uploadImage()} disabled={busy}>Upload selected image</button>}
                    {draft.imageUrl && <div className="admin-image-preview">
                      <Image src={draft.imageUrl} alt={draft.imageAlt} width={480} height={300} unoptimized />
                      <p>{draft.imageAlt || 'Add alternative text before publishing.'}</p>
                      <label>Replace with media library item
                        <select value="" onChange={(event) => {
                          const file = media.find((entry) => entry.url === event.target.value);
                          if (file) updateDraft({ imageUrl: file.url, imageAlt: draft.imageAlt || file.name });
                        }}>
                          <option value="" disabled>Choose an uploaded image</option>
                          {media.map((file) => <option key={file.name} value={file.url}>{file.name}</option>)}
                        </select>
                      </label>
                    </div>}
                  </fieldset>

                  <div className="admin-field-grid">
                    <label>Publication status
                      <select value={draft.status} onChange={(event) => updateDraft({ status: event.target.value as ContentStatus })}>
                        {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                    {draft.status === 'scheduled' && (
                      <label>Publish at (Africa/Lagos)
                        <input type="datetime-local" required value={draft.publishAt} onChange={(event) => updateDraft({ publishAt: event.target.value })} />
                      </label>
                    )}
                  </div>

                  {preview && <section className="admin-preview" aria-label="Content preview">
                    <p className="admin-eyebrow">Preview</p>
                    <h2>{draft.title || 'Untitled'}</h2>
                    {draft.imageUrl && <Image src={draft.imageUrl} alt={draft.imageAlt} width={720} height={420} unoptimized />}
                    {draft.kind === 'devotional' ? (
                      <>
                        <p>{text(draft.data, 'publicationDate')} · {text(draft.data, 'author')}</p>
                        <h3>{text(draft.data, 'bibleReference')}</h3>
                        <blockquote>{text(draft.data, 'scriptureText')}</blockquote>
                        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        <h3>Prayer</h3><p>{text(draft.data, 'prayer')}</p>
                      </>
                    ) : <p>{text(draft.data, 'description')}</p>}
                  </section>}

                  <div className="admin-editor-actions">
                    <button type="button" className="admin-secondary-button" onClick={() => void togglePreview()} disabled={previewBusy}>{previewBusy ? 'Rendering…' : preview ? 'Hide preview' : 'Preview'}</button>
                    <button type="submit" className="admin-secondary-button" disabled={busy}>Save draft/status</button>
                    {editing?.status === 'published' && (
                      <button type="button" className="admin-secondary-button" disabled={busy} onClick={() => void saveContent('draft')}>Unpublish</button>
                    )}
                    <button type="button" className="admin-primary-button" disabled={busy} onClick={() => void saveContent('published')}>Publish now</button>
                    <button type="button" className="admin-secondary-button" disabled={busy} onClick={() => {
                      if (!draft.publishAt) {
                        setError('Choose a publication date and time in Africa/Lagos before scheduling.');
                        return;
                      }
                      void saveContent('scheduled');
                    }}>Schedule</button>
                    {editing && editing.status !== 'archived' && (
                      <button type="button" className="admin-secondary-button" disabled={busy} onClick={() => void saveContent('archived')}>Archive</button>
                    )}
                  </div>
                  {editing &&                   <p className="admin-audit-line">
                    Created by {editing.created_by_email || 'staff member'} on {new Date(editing.created_at).toLocaleString('en-NG')}
                    {' · '}Last edited by {editing.updated_by_email || 'staff member'} on {new Date(editing.updated_at).toLocaleString('en-NG')}
                  </p>}
                </form>
              </section>
            ) : <section className="admin-panel admin-empty-editor">
              <h2>{currentKind === 'weekly_program' ? 'Manage weekly programs' : currentKind === 'event' ? 'Manage events' : 'Manage devotionals'}</h2>
              <p>Select an item to edit or create a new one. Drafts remain private until published.</p>
              <button type="button" className="admin-primary-button" onClick={() => createItem(currentKind)}>
                {currentKind === 'weekly_program' ? 'Add Weekly Program' : currentKind === 'event' ? 'Add Event' : 'Write Devotional'}
              </button>
            </section>}
          </div>
        )}

        {view === 'media' && (
          <section className="admin-panel">
            <div className="admin-editor-heading"><h2>Media library</h2><p>Uploads are retained in storage. Images attached to published content are never automatically removed.</p></div>
            <div className="admin-media-grid">
              {media.map((file) => (
                <article key={file.name}>
                  <Image src={file.url} alt="" width={360} height={230} unoptimized />
                  <p>{file.name}</p>
                  <button type="button" className="admin-secondary-button" onClick={() => navigator.clipboard.writeText(file.url).then(() => setNotice('Image link copied.')).catch(() => setError('Could not access the clipboard.'))}>Copy image URL</button>
                </article>
              ))}
              {!media.length && <p className="admin-empty">No uploaded images yet. Upload an image from a content editor.</p>}
            </div>
          </section>
        )}

        {view === 'users' && staff.role === 'administrator' && (
          <div className="admin-dashboard-columns">
            <section className="admin-panel">
              <h2>Invite staff</h2>
              <form className="admin-form-stack" onSubmit={(event) => void inviteStaff(event)}>
                <label>Email address<input type="email" required value={staffEmail} onChange={(event) => setStaffEmail(event.target.value)} /></label>
                <label>Role
                  <select value={staffRole} onChange={(event) => setStaffRole(event.target.value as StaffRole)}>
                    <option value="editor">Editor</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </label>
                <button type="submit" className="admin-primary-button" disabled={busy}>Send invitation</button>
                <p>Only administrators can invite staff or change permissions. Public registration is disabled.</p>
              </form>
            </section>
            <section className="admin-panel">
              <h2>Staff accounts</h2>
              {users.map((user) => (
                <article className="admin-list-row admin-user-row" key={user.user_id}>
                  <span><strong>{user.email}</strong><small>{user.active ? 'Active' : 'Disabled'}</small></span>
                  <label className="admin-compact-label">Role
                    <select value={user.role} disabled={user.user_id === staff.userId} onChange={(event) => void updateStaff(user.user_id, { role: event.target.value as StaffRole })}>
                      <option value="editor">Editor</option><option value="administrator">Administrator</option>
                    </select>
                  </label>
                  <button type="button" className="admin-secondary-button" disabled={user.user_id === staff.userId} onClick={() => void updateStaff(user.user_id, { active: !user.active })}>{user.active ? 'Disable' : 'Enable'}</button>
                </article>
              ))}
              {!users.length && <p className="admin-empty">No staff accounts were found.</p>}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
