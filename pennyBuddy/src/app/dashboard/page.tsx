"use client";
import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import Header from "../../app/header";
import { databases } from "../../../service/appwrite";
import { Query } from "appwrite";
import { account } from '../../../service/appwrite';
import { useRouter } from "next/navigation";

// Update the AccountDetails type
type AccountDetails = {
  accountName: string;
  institutionName: string | null;
  accountType: string;
  balance: number | null;
  transactionDates: string[];   // Array to hold transaction dates
  transactionNames: string[];   // Array to hold transaction names
  transactionAmounts: number[]; // Array to hold transaction amounts
};

const fetchLoggedInUserId = async () => {
  try {
    const session = await account.get();
    if (session && session.$id) {
      return session.$id;
    } else {
      console.error("No session found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
};

const DashboardPage = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  // Fetch the link token from your API
  const fetchLinkToken = async (userId: string) => {
    try {
      const response = await fetch('/api/create_link_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.link_token) {
        setLinkToken(data.link_token);
      } else {
        console.error('Error fetching link token:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Plaid link token:', error);
    }
  };

  // Fetch the bank accounts from the Appwrite database
  const fetchBankAccounts = async (userId: string) => {
    try {
      const result = await databases.listDocuments(
        "670acb9b0015637c4c55", // Replace with your database ID
        "670adcaf000fc99a5bbe", // Replace with your collection ID
        [Query.equal("userId", userId)]
      );

      const accounts = result.documents.map((doc: any) => ({
        accountName: doc.accountName,
        institutionName: doc.institutionName,
        accountType: doc.accountType,
        balance: doc.balance || null,
        transactionDates: doc.transactionDates || [], // Array for transaction dates
        transactionNames: doc.transactionNames || [], // Array for transaction names
        transactionAmounts: doc.transactionAmounts || [], // Array for transaction amounts
      }));

      setAccountDetails(accounts);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  // Fetch balance from Plaid
  const fetchBalance = async (accessToken: string) => {
    try {
      const response = await fetch('/api/fetch_balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      const data = await response.json();
      return data.accounts;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  // Fetch transactions from Plaid
  const fetchTransactions = async (accessToken: string) => {
    try {
      const response = await fetch('/api/fetch_transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      const data = await response.json();
      console.log(data);
      return data.transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  // PlaidLink integration and handling Plaid token exchange
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess: async (publicToken, metadata) => {
      try {
        const response = await fetch("/api/exchange_public_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken }),
        });
        const data = await response.json();

        if (!userId) {
          console.error("User ID not found, cannot save account details.");
          return;
        }

        if (metadata.accounts && metadata.accounts.length > 0) {
          const accounts = metadata.accounts.map((account) => ({
            accountName: account.name,
            institutionName: metadata.institution?.name || "Unknown",
            accountType: account.type,
          }));

          const balance = await fetchBalance(data.access_token);
          const transactions = await fetchTransactions(data.access_token);

          // Break down transactions into separate arrays
          const transactionDates = transactions.map((transaction: any) => transaction.date);
          const transactionNames = transactions.map((transaction: any) => transaction.name);
          const transactionAmounts = transactions.map((transaction: any) => transaction.amount);

          await Promise.all(
            accounts.map(async (account) => {
              await databases.createDocument(
                "670acb9b0015637c4c55", // Replace with your database ID
                "670adcaf000fc99a5bbe", // Replace with your collection ID
                "unique()",
                {
                  accessToken: data.access_token,
                  itemId: data.item_id,
                  accountName: account.accountName,
                  institutionName: account.institutionName,
                  accountType: account.accountType,
                  userId, 
                  balance: balance ? balance[0].balances.current : 0,
                  transactionDates, // Store transaction dates array
                  transactionNames, // Store transaction names array
                  transactionAmounts, // Store transaction amounts array
                }
              );
            })
          );

          fetchBankAccounts(userId!);
        } else {
          console.error("No accounts found in metadata.");
        }
      } catch (error) {
        console.error("Error exchanging public token:", error);
      }
    },
    onExit: (error, metadata) => {
      console.error("Plaid Link Error:", error, metadata);
    },
  });

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await fetchLoggedInUserId();
      if (id) {
        setUserId(id);
        fetchBankAccounts(id);
        fetchLinkToken(id);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
        >
          Log Out
        </button>
        <h1 className="text-3xl font-semibold mb-6 text-gray-600">Welcome to Your Dashboard</h1>
        <button
          onClick={() => ready && open()}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-500 transition duration-300"
        >
          Add Bank Account
        </button>

        {accountDetails.length > 0 ? (
          accountDetails.map((account, index) => (
            <div key={index} className="mt-6 text-gray-600">
              <h2>Linked Bank Account {index + 1}</h2>
              <p><strong>Account Name:</strong> {account.accountName}</p>
              <p><strong>Institution:</strong> {account.institutionName}</p>
              <p><strong>Account Type:</strong> {account.accountType}</p>
              <p><strong>Balance:</strong> {account.balance !== null ? `$${account.balance}` : "N/A"}</p>
              {/* Display transactions */}
              {account.transactionDates.length > 0 ? (
                <div>
                  <h3>Recent Transactions:</h3>
                  {account.transactionDates.map((date, i) => (
                    <p key={i}>
                      {date} - {account.transactionNames[i]}: ${account.transactionAmounts[i]}
                    </p>
                  ))}
                </div>
              ) : (
                <p>No transactions available.</p>
              )}
            </div>
          ))
        ) : (
          <p className="mt-6 text-gray-600">No accounts linked yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
