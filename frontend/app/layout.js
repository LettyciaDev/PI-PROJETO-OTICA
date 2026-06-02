import "./globals.css";
import { ToastProvider } from './components/Toast/toast';
import { CarrinhoProvider } from "./lib/CarrinhoProvider";

export const metadata = {
  title: "Vizzo Ótica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
        <body>
          <ToastProvider>
            <CarrinhoProvider>
              {children}
            </CarrinhoProvider>
          </ToastProvider>
        </body>
    </html>
  );
}