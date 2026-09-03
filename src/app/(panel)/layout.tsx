export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="flex w-full h-screen items-center justify-center px-5">
      {children}
    </div>
  );
}
