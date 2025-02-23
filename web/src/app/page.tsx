"use client"
import { useEffect, useState } from 'react'
import * as fcl from '@onflow/fcl'
import VotingInterface from '../components/VotingInterface'

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "Flow Voting DApp")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")

export default function Home() {
  const [user, setUser] = useState({ loggedIn: false })

  useEffect(() => {
    fcl.currentUser().subscribe(setUser)
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-8">
          {user.loggedIn ? (
            <button
              onClick={() => fcl.unauthenticate()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button
              onClick={() => fcl.authenticate()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <VotingInterface user={user} />
      </div>
    </main>
  )
}