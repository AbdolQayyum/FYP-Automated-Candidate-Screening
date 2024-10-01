'use client';
import './globals.css';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

export default function Home() {
  const router = useRouter();

  // Navigate to /login for Candidate login
  const handleCandidateLogin = () => {
    router.push('/login');
  };

  // Navigate to /HR/mainHR for HR login
  const handleHRLogin = () => {
    router.push('/HR/mainHR');
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#E9ECEF] p-4 mt-8">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-[#2b6cb0] mb-2">
          Welcome...!
        </h1>
        <p className="text-lg text-[#1b1b1b] font-light max-w-lg mx-auto">
          Find the right path for your career, whether you're an HR professional managing talent or a candidate seeking your dream job.
        </p>
      </div>

      {/* Add Image */}
      <div className="mb-6">
        <Image
          src="/assets/front.jpg" // Add your image path here
          alt="Career Illustration"
          width={220}
          height={220}
          className="object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-6 mb-6">
        {/* Login as HR Button */}
        <Button
          className="bg-[#1b1b1b] text-white px-5 py-3 rounded-xl border hover:bg-[#9c9c9c] hover:text-[#1b1b1b]"
          onClick={handleHRLogin} // Add click handler for HR login
        >
          Login as HR
        </Button>

        {/* Login as Candidate Button */}
        <Button
          className="bg-[#2b6cb0] text-white px-5 py-3 rounded-xl border hover:bg-[#5a8bce]"
          onClick={handleCandidateLogin} // Add click handler for candidate login
        >
          Login as Candidate
        </Button>
      </div>

      {/* Description */}
      <div className="text-center max-w-lg">
        <p className="text-md text-[#1b1b1b] mb-2">
          As an <span className="font-semibold text-[#2b6cb0]">HR professional</span>, post jobs, manage candidates, and recruit top talent effortlessly.
        </p>
        <p className="text-md text-[#1b1b1b]">
          As a <span className="font-semibold text-[#2b6cb0]">candidate</span>, explore job opportunities, apply, and take the next step in your career.
        </p>
      </div>
    </main>
  );
}
