import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <Header />
      <main className="px-4 py-2 min-h-[calc(100vh-98px)]">{children}</main>
      <Footer />
    </div>
  );
}
