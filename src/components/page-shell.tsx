import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
