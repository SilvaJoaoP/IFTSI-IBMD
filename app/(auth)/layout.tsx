export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#bfe8ff] to-white"> 
      
      <div className="w-full max-w-md"> 
        {children}
      </div>
    </div>
  );
}