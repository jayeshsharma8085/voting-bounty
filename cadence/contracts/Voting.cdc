pub contract Voting {

    // Event that is emitted when a vote is cast
    pub event VoteCast(candidate: String, votes: UInt64)
    
    // Event that is emitted when a new candidate is added
    pub event CandidateAdded(candidate: String)

    // Dictionary to store votes for each candidate
    access(all) var votes: {String: UInt64}
    
    // Array to store candidate names
    access(all) var candidates: [String]
    
    // Resource that grants the ability to add candidates
    pub resource Administrator {
        // Add a new candidate
        pub fun addCandidate(name: String) {
            pre {
                !Voting.votes.containsKey(name): "Candidate already exists"
            }
            
            Voting.candidates.append(name)
            Voting.votes[name] = 0
            
            emit CandidateAdded(candidate: name)
        }
    }

    // Cast a vote for a candidate
    pub fun castVote(candidate: String) {
        pre {
            self.votes.containsKey(candidate): "Candidate does not exist"
        }

        self.votes[candidate] = self.votes[candidate]! + 1
        
        emit VoteCast(candidate: candidate, votes: self.votes[candidate]!)
    }

    // Get all candidates
    pub fun getCandidates(): [String] {
        return self.candidates
    }

    // Get votes for a specific candidate
    pub fun getVotes(candidate: String): UInt64? {
        return self.votes[candidate]
    }

    init() {
        self.votes = {}
        self.candidates = []

        // Create admin resource and save it to storage
        let admin <- create Administrator()
        self.account.save(<-admin, to: /storage/VotingAdmin)
    }
}