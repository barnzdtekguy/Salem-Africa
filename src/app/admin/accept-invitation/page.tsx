import type { Metadata } from 'next';
import AcceptInvitationForm from './form';

export const metadata: Metadata = {
  title: 'Accept staff invitation | Salem Africa',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function AcceptInvitationPage() {
  return <AcceptInvitationForm />;
}
