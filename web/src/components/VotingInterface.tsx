import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'

export default function VotingInterface({ user }: { user: any }) {
  const [candidates, setCandidates] = useState<string[]>([])
  const [votes, setVotes] = useState<{[key: string]: number}>({})
  const [newCandidate, setNewCandidate] = useState('')

  const getCandidates = async () => {
    try {
      const result = await fcl.query({
        cadence: `import Voting from 0x9d2ade18cb6bea1a
                  pub fun main(): [String] {
                    return Voting.getCandidates()
                  }`,
      })
      setCandidates(result)
      
      // Get votes for each candidate
      const votesData: {[key: string]: number} = {}
      for (const candidate of result) {
        const votes = await fcl.query({
          cadence: `import Voting from 0x9d2ade18cb6bea1a
                    pub fun main(candidate: String): UInt64? {
                      return Voting.getVotes(candidate: candidate)
                    }`,
          args: (arg: any, t: any) => [arg(candidate, t.String)],
        })
        votesData[candidate] = votes || 0
      }
      setVotes(votesData)
    } catch (error) {
      console.error(error)
    }
  }

  const addCandidate = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `import Voting from 0x9d2ade18cb6bea1a
                  transaction(candidateName: String) {
                    let adminRef: &Voting.Administrator
                    prepare(signer: AuthAccount) {
                      self.adminRef = signer.borrow<&Voting.Administrator>(from: /storage/VotingAdmin)
                        ?? panic("Could not borrow admin reference")
                    }
                    execute {
                      self.adminRef.addCandidate(name: candidateName)
                    }
                  }`,
        args: (arg: any, t: any) => [arg(newCandidate, t.String)],
        limit: 999,
      })
      
      await fcl.tx(transactionId).onceSealed()
      getCandidates()
      setNewCandidate('')
    } catch (error) {
      console.error(error)
    }
  }

  const castVote = async (candidate: string) => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `import Voting from 0x9d2ade18cb6bea1a
                  transaction(candidate: String) {
                    execute {
                      Voting.castVote(candidate: candidate)
                    }
                  }`,
        args: (arg: any, t: any) => [arg(candidate, t.String)],
        limit: 999,
      })
      
      await fcl.tx(transactionId).onceSealed()
      getCandidates()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCandidates()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Voting System</h1>
      
      {user.loggedIn && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              placeholder="Enter candidate name"
              className="border p-2 rounded"
            />
            <button
              onClick={addCandidate}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Candidate
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate) => (
          <div
            key={candidate}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{candidate}</h3>
              <p>Votes: {votes[candidate] || 0}</p>
            </div>
            {user.loggedIn && (
              <button
                onClick={() => castVote(candidate)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Vote
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}