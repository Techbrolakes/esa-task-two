import ApolloClientProvider from "@/providers/ApolloProvider";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Header from "@/components/Header";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloClientProvider>
          <Suspense>
            <Header />
            <section className="pt-[100px] md:pt-[128px] py-6 min-h-screen overflow-y-auto bg-gradient-to-br from-black via-[#060C21] to-black animate-gradient-x">
              <div className="max-w-[95%] lg:max-w-[85%] mx-auto">{children}</div>
            </section>
          </Suspense>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
