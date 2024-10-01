import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-[#E9ECEF] p-4 mt-10">
      {/* Contact Info */}
      <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-20 my-10">
        <div className="flex flex-col items-center">
          <FaPhoneAlt className="text-2xl mb-2" />
          <p className="font-bold">Call us at</p>
          <p className="text-gray-600">+92 317 4119229</p>
        </div>
        <div className="flex flex-col items-center">
          <FaEnvelope className="text-2xl mb-2" />
          <p className="font-bold">Email</p>
          <p className="text-gray-600">acssupport@gmail.com</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full max-w-2xl bg-white p-8 rounded-md shadow-md">
        <h2 className="font-bold text-2xl mb-6 text-center">Leave a Message</h2>

        <form className="space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold">Your Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Name*"
                className="w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-semibold">Your Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email*"
                className="w-full rounded-md border-gray-300"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block mb-1 font-semibold">Subject</label>
            <Input
              id="subject"
              type="text"
              placeholder="Subject*"
              className="w-full rounded-md border-gray-300"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block mb-1 font-semibold">Your Message</label>
            <Textarea
              id="message"
              placeholder="Write Your Message"
              className="w-full rounded-md border-gray-300"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-700">
              Send Message
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
