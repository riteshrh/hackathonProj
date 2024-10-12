import React from 'react';
import Link from 'next/link';
import Header from '../app/header'; // Assuming your Header component is already created

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <section className="min-h-screen container mx-auto px-6 py-16 flex flex-col justify-center items-center md:flex-row md:justify-between">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-gray-900">
            Simplify your finances with <span className="text-indigo-600">PennyBuddy</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            PennyBuddy is your comprehensive financial management platform, giving you real-time visibility into your transactions and spending, and enabling easy money transfers between peers. Perfect for managing group expenses, splitting bills, and tracking financial goals.
          </p>
          
          <div className="mt-8 flex space-x-4">
            <Link href="/signup">
              <span className="bg-blue-600 text-white py-3 px-6 rounded-md shadow hover:bg-blue-500">
                Get started
              </span>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <img src="https://wealthandfinance.digital/wp-content/uploads/2021/07/Finance-technology.jpg" alt="Finance Animation" className="w-full max-w-lg"/>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black">
            Problem Statement & Motivation
          </h2>
          <p className="mt-4 text-lg text-black max-w-3xl mx-auto">
            Managing multiple bank accounts and credit cards can make it difficult to track payments and expenses, leading to missed bills, poor budgeting, and financial stress. PennyBuddy consolidates your financial accounts into one intuitive dashboard, helping you monitor spending, manage payments, and make better financial decisions—all from one place.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
