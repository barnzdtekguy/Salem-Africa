export type ContentKind = 'weekly_program' | 'event' | 'devotional';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type ContentItem = {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  status: ContentStatus;
  publish_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  publication_date: string | null;
  publication_date_invalid?: boolean;
  image_url: string | null;
  image_alt: string;
  data: Record<string, unknown>;
  version: number;
  created_by: string | null;
  created_by_email: string | null;
  updated_by: string | null;
  updated_by_email: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicContentResult<T> =
  | { status: 'available'; value: T }
  | { status: 'unavailable'; value: null };
