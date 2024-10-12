"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { account, databases } from '../../../service/appwrite'; 
import Header from '../../app/header';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    state: '',
    postalCode: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    password: '',
  });

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      // Create a new Appwrite account for the user
      const user = await account.create(
        'unique()',
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`
      );

      const session = await account.createEmailPasswordSession(formData.email, formData.password);
      console.log(session)

      // Store additional form data in your Appwrite database
      await databases.createDocument(
        '670acb9b0015637c4c55',
        '670acba1000741c27b04',
        'unique()',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          state: formData.state,
          postalCode: formData.postalCode,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          userId: user.$id,
        }
      );

      alert('Sign up successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error during sign up. Please try again.');
    }
  };

  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
          <p className="text-center text-gray-600 mb-8">Please enter your details.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-gray-700 font-medium">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your specific address"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-gray-700 font-medium">State</label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="ex: NY"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-gray-700 font-medium">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="11101"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-gray-700 font-medium">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="ssn" className="block text-gray-700 font-medium">SSN</label>
              <input
                type="text"
                id="ssn"
                value={formData.ssn}
                onChange={handleChange}
                placeholder="1234"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <button className="w-full py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-500 transition duration-300">Sign Up</button>
            </div>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <Link href="/login"><span className="text-indigo-600 hover:underline">Login</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
