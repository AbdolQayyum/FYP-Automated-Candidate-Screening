'use client';
import './globals.css';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Navigate to /login for Candidate login
  const handleCandidateLogin = () => {
    router.push('/login');
  };

  // Navigate to /HR/hrlogin for HR login
  const handleHRLogin = () => {
    router.push('/HR/hrlogin');
  };

  const handleHRMain = () => {
    router.push('/HR/mainHR');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#E9ECEF] p-2 mt-8 pt-18">
      <header className="fixed top-0 left-0 w-full z-10 flex flex-col md:flex-row items-center justify-center px-4 md:px-20 py-4 font-medium bg-[#2B4A87] text-[#EFF0F2]">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex justify-center w-full">
            <h1 className="font-bold text-xl md:text-2xl lg:text-2xl text-[#E8AF30] italic text-center">
              Automated Candidate Screening
            </h1>
          </div>
        </div>
      </header>
      
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-[#E8AF30] mb-2"> {/* Navy blue text */}
          Welcome...!
        </h1>
        <p className="text-lg text-[#1b1b1b] font-light max-w-lg mx-auto">
          Find the right path for your career, whether you're an HR professional managing talent or a candidate seeking your dream job.
        </p>
      </div>

      {/* Add Image */}
      <div className="mb-6">
        <Image
          src="/assets/front.jpg"
          alt="Career Illustration"
          width={220}
          height={220}
          className="object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row md:space-x-6 mb-6 space-y-4 md:space-y-0">
        {/* Login as HR Button */}
        <Button
          className="bg-[#2B4A87] text-white px-5 py-3 rounded-xl border hover:bg-[#5a8bce] transition-colors duration-300"
          onClick={handleHRMain}
        >
          Login as HR
        </Button>

        {/* Login as Candidate Button */}
        <Button
          className="bg-[#E8AF30] text-white px-5 py-3 rounded-xl border hover:bg-[#2B4A87] transition-colors duration-300"
          onClick={handleCandidateLogin}
        >
          Login as Candidate
        </Button>
      </div>

      {/* Description */}
      <div className="text-center max-w-lg">
        <p className="text-md text-[#1b1b1b] mb-2">
          As an <span className="font-semibold text-[#2B4A87]">HR professional</span>, post jobs, manage candidates, and recruit top talent effortlessly.
        </p>
        <p className="text-md text-[#1b1b1b]">
          As a <span className="font-semibold text-[#2B4A87]">candidate</span>, explore job opportunities, apply, and take the next step in your career.
        </p>
      </div>
    </main>
  );
}
